import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MaterialSymbol from "@/components/MaterialSymbol";
import CopyEmail from "@/components/CopyEmail";
import MobileMenu from "@/components/MobileMenu";
import { rateLimit } from "@/lib/rate-limit";

export const metadata: Metadata = {
  title: "Dry Force - Emergency & Booking",
  description:
    "Schedule an assessment or request immediate flood and fire recovery support in South Africa.",
  alternates: {
    canonical: "/emergency",
  },
  openGraph: {
    title: "Dry Force - Emergency & Booking",
    description:
      "Schedule an assessment or request immediate flood and fire recovery support in South Africa.",
    url: "/emergency",
    images: ["/images/emergency-texture.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dry Force - Emergency & Booking",
    description:
      "Schedule an assessment or request immediate flood and fire recovery support.",
    images: ["/images/emergency-texture.png"],
  },
};

const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Partners", href: "#" },
  { label: "Contact", href: "/contact" },
];

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Dry Force <onboarding@resend.dev>";
const RESEND_TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "operations@dryforce.co.za";
const BOOKING_RATE_LIMIT_WINDOW_MS = 60_000;
const BOOKING_RATE_LIMIT_MAX = 3;
const BOOKING_TIMEOUT_MS = 4000;
const BOOKING_RETRY_DELAY_MS = 250;
const BOOKING_MAX_RETRIES = 1;
const BOOKING_MAX_INFLIGHT = 10;
const SERVICE_TYPES = new Map([
  ["flood", "Flood Damage"],
  ["fire", "Fire Recovery"],
]);
const TIME_SLOTS = ["09:00", "11:30", "14:00"];
const METROS = ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth"];
const SEVERITIES = new Map([
  ["minor", "Minor"],
  ["moderate", "Moderate"],
  ["critical", "Critical"],
]);

let bookingInflight = 0;

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidPhone(value: string) {
  return /^[+()\d\s-]{7,20}$/.test(value);
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= BOOKING_MAX_RETRIES) {
    try {
      return await fetchWithTimeout(url, options, BOOKING_TIMEOUT_MS);
    } catch (error) {
      lastError = error;
      if (attempt === BOOKING_MAX_RETRIES) break;
      await new Promise((resolve) => setTimeout(resolve, BOOKING_RETRY_DELAY_MS * (attempt + 1)));
      attempt += 1;
    }
  }

  throw lastError;
}

async function requestAssessment(formData: FormData) {
  "use server";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY.");
    return redirect("/emergency?status=error&reason=config#booking");
  }

  const serviceType = getFormValue(formData, "serviceType");
  const preferredDate = getFormValue(formData, "preferredDate");
  const preferredTime = getFormValue(formData, "preferredTime");
  const fullName = getFormValue(formData, "fullName");
  const phone = getFormValue(formData, "phone");
  const location = getFormValue(formData, "location");
  const severity = getFormValue(formData, "severity");

  if (!SERVICE_TYPES.has(serviceType)) {
    return redirect("/emergency?status=error&reason=service#booking");
  }

  if (!fullName) {
    return redirect("/emergency?status=error&reason=validation#booking");
  }

  if (!phone || !isValidPhone(phone)) {
    return redirect("/emergency?status=error&reason=phone#booking");
  }

  if (!preferredDate || !isValidDateValue(preferredDate)) {
    return redirect("/emergency?status=error&reason=date#booking");
  }

  const dateParts = preferredDate.split("-").map(Number);
  const selectedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return redirect("/emergency?status=error&reason=date#booking");
  }

  if (!TIME_SLOTS.includes(preferredTime)) {
    return redirect("/emergency?status=error&reason=time#booking");
  }

  if (!METROS.includes(location)) {
    return redirect("/emergency?status=error&reason=location#booking");
  }

  if (!SEVERITIES.has(severity)) {
    return redirect("/emergency?status=error&reason=severity#booking");
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";

  const rate = rateLimit({
    key: `${clientIp}|${phone}`,
    limit: BOOKING_RATE_LIMIT_MAX,
    windowMs: BOOKING_RATE_LIMIT_WINDOW_MS,
  });

  if (!rate.ok) {
    return redirect("/emergency?status=error&reason=rate#booking");
  }

  if (bookingInflight >= BOOKING_MAX_INFLIGHT) {
    return redirect("/emergency?status=error&reason=busy#booking");
  }

  bookingInflight += 1;
  try {
    const payload = {
      from: RESEND_FROM_EMAIL,
      to: [RESEND_TO_EMAIL],
      subject: "Emergency assessment request",
      html: `
        <h2>Emergency assessment request</h2>
        <p><strong>Incident type:</strong> ${SERVICE_TYPES.get(serviceType)}</p>
        <p><strong>Preferred date:</strong> ${preferredDate}</p>
        <p><strong>Preferred time:</strong> ${preferredTime}</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Severity:</strong> ${SEVERITIES.get(severity)}</p>
      `,
      text: [
        "Emergency assessment request",
        `Incident type: ${SERVICE_TYPES.get(serviceType)}`,
        `Preferred date: ${preferredDate}`,
        `Preferred time: ${preferredTime}`,
        `Name: ${fullName}`,
        `Phone: ${phone}`,
        `Location: ${location}`,
        `Severity: ${SEVERITIES.get(severity)}`,
      ].join("\n"),
    };

    const response = await fetchWithRetry(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend error:", errorText);
      return redirect("/emergency?status=error&reason=send#booking");
    }
  } catch (error) {
    console.error("Resend error:", error);
    return redirect("/emergency?status=error&reason=send#booking");
  } finally {
    bookingInflight -= 1;
  }

  return redirect("/emergency?status=success#booking");
}

type EmergencyBookingPageProps = {
  searchParams?:
    | {
        status?: string;
        reason?: string;
      }
    | Promise<{
        status?: string;
        reason?: string;
      }>;
};

export default async function EmergencyBookingPage({
  searchParams,
}: EmergencyBookingPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const status = resolvedSearchParams?.status;
  const reason = resolvedSearchParams?.reason;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = new Date(year, month, now.getDate());
  const monthLabel = now.toLocaleString("en-ZA", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const calendarCells: Array<{
    day: number;
    value?: string;
    isOutside?: boolean;
    isPast?: boolean;
  }> = [];

  for (let i = 0; i < startDay; i += 1) {
    calendarCells.push({
      day: prevMonthDays - startDay + 1 + i,
      isOutside: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    calendarCells.push({
      day,
      value: formatDateValue(date),
      isPast: date < today,
    });
  }

  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  for (let i = 1; i <= totalCells - calendarCells.length; i += 1) {
    calendarCells.push({ day: i, isOutside: true });
  }

  const defaultDateValue =
    calendarCells.find((cell) => cell.value && !cell.isPast)?.value ?? "";

  const statusMessage = (() => {
    if (status === "success") {
      return {
        tone: "success",
        text: "Thanks, your assessment request is in. We will call you shortly to confirm.",
      };
    }

    if (status === "error") {
      switch (reason) {
        case "service":
          return { tone: "error", text: "Select an incident type to continue." };
        case "date":
          return { tone: "error", text: "Select a valid assessment date." };
        case "time":
          return { tone: "error", text: "Select an available time slot." };
        case "location":
          return { tone: "error", text: "Select a metro area for your property." };
        case "severity":
          return { tone: "error", text: "Select an estimated damage level." };
        case "phone":
          return { tone: "error", text: "Enter a valid phone number." };
        case "rate":
          return { tone: "error", text: "Too many requests. Please try again soon." };
        case "busy":
          return { tone: "error", text: "We are busy right now. Please retry shortly." };
        case "config":
          return {
            tone: "error",
            text: "Form is temporarily unavailable. Please call 0860 800 800.",
          };
        default:
          return {
            tone: "error",
            text: "We could not submit your request. Please try again.",
          };
      }
    }

    return null;
  })();
  return (
    <div className="theme-emergency bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-white antialiased">
      <div className="relative w-full border-b border-surface-border bg-white dark:bg-surface-dark dark:border-[#2a3447] shadow-sm z-20">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline leading-none select-none">
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-secondary">DRY</span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-primary italic ml-0.5">
                FORCE
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] leading-tight mt-1">
              South Africa&apos;s No.1 Drying Company
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="text-sm font-semibold text-slate-600 hover:text-secondary transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-sm font-semibold text-slate-600 hover:text-secondary transition-colors"
              href="/services"
            >
              Services
            </Link>
            <a className="text-sm font-semibold text-slate-600 hover:text-secondary transition-colors" href="#">
              Partners
            </a>
            <Link
              className="text-sm font-semibold text-slate-600 hover:text-secondary transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Open 24 Hours
              </span>
              <CopyEmail
                className="text-xs font-semibold text-primary hover:text-secondary transition-colors text-right"
                wrapperClassName="items-end"
                messageClassName="text-[10px] text-slate-400"
              />
            </div>
            <a
              className="hidden md:flex items-center justify-center rounded-lg h-10 px-6 bg-secondary hover:bg-secondary-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              href="tel:0860800800"
            >
              <MaterialSymbol name="call" className="mr-2 text-[20px]" />
              <span>0860 800 800</span>
            </a>
            <MobileMenu
              buttonClassName="p-2 text-slate-900 dark:text-white"
              emergencyHref="tel:0860800800"
              emergencyLabel="Call 0860 800 800"
              links={MOBILE_LINKS}
            />
          </div>
        </div>
      </div>

      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        <div className="lg:w-5/12 xl:w-1/3 bg-primary dark:bg-surface-dark border-r border-primary-hover dark:border-[#2a3447] flex flex-col relative overflow-hidden text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url('/images/emergency-texture.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary-hover/95 dark:from-surface-dark/95 dark:to-background-dark/95 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full p-8 lg:p-12 justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(218,41,28,0.8)]"></span>
                Open 24 Hours
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
                Immediate Flood &amp; <br />
                <span className="text-secondary italic">Fire Recovery</span>
              </h1>
              <p className="text-lg text-indigo-100/80 mb-10 leading-relaxed font-medium">
                Specialized restoration services for South African metros. We minimize the damage
                and accelerate your recovery process.
              </p>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8 shadow-inner">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-lg">
                  <MaterialSymbol name="emergency" className="text-secondary" />
                  Emergency Assistance?
                </h3>
                <p className="text-indigo-100 text-sm mb-5 opacity-90">
                  Our team handles property restoration. For immediate service call our 24/7 hotline.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    className="inline-flex w-full items-center justify-center rounded-lg bg-secondary hover:bg-secondary-hover text-white font-bold h-12 text-lg transition-all shadow-lg hover:shadow-red-900/20 border border-red-500"
                    href="tel:0860800800"
                  >
                    Call 0860 800 800
                  </a>
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white/90">
                    <MaterialSymbol name="mail" className="text-lg" />
                    <CopyEmail
                      className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
                      wrapperClassName="items-center"
                      messageClassName="text-xs text-white/70"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold text-indigo-200/60 uppercase tracking-widest mb-4">
                  Operational Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white/10 border border-white/10 text-white rounded text-xs font-semibold backdrop-blur-sm">
                    Johannesburg
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 border border-white/10 text-white rounded text-xs font-semibold backdrop-blur-sm">
                    Cape Town
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 border border-white/10 text-white rounded text-xs font-semibold backdrop-blur-sm">
                    Durban
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 border border-white/10 text-white rounded text-xs font-semibold backdrop-blur-sm">
                    Pretoria
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 border border-white/10 text-white rounded text-xs font-semibold backdrop-blur-sm">
                    Port Elizabeth
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-indigo-200 text-xs font-medium border-t border-white/10 pt-6">
                <div className="flex items-center gap-1.5">
                  <MaterialSymbol name="verified_user" className="text-[18px] text-secondary" />
                  <span>Fully Insured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MaterialSymbol name="check_circle" className="text-[18px] text-secondary" />
                  <span>SABS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
          <div className="max-w-3xl mx-auto w-full p-6 lg:p-12 relative z-10">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-primary dark:text-white mb-2 tracking-tight">
                Schedule Assessment
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Book a non-urgent damage assessment or consultation.
              </p>
            </div>
            <div className="mb-10 bg-white dark:bg-surface-dark p-4 rounded-xl border border-surface-border dark:border-gray-700 shadow-sm">
              <div className="flex gap-6 justify-between mb-3">
                <p className="text-sm font-bold text-primary dark:text-blue-400 uppercase tracking-wide">
                  Service Selection
                </p>
                <p className="text-sm font-bold text-slate-400">Step 1 of 1</p>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-full rounded-full shadow-[0_0_10px_rgba(218,41,28,0.5)]"></div>
              </div>
            </div>
            <form className="space-y-8" action={requestAssessment} id="booking">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Type of Incident
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="relative flex cursor-pointer rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark p-5 shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all group">
                    <input
                      className="sr-only peer"
                      name="serviceType"
                      type="radio"
                      value="flood"
                      defaultChecked
                      required
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="size-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-primary dark:text-indigo-400 flex items-center justify-center peer-checked:bg-primary peer-checked:text-white transition-all shadow-sm group-hover:scale-105">
                        <MaterialSymbol name="water_drop" className="text-2xl" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-slate-900 dark:text-white peer-checked:text-primary dark:peer-checked:text-indigo-400">
                          Flood Damage
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Water extraction &amp; drying
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-[10px] border-2 border-transparent peer-checked:border-primary pointer-events-none"></div>
                    <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity text-primary">
                      <MaterialSymbol name="check_circle" className="fill" />
                    </div>
                  </label>
                  <label className="relative flex cursor-pointer rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark p-5 shadow-sm hover:border-secondary/50 dark:hover:border-secondary/50 focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all group">
                    <input
                      className="sr-only peer"
                      name="serviceType"
                      type="radio"
                      value="fire"
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="size-12 rounded-lg bg-red-50 dark:bg-red-900/20 text-secondary dark:text-red-400 flex items-center justify-center peer-checked:bg-secondary peer-checked:text-white transition-all shadow-sm group-hover:scale-105">
                        <MaterialSymbol name="local_fire_department" className="text-2xl" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-slate-900 dark:text-white peer-checked:text-secondary dark:peer-checked:text-red-400">
                          Fire Recovery
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Soot cleanup &amp; restoration
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-[10px] border-2 border-transparent peer-checked:border-secondary pointer-events-none"></div>
                    <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity text-secondary">
                      <MaterialSymbol name="check_circle" className="fill" />
                    </div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Select Date
                  </label>
                  <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-gray-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <button
                        className="p-1 rounded-lg text-slate-400 transition-colors opacity-40 cursor-not-allowed"
                        type="button"
                        aria-disabled="true"
                        disabled
                      >
                        <MaterialSymbol name="chevron_left" />
                      </button>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {monthLabel}
                      </span>
                      <button
                        className="p-1 rounded-lg text-slate-400 transition-colors opacity-40 cursor-not-allowed"
                        type="button"
                        aria-disabled="true"
                        disabled
                      >
                        <MaterialSymbol name="chevron_right" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Su</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Mo</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tu</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">We</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Th</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Fr</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-sm">
                      {calendarCells.map((cell, index) => {
                        const isSelectable = Boolean(cell.value) && !cell.isPast;
                        const isOutside = cell.isOutside;
                        const spanClasses = [
                          "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                          isSelectable
                            ? "text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                            : "text-slate-300 cursor-not-allowed",
                          isOutside ? "text-slate-300 pointer-events-none" : "",
                          "peer-checked:bg-primary peer-checked:text-white peer-checked:font-bold peer-checked:shadow-md peer-checked:shadow-indigo-900/20",
                          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <label className="flex items-center justify-center" key={`day-${index}`}>
                            <input
                              className="sr-only peer"
                              type="radio"
                              name="preferredDate"
                              value={cell.value ?? ""}
                              defaultChecked={cell.value === defaultDateValue}
                              disabled={!isSelectable}
                              required={cell.value === defaultDateValue}
                            />
                            <span className={spanClasses}>{cell.day}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                      Available Times
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {TIME_SLOTS.map((slot) => (
                        <label className="cursor-pointer" key={slot}>
                          <input
                            className="sr-only peer"
                            type="radio"
                            name="preferredTime"
                            value={slot}
                            defaultChecked={slot === "11:30"}
                            required={slot === "11:30"}
                          />
                          <span className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 text-sm font-medium bg-white dark:bg-surface-dark transition-all flex items-center justify-center hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary peer-checked:bg-primary peer-checked:text-white peer-checked:font-bold peer-checked:shadow-md peer-checked:shadow-indigo-900/20 peer-checked:border-primary">
                            {slot}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary transition-shadow shadow-sm"
                      placeholder="Enter your full name"
                      type="text"
                      name="fullName"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Contact Number
                    </label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary transition-shadow shadow-sm"
                      placeholder="e.g. 082 123 4567"
                      type="tel"
                      name="phone"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Property Location
                    </label>
                    <div className="relative">
                      <select
                        className="w-full rounded-lg border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary appearance-none transition-shadow shadow-sm"
                        name="location"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select Metro Area
                        </option>
                        {METROS.map((metro) => (
                          <option key={metro} value={metro}>
                            {metro}
                          </option>
                        ))}
                      </select>
                      <MaterialSymbol
                        name="expand_more"
                        className="absolute right-3 top-3 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Estimated Damage Level
                    </label>
                    <div className="flex gap-2 bg-slate-50 dark:bg-surface-dark/50 p-1.5 rounded-xl border border-slate-200 dark:border-gray-700">
                      <label className="flex-1 cursor-pointer">
                        <input
                          className="peer sr-only"
                          name="severity"
                          type="radio"
                          value="minor"
                          required
                        />
                        <div className="rounded-lg py-2 text-center text-sm font-bold text-slate-500 peer-checked:bg-white peer-checked:text-green-700 peer-checked:shadow-sm dark:peer-checked:bg-green-900/30 dark:peer-checked:text-green-400 transition-all">
                          Minor
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input
                          className="peer sr-only"
                          name="severity"
                          type="radio"
                          value="moderate"
                          defaultChecked
                        />
                        <div className="rounded-lg py-2 text-center text-sm font-bold text-slate-500 peer-checked:bg-white peer-checked:text-secondary peer-checked:shadow-sm dark:peer-checked:bg-red-900/30 dark:peer-checked:text-red-400 transition-all">
                          Moderate
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input className="peer sr-only" name="severity" type="radio" value="critical" />
                        <div className="rounded-lg py-2 text-center text-sm font-bold text-slate-500 peer-checked:bg-white peer-checked:text-red-700 peer-checked:shadow-sm dark:peer-checked:bg-red-900/30 dark:peer-checked:text-red-400 transition-all">
                          Critical
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {statusMessage ? (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    statusMessage.tone === "success"
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {statusMessage.text}
                </div>
              ) : null}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-gray-700 mt-6">
                <button className="text-sm font-bold text-slate-500 hover:text-primary dark:hover:text-white transition-colors" type="button">
                  Cancel Booking
                </button>
                <button
                  className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white font-bold h-12 px-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  type="submit"
                >
                  Request Assessment
                  <MaterialSymbol name="arrow_forward" className="ml-2 text-[20px]" />
                </button>
              </div>
            </form>
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-gray-700">
              <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">
                Trusted by leading South African insurers
              </p>
              <div className="flex flex-wrap justify-center gap-10 grayscale opacity-50 hover:opacity-80 transition-opacity">
                <div className="text-slate-600 dark:text-slate-400 font-black text-lg flex items-center gap-1">
                  <MaterialSymbol name="security" /> Auto&amp;Gen
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-black text-lg flex items-center gap-1">
                  <MaterialSymbol name="shield" /> MutualSA
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-black text-lg flex items-center gap-1">
                  <MaterialSymbol name="gpp_good" /> Hollardz
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-black text-lg flex items-center gap-1">
                  <MaterialSymbol name="admin_panel_settings" /> OutSure
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
