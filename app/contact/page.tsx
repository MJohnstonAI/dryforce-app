import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/components/LogoImage";
import MaterialSymbol from "@/components/MaterialSymbol";
import CopyEmail from "@/components/CopyEmail";

export const metadata: Metadata = {
  title: "Contact Us - Dry Force",
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const OPERATIONS_EMAIL = "operations@dryforce.co.za";
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(["image/png", "image/jpeg", "image/svg+xml"]);

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((entry): entry is File => typeof entry !== "string");
}

async function sendQuote(formData: FormData) {
  "use server";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY.");
    return;
  }

  const fullName = getFormValue(formData, "fullName");
  const phone = getFormValue(formData, "phone");
  const email = getFormValue(formData, "email");
  const serviceType = getFormValue(formData, "serviceType");
  const address = getFormValue(formData, "address");
  const description = getFormValue(formData, "description");
  const uploadFiles = getFiles(formData, "attachments");

  if (!email) {
    console.error("Missing customer email.");
    return;
  }

  const safeDescription = description
    ? escapeHtml(description).replace(/\n/g, "<br />")
    : "Not provided";

  const details = [
    ["Name", fullName || "Not provided"],
    ["Email", email],
    ["Phone", phone || "Not provided"],
    ["Service Type", serviceType || "Not provided"],
    ["Property Address", address || "Not provided"],
  ];

  const acceptedFiles: File[] = [];
  const rejectedFiles: Array<{ name: string; reason: string }> = [];

  uploadFiles.forEach((file) => {
    if (!file || file.size === 0) return;
    if (file.size > MAX_UPLOAD_SIZE) {
      rejectedFiles.push({ name: file.name || "Attachment", reason: "File exceeds 5MB limit." });
      return;
    }
    if (file.type && !ALLOWED_UPLOAD_TYPES.has(file.type)) {
      rejectedFiles.push({ name: file.name || "Attachment", reason: "Unsupported file type." });
      return;
    }
    acceptedFiles.push(file);
  });

  const attachments = await Promise.all(
    acceptedFiles.map(async (file) => ({
      filename: file.name || "attachment",
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      content_type: file.type || undefined,
    })),
  );

  const attachmentSummaryHtml = acceptedFiles.length
    ? `<ul>${acceptedFiles
        .map(
          (file) =>
            `<li>${escapeHtml(file.name || "Attachment")} (${Math.round(
              file.size / 1024,
            )} KB)</li>`,
        )
        .join("")}</ul>`
    : "<p>None</p>";

  const rejectedSummaryHtml = rejectedFiles.length
    ? `<p><strong>Rejected uploads:</strong></p><ul>${rejectedFiles
        .map(
          (file) =>
            `<li>${escapeHtml(file.name)} — ${escapeHtml(file.reason)}</li>`,
        )
        .join("")}</ul>`
    : "";

  const internalHtml = `
    <h2>New Quote Request</h2>
    <p>A new request was submitted from the Dry Force website.</p>
    <table cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
      ${details
        .map(
          ([label, value]) =>
            `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
      <tr><td><strong>Damage Description</strong></td><td>${safeDescription}</td></tr>
    </table>
    <p><strong>Attachments:</strong></p>
    ${attachmentSummaryHtml}
    ${rejectedSummaryHtml}
  `;

  const internalText = [
    "New Quote Request",
    "",
    ...details.map(([label, value]) => `${label}: ${value}`),
    `Damage Description: ${description || "Not provided"}`,
    `Attachments: ${
      acceptedFiles.length
        ? acceptedFiles
            .map((file) => `${file.name || "Attachment"} (${Math.round(file.size / 1024)} KB)`)
            .join(", ")
        : "None"
    }`,
    ...(rejectedFiles.length
      ? [
          `Rejected uploads: ${rejectedFiles
            .map((file) => `${file.name} (${file.reason})`)
            .join(", ")}`,
        ]
      : []),
  ].join("\n");

  const confirmationName = fullName || "there";
  const confirmationHtml = `
    <p>Hi ${escapeHtml(confirmationName)},</p>
    <p>Thank you for contacting Dry Force. We have received your request and our team will be in touch soon.</p>
    <p><strong>Request summary:</strong></p>
    <ul>
      ${details
        .map(
          ([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`,
        )
        .join("")}
    </ul>
    ${
      acceptedFiles.length
        ? `<p><strong>Attachments received:</strong> ${acceptedFiles
            .map((file) => escapeHtml(file.name || "Attachment"))
            .join(", ")}</p>`
        : ""
    }
    ${
      rejectedFiles.length
        ? "<p>If you tried to attach files over 5MB or unsupported formats, they may not have been received.</p>"
        : ""
    }
    <p>If this is urgent, please call us on 0860 800 800.</p>
  `;

  const confirmationText = [
    `Hi ${confirmationName},`,
    "",
    "Thank you for contacting Dry Force. We have received your request and our team will be in touch soon.",
    "",
    "Request summary:",
    ...details.map(([label, value]) => `${label}: ${value}`),
    ...(acceptedFiles.length
      ? [`Attachments received: ${acceptedFiles.map((file) => file.name).join(", ")}`]
      : []),
    ...(rejectedFiles.length
      ? [
          "If you tried to attach files over 5MB or unsupported formats, they may not have been received.",
        ]
      : []),
    "",
    "If this is urgent, please call us on 0860 800 800.",
  ].join("\n");

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const internalPayload = {
    from: `Dry Force <${OPERATIONS_EMAIL}>`,
    to: [OPERATIONS_EMAIL],
    reply_to: email,
    subject: "New Quote Request - Dry Force",
    html: internalHtml,
    text: internalText,
    ...(attachments.length ? { attachments } : {}),
  };

  const confirmationPayload = {
    from: `Dry Force <${OPERATIONS_EMAIL}>`,
    to: [email],
    reply_to: OPERATIONS_EMAIL,
    subject: "We received your request - Dry Force",
    html: confirmationHtml,
    text: confirmationText,
  };

  const [internalResponse, confirmationResponse] = await Promise.all([
    fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(internalPayload),
    }),
    fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(confirmationPayload),
    }),
  ]);

  if (!internalResponse.ok || !confirmationResponse.ok) {
    const internalError = await internalResponse.text();
    const confirmationError = await confirmationResponse.text();
    console.error("Resend error:", internalError || confirmationError);
  }
}

export default function ContactPage() {
  return (
    <div className="theme-contact bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-[#e0e0e0] min-h-screen flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-b-gray-800 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur px-6 py-4 lg:px-10 shadow-sm">
        <div className="flex items-center gap-4 text-[#0d121b] dark:text-white">
          <Link className="block" href="/">
            <LogoImage
              alt="Dry Force Logo"
              src="/stitch/dry_force_logo.png"
              className="h-24 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link
              className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium leading-normal transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium leading-normal transition-colors"
              href="/services"
            >
              Services
            </Link>
            <Link
              className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium leading-normal transition-colors"
              href="/about"
            >
              About Us
            </Link>
            <span className="text-primary font-bold leading-normal border-b-2 border-primary">
              Contact Us
            </span>
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-accent hover:bg-red-700 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-red-500/20">
            <span className="truncate flex items-center gap-2">
              <MaterialSymbol name="emergency_home" className="text-[20px]" />
              Emergency: 0860 800 800
            </span>
          </button>
        </div>
        <button className="lg:hidden text-primary dark:text-white" aria-label="Open menu">
          <MaterialSymbol name="menu" />
        </button>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-primary dark:text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-3">
            We Restore Your Property. <br className="hidden lg:block" />
            <span className="text-accent">Get Help Now.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl lg:mx-0 mx-auto">
            24/7 Emergency Flood and Fire Recovery Services across South Africa&apos;s major metros.
            Fill out the form below for an immediate response.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#151b28] rounded-xl shadow-md border-t-4 border-t-primary border-x border-b border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a202c]/50">
              <div className="flex px-6 gap-8">
                <button className="group flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary dark:text-white pb-[13px] pt-5 px-2">
                  <span className="flex items-center gap-2 text-sm font-bold leading-normal tracking-[0.015em]">
                    <MaterialSymbol name="request_quote" className="text-[20px] text-accent" />
                    Request a Quote
                  </span>
                </button>
                <button className="group flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 hover:text-primary pb-[13px] pt-5 px-2 transition-colors">
                  <span className="flex items-center gap-2 text-sm font-medium leading-normal tracking-[0.015em]">
                    <MaterialSymbol name="help" className="text-[20px]" />
                    General Inquiry
                  </span>
                </button>
              </div>
            </div>
            <form
              action={sendQuote}
              encType="multipart/form-data"
              method="POST"
              className="p-6 lg:p-8 flex flex-col gap-6"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex flex-col flex-1 gap-2">
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">Full Name</span>
                  <div className="relative">
                    <MaterialSymbol
                      name="person"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
                    />
                    <input
                      className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-primary focus:ring-primary pl-10 h-12 text-sm"
                      name="fullName"
                      placeholder="John Doe"
                      required
                      type="text"
                    />
                  </div>
                </label>
                <label className="flex flex-col flex-1 gap-2">
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">
                    Phone Number
                  </span>
                  <div className="relative">
                    <MaterialSymbol
                      name="call"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
                    />
                    <input
                      className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-primary focus:ring-primary pl-10 h-12 text-sm"
                      name="phone"
                      placeholder="082 123 4567"
                      type="tel"
                    />
                  </div>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex flex-col flex-1 gap-2">
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">
                    Email Address
                  </span>
                  <div className="relative">
                    <MaterialSymbol
                      name="mail"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
                    />
                    <input
                      className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-primary focus:ring-primary pl-10 h-12 text-sm"
                      name="email"
                      placeholder="john@example.co.za"
                      required
                      type="email"
                    />
                  </div>
                </label>
                <label className="flex flex-col flex-1 gap-2">
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">Service Type</span>
                  <div className="relative">
                    <MaterialSymbol
                      name="category"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
                    />
                    <select
                      className="form-select w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-primary focus:ring-primary pl-10 h-12 text-sm"
                      name="serviceType"
                    >
                      <option>Water Damage / Flood</option>
                      <option>Fire &amp; Smoke Damage</option>
                      <option>Mold Remediation</option>
                      <option>Other Services</option>
                    </select>
                  </div>
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">
                  Property Address / Area
                </span>
                <div className="relative">
                  <MaterialSymbol
                    name="location_on"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
                  />
                  <input
                    className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-primary focus:ring-primary pl-10 h-12 text-sm"
                    name="address"
                    placeholder="Street address, Suburb, City"
                    type="text"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">
                  Damage Description
                </span>
                <textarea
                  className="form-textarea w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-primary focus:ring-primary p-3 min-h-[120px] text-sm"
                  name="description"
                  placeholder="Please describe the extent of the damage..."
                ></textarea>
              </label>
              <div className="flex flex-col gap-2">
                <span className="text-gray-700 dark:text-gray-200 text-sm font-bold">
                  Upload Photos (Optional)
                </span>
                <div className="flex items-center justify-center w-full">
                  <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                    htmlFor="dropzone-file"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MaterialSymbol name="cloud_upload" className="text-primary/60 text-3xl mb-2" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-primary">Click to upload</span> or drag
                        and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      className="hidden"
                      id="dropzone-file"
                      name="attachments"
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      multiple
                    />
                  </label>
                </div>
              </div>
              <button
                className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-[#1a1052] text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-md shadow-primary/20"
                type="submit"
              >
                Get Your Free Quote Now
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-[-10px]">
                By submitting this form, you agree to our privacy policy.
              </p>
            </form>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-accent/5 dark:bg-red-900/10 border border-accent/20 dark:border-red-900/30 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 dark:bg-red-900/30 p-3 rounded-full text-accent shrink-0">
                  <MaterialSymbol name="campaign" className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-red-300 font-bold text-lg mb-1">
                    Emergency Hotline
                  </h3>
                  <p className="text-gray-700 dark:text-red-200/70 text-sm mb-3">
                    Available 24 hours a day, 7 days a week for urgent assistance.
                  </p>
                  <a
                    className="inline-flex items-center text-2xl font-black text-accent hover:text-red-700 transition-colors"
                    href="tel:0860800800"
                  >
                    0860 800 800
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#151b28] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="text-primary dark:text-white font-bold text-lg mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
                Contact Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MaterialSymbol name="mail" className="text-primary text-2xl shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Us</p>
                    <CopyEmail
                      email={OPERATIONS_EMAIL}
                      className="text-base font-semibold text-gray-800 dark:text-white hover:text-primary transition-colors"
                      messageClassName="text-xs text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MaterialSymbol name="business" className="text-primary text-2xl shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Head Office</p>
                    <p className="text-base font-semibold text-gray-800 dark:text-white">
                      12 Business Park Road,
                      <br />
                      Midrand, Johannesburg, 1685
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MaterialSymbol name="schedule" className="text-primary text-2xl shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours</p>
                    <p className="text-base font-semibold text-gray-800 dark:text-white">Open 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#151b28] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  alt="Map of South Africa showing service coverage areas including Johannesburg and Cape Town"
                  className="h-full w-full object-cover opacity-80"
                  src="/images/contact-map.png"
                  width={512}
                  height={512}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end p-6">
                  <h3 className="text-white font-bold text-lg">We Serve Major Metros</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MaterialSymbol name="check_circle" className="text-accent text-[20px]" />
                    Johannesburg &amp; Pretoria (Gauteng)
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MaterialSymbol name="check_circle" className="text-accent text-[20px]" />
                    Cape Town &amp; Surrounds
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MaterialSymbol name="check_circle" className="text-accent text-[20px]" />
                    Durban (eThekwini)
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MaterialSymbol name="check_circle" className="text-accent text-[20px]" />
                    Port Elizabeth (Gqeberha)
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4 items-center justify-around text-primary/70 dark:text-white/60 p-4">
              <div className="flex flex-col items-center gap-1">
                <MaterialSymbol name="verified_user" className="text-4xl" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Insured</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MaterialSymbol name="engineering" className="text-4xl" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Certified</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MaterialSymbol name="stars" className="text-4xl" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white border-t border-blue-900 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-blue-100/70">
          <p>Ac 2025 Dry Force. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
