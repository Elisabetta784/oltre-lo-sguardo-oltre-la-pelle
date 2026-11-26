/** Decorative signature shared by editorial headings and explanatory text. */
export function BrandSlashes({
  count = 3,
  className = "",
}: {
  count?: 1 | 3 | 5;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block align-baseline whitespace-nowrap font-display font-bold text-[0.85em] tracking-[0.12em] text-current opacity-55 select-none pointer-events-none ${className}`}
    >
      {"/".repeat(count)}
    </span>
  );
}
