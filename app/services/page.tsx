import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LogoImage from "@/components/LogoImage";
import MaterialSymbol from "@/components/MaterialSymbol";
import CopyEmail from "@/components/CopyEmail";
import MobileMenu from "@/components/MobileMenu";
import { rateLimit } from "@/lib/rate-limit";

export const metadata: Metadata = {
  title: "Services - Dry Force",
  description:
    "Flood recovery, fire restoration, and specialty cleaning services across South Africa.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services - Dry Force",
    description:
      "Flood recovery, fire restoration, and specialty cleaning services across South Africa.",
    url: "/services",
    images: ["/images/services-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Dry Force",
    description:
      "Flood recovery, fire restoration, and specialty cleaning services across South Africa.",
    images: ["/images/services-hero.png"],
  },
};

const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// const OPERATIONS_EMAIL = "operations@dryforce.co.za";
const OPERATIONS_EMAIL = "syncteamai@gmail.com";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Dry Force <onboarding@resend.dev>";
const RESEND_TO_EMAIL = process.env.RESEND_TO_EMAIL ?? OPERATIONS_EMAIL;
const CALLBACK_RATE_LIMIT_WINDOW_MS = 60_000;
const CALLBACK_RATE_LIMIT_MAX = 3;
const CALLBACK_TIMEOUT_MS = 4000;
const CALLBACK_RETRY_DELAY_MS = 250;
const CALLBACK_MAX_RETRIES = 1;
const CALLBACK_MAX_INFLIGHT = 10;

let callbackInflight = 0;

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

  while (attempt <= CALLBACK_MAX_RETRIES) {
    try {
      return await fetchWithTimeout(url, options, CALLBACK_TIMEOUT_MS);
    } catch (error) {
      lastError = error;
      if (attempt === CALLBACK_MAX_RETRIES) break;
      await new Promise((resolve) => setTimeout(resolve, CALLBACK_RETRY_DELAY_MS * (attempt + 1)));
      attempt += 1;
    }
  }

  throw lastError;
}

async function requestCallback(formData: FormData) {
  "use server";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY.");
    return redirect("/services?status=error&reason=config#callback");
  }

  const email = getFormValue(formData, "callbackEmail");
  if (!email || !isValidEmail(email)) {
    return redirect("/services?status=error&reason=validation#callback");
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";

  const rate = rateLimit({
    key: `${clientIp}|${email}`,
    limit: CALLBACK_RATE_LIMIT_MAX,
    windowMs: CALLBACK_RATE_LIMIT_WINDOW_MS,
  });

  if (!rate.ok) {
    return redirect("/services?status=error&reason=rate#callback");
  }

  if (callbackInflight >= CALLBACK_MAX_INFLIGHT) {
    return redirect("/services?status=error&reason=busy#callback");
  }

  callbackInflight += 1;
  try {
    const payload = {
      from: RESEND_FROM_EMAIL,
      to: [RESEND_TO_EMAIL],
      reply_to: email,
      subject: "Callback request - Services page",
      html: `<p>Callback request from services page.</p><p><strong>Email:</strong> ${email}</p>`,
      text: `Callback request from services page.\nEmail: ${email}`,
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
      return redirect("/services?status=error&reason=send#callback");
    }
  } catch (error) {
    console.error("Resend error:", error);
    return redirect("/services?status=error&reason=send#callback");
  } finally {
    callbackInflight -= 1;
  }

  return redirect("/services?status=success#callback");
}

type ServicesPageProps = {
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

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const status = resolvedSearchParams?.status;
  const reason = resolvedSearchParams?.reason;

  const statusMessage = (() => {
    if (status === "success") {
      return { tone: "success", text: "Thanks, we will call you back soon." };
    }

    if (status === "error") {
      switch (reason) {
        case "validation":
          return { tone: "error", text: "Enter a valid email address." };
        case "rate":
          return { tone: "error", text: "Too many requests. Try again shortly." };
        case "busy":
          return { tone: "error", text: "We are busy right now. Please retry." };
        case "config":
          return { tone: "error", text: "Form is unavailable. Please call 0860 800 800." };
        default:
          return { tone: "error", text: "We could not send your request." };
      }
    }

    return null;
  })();

  return (
    <div className="theme-services bg-background-light dark:bg-background-dark text-text-main dark:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:bg-background-dark/95 dark:border-gray-800">
        <div className="px-4 md:px-10 py-4 flex items-center justify-between mx-auto max-w-[1280px]">
          <div className="flex items-center gap-2 text-text-main dark:text-white">
            <LogoImage
              alt="Dry Force Logo"
              src="/stitch/dry_force_logo.png"
              className="h-28 w-auto object-contain"
              priority
            />
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-6">
              <Link className="text-sm font-medium hover:text-secondary transition-colors" href="/">
                Home
              </Link>
              <span className="text-sm font-bold text-secondary">Services</span>
              <Link
                className="text-sm font-medium hover:text-secondary transition-colors"
                href="/about"
              >
                About Us
              </Link>
              <Link
                className="text-sm font-medium hover:text-secondary transition-colors"
                href="/contact"
              >
                Contact
              </Link>
            </nav>
            <div className="flex flex-col items-end">
              <a
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-secondary text-white text-sm font-bold hover:bg-secondary-dark transition-colors shadow-sm shadow-red-200 dark:shadow-none mb-1"
                href="tel:0860800800"
              >
                <span className="truncate">Emergency: 0860 800 800</span>
              </a>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                Open 24 Hours
              </span>
            </div>
          </div>
          <MobileMenu
            buttonClassName="text-text-main dark:text-white"
            emergencyHref="tel:0860800800"
            emergencyLabel="Call 0860 800 800"
            links={MOBILE_LINKS}
          />
        </div>
      </header>

      <section className="relative bg-background-light dark:bg-background-dark py-12 px-4 md:px-10 flex justify-center">
        <div className="max-w-[1280px] w-full">
          <div
            className="relative overflow-hidden rounded-xl min-h-[450px] flex flex-col items-center justify-center p-8 md:p-16 text-center gap-6 bg-cover bg-center shadow-xl"
            data-alt="Restored modern living room interior clean and bright"
            style={{
              backgroundImage:
                "linear-gradient(rgba(32, 27, 121, 0.7), rgba(17, 24, 39, 0.8)), url('/images/services-hero.png')",
            }}
          >
            <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight max-w-4xl drop-shadow-md">
              South Africa&apos;s No.1 Drying Company
            </h1>
            <h2 className="text-gray-100 text-base md:text-lg font-medium max-w-2xl drop-shadow-sm">
              From devastating floods to destructive fires, our certified experts in
              Johannesburg, Cape Town, Durban, and Port Elizabeth are ready to restore
              your property.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="h-12 px-8 rounded-lg bg-secondary text-white text-base font-bold hover:bg-secondary-dark transition-colors shadow-lg shadow-red-900/20">
                Get Emergency Help
              </button>
              <button className="h-12 px-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white text-base font-bold hover:bg-white/20 transition-colors">
                View All Services
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[144px] z-40 bg-white/95 backdrop-blur dark:bg-background-dark/95 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-[960px] mx-auto px-4 md:px-10">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <a
              className="flex items-center gap-2 border-b-[3px] border-secondary text-secondary pb-3 pt-4 px-2 whitespace-nowrap group cursor-pointer"
              href="#flood"
            >
              <MaterialSymbol
                name="water_drop"
                className="group-hover:scale-110 transition-transform fill"
              />
              <span className="text-sm font-bold">Flood Recovery</span>
            </a>
            <a
              className="flex items-center gap-2 border-b-[3px] border-transparent text-text-muted dark:text-gray-400 hover:text-primary dark:hover:text-primary pb-3 pt-4 px-2 whitespace-nowrap group cursor-pointer hover:border-primary/30 transition-colors"
              href="#fire"
            >
              <MaterialSymbol
                name="local_fire_department"
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold">Fire Recovery</span>
            </a>
            <a
              className="flex items-center gap-2 border-b-[3px] border-transparent text-text-muted dark:text-gray-400 hover:text-secondary dark:hover:text-secondary pb-3 pt-4 px-2 whitespace-nowrap group cursor-pointer hover:border-secondary/30 transition-colors"
              href="#specialty"
            >
              <MaterialSymbol
                name="cleaning_services"
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold">Specialty Cleaning</span>
            </a>
          </div>
        </div>
      </div>

      <main className="flex flex-col items-center w-full pb-20">
        <section className="w-full max-w-[1280px] px-4 md:px-10 py-16 scroll-mt-40" id="flood">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 flex flex-col gap-6 sticky top-36">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                <MaterialSymbol name="flood" className="text-4xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white">
                Flood &amp; Water Damage
              </h2>
              <p className="text-text-muted dark:text-gray-400 text-lg leading-relaxed">
                Fast action is critical. Water damage spreads quickly, soaking into floors,
                walls, and furniture. We use industrial-grade equipment to extract water, dry
                structures, and prevent mold growth.
              </p>
              <ul className="space-y-3 mt-2">
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  24/7 Rapid Response Teams
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Advanced Thermal Imaging
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Insurance Claim Assistance
                </li>
              </ul>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MaterialSymbol name="water_pump" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                    Water Extraction
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Powerful truck-mounted units remove standing water from your property in
                    minutes, minimizing structural saturation.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MaterialSymbol name="air" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                    Structural Drying
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Using high-velocity air movers and dehumidifiers to remove moisture trapped
                    inside walls, carpets, and subfloors.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MaterialSymbol name="pest_control" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                    Mold Remediation
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Identification, containment, and removal of mold colonies to ensure safe air
                    quality for your family.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MaterialSymbol name="sanitizer" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                    Sanitization &amp; Deodorization
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Treating affected areas with antimicrobial agents to eliminate bacteria and
                    odors caused by grey or black water.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full max-w-[1280px] px-4 md:px-10">
          <hr className="border-gray-200 dark:border-gray-800" />
        </div>
        <section className="w-full max-w-[1280px] px-4 md:px-10 py-16 scroll-mt-40" id="fire">
          <div className="flex flex-col md:flex-row-reverse gap-12 items-start">
            <div className="md:w-1/3 flex flex-col gap-6 sticky top-36">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary dark:bg-secondary/20">
                <MaterialSymbol name="local_fire_department" className="text-4xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white">
                Fire &amp; Smoke Recovery
              </h2>
              <p className="text-text-muted dark:text-gray-400 text-lg leading-relaxed">
                Fire damage goes beyond what you can see. Smoke and soot can corrode surfaces within
                hours. Our team restores structures and possessions, removing odors and residues
                efficiently.
              </p>
              <ul className="space-y-3 mt-2">
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Secure Board-Up Services
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Content Inventory &amp; Pack-Out
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Non-Destructive Cleaning
                </li>
              </ul>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="detector_smoke" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Smoke &amp; Soot Removal
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Deep cleaning of walls, ceilings, and surfaces to remove acidic soot residue that
                    causes permanent discoloration.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="foundation" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Structural Cleaning
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Comprehensive scrubbing and treatment of the building framework to ensure
                    stability and remove odor sources.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="chair" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Content Restoration
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Specialized cleaning for furniture, electronics, and documents, often restoring
                    items you thought were lost forever.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="construction" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Reconstruction Services
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Full project management for rebuilding severely damaged sections of your home or
                    business premises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="w-full max-w-[1280px] px-4 md:px-10 py-16 scroll-mt-40"
          id="specialty"
        >
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 flex flex-col gap-6 sticky top-36">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary dark:bg-secondary/20">
                <MaterialSymbol name="cleaning_services" className="text-4xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white">
                Specialty Cleaning
              </h2>
              <p className="text-text-muted dark:text-gray-400 text-lg leading-relaxed">
                Beyond floods and fires, we provide specialized restoration for unique challenges
                like biohazards, smoke odors, and deep contamination.
              </p>
              <ul className="space-y-3 mt-2">
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Advanced Odor Removal
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Biohazard &amp; Trauma Cleanup
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-text-main dark:text-gray-200">
                  <MaterialSymbol name="check_circle" className="text-secondary text-xl" />
                  Commercial &amp; Industrial Sites
                </li>
              </ul>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="self_improvement" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Trauma Cleanup
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Certified technicians safely handle biohazard materials, ensuring compliance
                    with health regulations.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="science" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Odor Neutralization
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Thermal fogging and ozone treatments to eliminate lingering smoke or mold odors.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="apartment" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Commercial Restoration
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    Fast turnaround for offices, hotels, and industrial facilities to minimize
                    business interruption.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MaterialSymbol name="inventory" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    Content Pack-Out
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                    We inventory, pack, and restore your belongings while keeping them safe in secure
                    storage facilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-primary py-20 text-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-bold">Our Recovery Process</h2>
                <p className="text-blue-100 max-w-xl text-lg">
                  We follow a strict, industry-standard protocol to ensure your property is
                  restored safely and efficiently.
                </p>
              </div>
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Download Protocol Guide
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="relative flex flex-col gap-4 group">
                <div className="text-7xl font-black text-white/10 absolute -top-6 -left-4 select-none group-hover:text-white/20 transition-colors">
                  1
                </div>
                <h3 className="text-xl font-bold relative z-10">Emergency Call</h3>
                <p className="text-blue-100 text-sm relative z-10 leading-relaxed">
                  Contact our 24/7 center. We dispatch a priority team to your location immediately.
                </p>
              </div>
              <div className="relative flex flex-col gap-4 group">
                <div className="text-7xl font-black text-white/10 absolute -top-6 -left-4 select-none group-hover:text-white/20 transition-colors">
                  2
                </div>
                <h3 className="text-xl font-bold relative z-10">Assessment</h3>
                <p className="text-blue-100 text-sm relative z-10 leading-relaxed">
                  Our experts inspect the damage, identify hazards, and create a comprehensive plan.
                </p>
              </div>
              <div className="relative flex flex-col gap-4 group">
                <div className="text-7xl font-black text-white/10 absolute -top-6 -left-4 select-none group-hover:text-white/20 transition-colors">
                  3
                </div>
                <h3 className="text-xl font-bold relative z-10">Mitigation</h3>
                <p className="text-blue-100 text-sm relative z-10 leading-relaxed">
                  We start immediate work to stop further damage (water removal, board-up).
                </p>
              </div>
              <div className="relative flex flex-col gap-4 group">
                <div className="text-7xl font-black text-white/10 absolute -top-6 -left-4 select-none group-hover:text-white/20 transition-colors">
                  4
                </div>
                <h3 className="text-xl font-bold relative z-10">Restoration</h3>
                <p className="text-blue-100 text-sm relative z-10 leading-relaxed">
                  Final repairs, painting, and cleaning to bring your property back to pre-loss
                  condition.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full max-w-[1280px] px-4 md:px-10 py-16">
          <div className="flex flex-col md:flex-row gap-0 rounded-2xl bg-white dark:bg-[#1a2230] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
            <div className="md:w-1/2 min-h-[350px] bg-gray-200 relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                data-alt="Map of South Africa highlighting service areas"
                data-location="Johannesburg Map"
                style={{ backgroundImage: "url('/images/services-map.png')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-[#1a2230]">
              <div className="flex items-center gap-1 mb-6">
                <MaterialSymbol name="star" className="text-secondary fill text-xl" />
                <MaterialSymbol name="star" className="text-secondary fill text-xl" />
                <MaterialSymbol name="star" className="text-secondary fill text-xl" />
                <MaterialSymbol name="star" className="text-secondary fill text-xl" />
                <MaterialSymbol name="star" className="text-secondary fill text-xl" />
              </div>
              <blockquote className="text-xl md:text-2xl font-bold text-text-main dark:text-white mb-8 leading-tight">
                &quot;After the floods in Durban, I thought we lost everything. Dry Force arrived within
                hours and saved our home. Truly professional service.&quot;
              </blockquote>
              <div className="flex flex-col border-l-4 border-primary pl-4">
                <span className="font-bold text-text-main dark:text-white">Sarah Van Der Merwe</span>
                <span className="text-sm text-text-muted dark:text-gray-400">
                  Homeowner, Durban North
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-[720px] px-4 mx-auto text-center py-10 pb-20" id="callback">
          <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
            Not an emergency? Get a Quote
          </h2>
          <p className="text-text-muted dark:text-gray-400 mb-8 text-lg">
            Fill out our online form for non-urgent restoration inquiries and we will get back to you
            within 24 hours.
          </p>
          {statusMessage ? (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
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
          <form className="flex flex-col sm:flex-row gap-4" action={requestCallback}>
            <label className="sr-only" htmlFor="services-email">
              Email address
            </label>
            <input
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101622] px-5 py-4 text-base outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main dark:text-white shadow-sm"
              id="services-email"
              name="callbackEmail"
              placeholder="Enter your email address"
              type="email"
              required
            />
            <button
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold text-base whitespace-nowrap transition-colors shadow-md"
              type="submit"
            >
              Request Call Back
            </button>
          </form>
        </section>
      </main>

      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-text-main dark:text-white">
            <LogoImage
              alt="Dry Force"
              src="/stitch/dry_force_logo.png"
              className="h-20 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-text-muted dark:text-gray-400">
            <span>© 2025 Dry Force. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span className="font-bold text-secondary">0860 800 800</span>
            <span className="hidden md:inline">|</span>
            <CopyEmail
              className="hover:text-primary transition-colors"
              messageClassName="text-xs text-text-muted/80 dark:text-gray-500"
            />
          </div>
          <div className="flex gap-6">
            <a
              className="text-text-muted dark:text-gray-400 hover:text-primary transition-colors"
              href="#"
              aria-label="Social leaderboard"
            >
              <MaterialSymbol name="social_leaderboard" />
            </a>
            <a
              className="text-text-muted dark:text-gray-400 hover:text-primary transition-colors"
              href="#"
              aria-label="Email"
            >
              <MaterialSymbol name="mail" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
