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

/** A small accumulation of traces, reserved for collective section openings. */
export function BrandSlashCluster({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 flex-col items-start gap-[3px] whitespace-nowrap font-display font-normal text-[9px] leading-none tracking-[0.14em] text-current opacity-45 select-none pointer-events-none ${className}`}
    >
      <span>///&nbsp;&nbsp;/////</span>
      <span className="ml-4">/////&nbsp;&nbsp;/</span>
    </span>
  );
}
