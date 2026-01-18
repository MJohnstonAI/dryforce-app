"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: string;
  className?: string;
  disabled?: boolean;
};

export default function SubmitButton({ children, className, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      className={className}
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
    >
      {pending ? "Sending..." : children}
    </button>
  );
}
