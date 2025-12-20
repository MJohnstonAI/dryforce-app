import type { HTMLAttributes } from "react";

type MaterialSymbolProps = {
  name: string;
  className?: string;
  ariaLabel?: string;
} & HTMLAttributes<HTMLSpanElement>;

export default function MaterialSymbol({
  name,
  className,
  ariaLabel,
  ...rest
}: MaterialSymbolProps) {
  const classes = ["material-symbols-outlined", className]
    .filter(Boolean)
    .join(" ");

  if (ariaLabel) {
    return (
      <span className={classes} role="img" aria-label={ariaLabel} {...rest}>
        {name}
      </span>
    );
  }

  return (
    <span className={classes} aria-hidden="true" {...rest}>
      {name}
    </span>
  );
}
