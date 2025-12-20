"use client";

import { useEffect, useState } from "react";

type CopyEmailProps = {
  email?: string;
  className?: string;
  wrapperClassName?: string;
  messageClassName?: string;
  message?: string;
};

const DEFAULT_EMAIL = "operations@dryforce.co.za";
const DEFAULT_MESSAGE = "Email copied. Paste it into the To field of your email system.";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

export default function CopyEmail({
  email = DEFAULT_EMAIL,
  className,
  wrapperClassName,
  messageClassName,
  message = DEFAULT_MESSAGE,
}: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 3000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    const success = await copyText(email);
    setCopied(success);
  };

  const buttonClassName = className
    ? `bg-transparent border-0 p-0 text-left ${className}`
    : "bg-transparent border-0 p-0 text-left";

  return (
    <div className={wrapperClassName ? `flex flex-col gap-1 ${wrapperClassName}` : "flex flex-col gap-1"}>
      <button className={buttonClassName} type="button" onClick={handleCopy}>
        {email}
      </button>
      <span
        className={
          messageClassName
            ? `${messageClassName} ${copied ? "opacity-100" : "opacity-0"} transition-opacity`
            : `text-xs text-blue-200 transition-opacity ${copied ? "opacity-100" : "opacity-0"}`
        }
        role="status"
        aria-live="polite"
      >
        {message}
      </span>
    </div>
  );
}
