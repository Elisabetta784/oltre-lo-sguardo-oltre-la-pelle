#!/usr/bin/env python3
"""Optimize referenced archive images without changing decoded pixels.

Requires Pillow with WebP support. Dry run by default; use --apply to update
source URLs and replace tracked originals only when a smaller, pixel-identical
WebP is available. Unavailable local files are skipped with a bounded timeout.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile


def convert_one(root, url, staging):
    from PIL import Image
    source = root / "public" / url.lstrip("/")
    raw = source.read_bytes()
    with Image.open(BytesIO(raw)) as image:
        if getattr(image, "is_animated", False) or image.mode not in ("RGB", "RGBA", "L", "LA", "P"):
            return {"url": url, "status": "unsupported"}
        if image.mode in ("L", "LA") and image.info.get("icc_profile"):
            return {"url": url, "status": "profile_kept"}
        options = {key: image.info[key] for key in ("icc_profile", "exif", "xmp") if image.info.get(key)}
        output = BytesIO()
        image.save(output, "WEBP", lossless=True, exact=True, method=6, **options)
        encoded = output.getvalue()
        if len(encoded) >= len(raw) * 0.95 or len(raw) - len(encoded) < 512:
            return {"url": url, "status": "original_smaller"}
        with Image.open(BytesIO(encoded)) as decoded:
            if decoded.size != image.size or decoded.convert("RGBA").tobytes() != image.convert("RGBA").tobytes():
                raise ValueError("Decoded pixels differ")
            for key in ("icc_profile", "exif", "xmp"):
                actual = decoded.info.get(key, b"")
                expected = options.get(key, b"")
                # JPEG may include the EXIF wrapper; WebP stores the same TIFF payload.
                if key == "exif":
                    actual = actual.removeprefix(b"Exif\x00\x00")
                    expected = expected.removeprefix(b"Exif\x00\x00")
                if actual != expected:
                    raise ValueError(f"Metadata differs: {key}")
        target_url = str(Path(url).with_suffix(".webp"))
        target = staging / "converted" / target_url.lstrip("/")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(encoded)
        backup = staging / "originals" / url.lstrip("/")
        backup.parent.mkdir(parents=True, exist_ok=True)
        backup.write_bytes(raw)
        return {"url": url, "new_url": target_url, "status": "optimized", "before": len(raw), "after": len(encoded), "format": image.format}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--timeout", type=int, default=12)
    parser.add_argument("--report")
    parser.add_argument("--only", nargs="+", help="Restrict the check to these archive URLs")
    parser.add_argument("--single", nargs=3, metavar=("ROOT", "URL", "STAGING"), help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.single:
        root, url, staging = args.single
        print(json.dumps(convert_one(Path(root), url, Path(staging))))
        return
    root = Path(__file__).resolve().parent.parent
    sources = {path: path.read_text() for path in (root / "src").rglob("*") if path.suffix in (".ts", ".tsx")}
    pattern = r'''["'](/archive/[^"'\s]+\.(?:jpe?g|png))["']'''
    urls = sorted({url for content in sources.values() for url in re.findall(pattern, content)})
    tracked = set(subprocess.check_output(["git", "ls-files", "public/archive"], cwd=root, text=True).splitlines())
    urls = [url for url in urls if "public" + url in tracked]
    if args.only:
        urls = [url for url in urls if url in set(args.only)]
    staging = Path(tempfile.mkdtemp(prefix="oltre-image-optimization-"))
    print(f"Checking {len(urls)} referenced images; lossless conversion only.", flush=True)

    def run(url):
        try:
            result = subprocess.run([sys.executable, str(Path(__file__).resolve()), "--single", str(root), url, str(staging)], text=True, capture_output=True, timeout=args.timeout)
            if result.returncode:
                return {"url": url, "status": "error", "reason": result.stderr[-400:]}
            return json.loads(result.stdout)
        except subprocess.TimeoutExpired:
            return {"url": url, "status": "unavailable"}

    results = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for future in as_completed([pool.submit(run, url) for url in urls]):
            results.append(future.result())
            if len(results) % 30 == 0:
                print(f"Checked {len(results)}/{len(urls)}; {sum(r['status'] == 'optimized' for r in results)} smaller lossless versions.", flush=True)
    converted = [r for r in results if r["status"] == "optimized"]
    mapping = {r["url"]: r["new_url"] for r in converted}
    if args.apply:
        # Validate every destination before changing any source or removing originals.
        for old, new in mapping.items():
            destination = root / "public" / new.lstrip("/")
            if destination.exists():
                raise FileExistsError(destination)
        for old, new in mapping.items():
            shutil.copy2(staging / "converted" / new.lstrip("/"), root / "public" / new.lstrip("/"))
        for path, content in sources.items():
            updated = re.sub(pattern, lambda match: match[0].replace(match[1], mapping.get(match[1], match[1])), content)
            if content != updated:
                path.write_text(updated)
        for old in mapping:
            (root / "public" / old.lstrip("/")).unlink()
    counts = {status: sum(r["status"] == status for r in results) for status in sorted({r["status"] for r in results})}
    saved = sum(r["before"] - r["after"] for r in converted)
    report = {"applied": args.apply, "counts": counts, "saved_bytes": saved, "original_bytes": sum(r["before"] for r in converted), "optimized_bytes": sum(r["after"] for r in converted), "staging": str(staging), "results": results}
    if args.report:
        Path(args.report).write_text(json.dumps(report, indent=2))
    print(json.dumps({key: value for key, value in report.items() if key != "results"}), flush=True)


if __name__ == "__main__":
    main()
