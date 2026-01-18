import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/components/LogoImage";
import MaterialSymbol from "@/components/MaterialSymbol";
import CopyEmail from "@/components/CopyEmail";

export const metadata: Metadata = {
  title: "About Us - Dry Force",
  description:
    "Meet Dry Force, South Africa's trusted fire and flood restoration experts.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us - Dry Force",
    description:
      "Meet Dry Force, South Africa's trusted fire and flood restoration experts.",
    url: "/about",
    images: ["/images/about-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Dry Force",
    description:
      "Meet Dry Force, South Africa's trusted fire and flood restoration experts.",
    images: ["/images/about-hero.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="theme-about bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7ebf3] dark:border-gray-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-6 py-4 lg:px-20">
          <div className="flex items-center gap-4 text-[#0d121b] dark:text-white">
            <div className="h-24 w-auto flex items-center">
              <LogoImage
                alt="Dry Force Logo"
                src="/stitch/dry_force_logo.png"
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>
          <div className="hidden lg:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link
                className="text-[#0d121b] dark:text-white text-sm font-medium leading-normal hover:text-accent transition-colors"
                href="/"
              >
                Home
              </Link>
              <Link
                className="text-[#0d121b] dark:text-white text-sm font-medium leading-normal hover:text-accent transition-colors"
                href="/services"
              >
                Services
              </Link>
              <span className="text-[#0d121b] dark:text-white text-sm font-medium leading-normal">
                About Us
              </span>
              <Link
                className="text-[#0d121b] dark:text-white text-sm font-medium leading-normal hover:text-accent transition-colors"
                href="/contact"
              >
                Contact
              </Link>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-accent text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors shadow-sm">
              <span className="truncate">0860 800 800</span>
            </button>
          </div>
          <button className="lg:hidden" aria-label="Open menu">
            <MaterialSymbol name="menu" className="cursor-pointer" />
          </button>
        </header>

        <div className="w-full">
          <div className="@container">
            <div className="@[480px]:p-6 lg:p-10 lg:px-20">
              <div
                className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 relative overflow-hidden"
                data-alt="Restoration team working in a flooded modern living room"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(31, 16, 104, 0.85), rgba(217, 32, 24, 0.7)), url('/images/about-hero.png')",
                }}
              >
                <div className="flex flex-col gap-4 text-center max-w-[800px] z-10">
                  <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl uppercase italic drop-shadow-md">
                    South Africa&apos;s No.1 Drying Company
                  </h1>
                  <h2 className="text-blue-50 text-lg font-medium leading-relaxed md:text-xl drop-shadow-sm">
                    Your trusted 24/7 Fire &amp; Flood Restoration Experts. We bring professional
                    expertise and deep empathy to every restoration project.
                  </h2>
                </div>
                <div className="flex gap-4 mt-4 z-10">
                  <Link
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-100 transition-colors shadow-lg"
                    href="/services"
                  >
                    <span className="truncate">Our Services</span>
                  </Link>
                  <Link
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-accent/90 backdrop-blur-md border border-white/10 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-accent transition-colors shadow-lg"
                    href="/contact"
                  >
                    <span className="truncate">Contact Us</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center py-5 px-6 lg:px-20">
          <div className="flex flex-col max-w-[960px] flex-1">
            <h1 className="text-[#0d121b] dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight text-center pb-3 pt-6">
              Our Mission &amp; Values
            </h1>
            <p className="text-center text-[#4c669a] dark:text-gray-400 text-lg max-w-2xl mx-auto">
              We don&apos;t just fix buildings; we help families and businesses get back on their feet.
              Our core values drive every decision we make.
            </p>
          </div>
        </div>

        <div className="w-full flex justify-center py-10 px-6 lg:px-20 bg-white dark:bg-gray-900">
          <div className="flex flex-col max-w-[1100px] flex-1 gap-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4 rounded-xl border border-[#cfd7e7] dark:border-gray-700 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg transition-shadow group">
                <div className="text-accent size-12 flex items-center justify-center bg-accent/10 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                  <MaterialSymbol name="timer" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#0d121b] dark:text-white text-xl font-bold leading-tight">
                    Rapid Response
                  </h2>
                  <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-relaxed">
                    Time is critical in water and fire damage. We guarantee an on-site presence
                    within hours to mitigate loss.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-[#cfd7e7] dark:border-gray-700 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg transition-shadow group">
                <div className="text-accent size-12 flex items-center justify-center bg-accent/10 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                  <MaterialSymbol name="verified_user" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#0d121b] dark:text-white text-xl font-bold leading-tight">
                    Integrity First
                  </h2>
                  <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-relaxed">
                    Transparent pricing, honest assessments, and no hidden fees. We build trust
                    through absolute clarity.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-[#cfd7e7] dark:border-gray-700 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg transition-shadow group">
                <div className="text-accent size-12 flex items-center justify-center bg-accent/10 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                  <MaterialSymbol name="diversity_1" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#0d121b] dark:text-white text-xl font-bold leading-tight">
                    Compassionate Care
                  </h2>
                  <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-relaxed">
                    We understand the trauma of disaster. Our teams are trained to treat your property
                    and family with deep respect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-primary py-16 px-6 lg:px-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dark-matter.png')] opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90"></div>
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black text-white">15+</span>
              <span className="text-sm md:text-base font-medium opacity-90 text-blue-100">
                Years Experience
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black text-white">5k+</span>
              <span className="text-sm md:text-base font-medium opacity-90 text-blue-100">
                Homes Restored
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black text-accent">24/7</span>
              <span className="text-sm md:text-base font-medium opacity-90 text-blue-100">
                Emergency Support
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black text-white">4</span>
              <span className="text-sm md:text-base font-medium opacity-90 text-blue-100">
                Major Metros
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center py-16 px-6 lg:px-20">
          <div className="flex flex-col max-w-[960px] flex-1">
            <h1 className="text-[#0d121b] dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight text-center pb-12">
              Our Journey
            </h1>
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 md:ml-auto md:mr-auto md:max-w-2xl space-y-12 pl-8 md:pl-0">
              <div className="relative md:flex md:flex-row-reverse md:justify-between md:items-center group">
                <div className="absolute -left-[37px] md:left-1/2 md:-ml-[9px] top-1 md:top-1/2 md:-mt-[9px] size-[18px] rounded-full bg-primary border-4 border-white dark:border-background-dark shadow-md"></div>
                <div className="md:w-[45%] mb-2 md:mb-0 md:text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="text-accent font-bold text-sm block mb-1">2008</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Founded in Cape Town</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    Started as a small family team responding to local storm damage in the Western
                    Cape.
                  </p>
                </div>
                <div className="hidden md:block md:w-[45%]"></div>
              </div>
              <div className="relative md:flex md:justify-between md:items-center group">
                <div className="absolute -left-[37px] md:left-1/2 md:-ml-[9px] top-1 md:top-1/2 md:-mt-[9px] size-[18px] rounded-full bg-primary border-4 border-white dark:border-background-dark shadow-md"></div>
                <div className="hidden md:block md:w-[45%]"></div>
                <div className="md:w-[45%] mb-2 md:mb-0 md:text-right p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="text-accent font-bold text-sm block mb-1">2012</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Expanded to Johannesburg</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    Established our Gauteng operations, bringing rapid response restoration to the
                    country&apos;s economic hub.
                  </p>
                </div>
              </div>
              <div className="relative md:flex md:flex-row-reverse md:justify-between md:items-center group">
                <div className="absolute -left-[37px] md:left-1/2 md:-ml-[9px] top-1 md:top-1/2 md:-mt-[9px] size-[18px] rounded-full bg-primary border-4 border-white dark:border-background-dark shadow-md"></div>
                <div className="md:w-[45%] mb-2 md:mb-0 md:text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="text-accent font-bold text-sm block mb-1">2017</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Certified IICRC Experts</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    Achieved global certification standards, solidifying Dry Force as a trusted
                    industry leader.
                  </p>
                </div>
                <div className="hidden md:block md:w-[45%]"></div>
              </div>
              <div className="relative md:flex md:justify-between md:items-center group">
                <div className="absolute -left-[37px] md:left-1/2 md:-ml-[9px] top-1 md:top-1/2 md:-mt-[9px] size-[18px] rounded-full bg-primary border-4 border-white dark:border-background-dark shadow-md"></div>
                <div className="hidden md:block md:w-[45%]"></div>
                <div className="md:w-[45%] mb-2 md:mb-0 md:text-right p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="text-accent font-bold text-sm block mb-1">Present</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">National Coverage</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    Now operating in major metropolitan areas including Cape Town, Johannesburg,
                    Durban and Port Elizabeth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-gray-900 py-16 px-6 lg:px-20">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[#0d121b] dark:text-white text-3xl font-bold text-center mb-12">
              Meet Our Leadership
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <Image
                    alt="Portrait of Jill Johnston, National Branch Manager at Dry Force"
                    className="w-full h-full object-cover"
                    src="/images/Jill.jpg"
                    width={512}
                    height={512}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Jill Johnston</h3>
                  <p className="text-accent text-sm font-medium">
                    National Branch Manager at Dry Force
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <Image
                    alt="Portrait of Patrick Robinson, Director"
                    className="w-full h-full object-cover"
                    src="/images/Patrick.png"
                    width={512}
                    height={512}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Patrick Robinson</h3>
                  <p className="text-accent text-sm font-medium">Director</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <Image
                    alt="Portrait of Keagan Johnston, Health and Safety Officer"
                    className="w-full h-full object-cover"
                    src="/images/Keagan.jpg"
                    width={512}
                    height={512}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Keagan Johnston</h3>
                  <p className="text-accent text-sm font-medium">Health and Safety Officer</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <Image
                    alt="Portrait of Sarah Van Der Merwe, Customer Care Lead"
                    className="w-full h-full object-cover"
                    src="/images/about-team-care.png"
                    width={512}
                    height={512}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Sarah Van Der Merwe
                  </h3>
                  <p className="text-accent text-sm font-medium">Customer Care Lead</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-blue-50/50 dark:bg-background-dark py-12 px-6 lg:px-20 border-t border-[#e7ebf3] dark:border-gray-800">
          <div className="max-w-[960px] mx-auto flex flex-col items-center text-center gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Ready to rebuild? We&apos;re here 24/7.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Disasters don&apos;t wait for business hours, and neither do we. Contact our emergency
              hotline for immediate assistance anywhere in South Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-accent text-white text-base font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                <MaterialSymbol name="call" className="text-[20px]" />
                0860 800 800
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Request a Quote
              </button>
            </div>
          </div>
        </div>

        <footer className="w-full bg-primary text-white py-12 px-6 lg:px-20">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
              <div className="h-28 w-auto flex items-center mb-2">
                <LogoImage
                  alt="Dry Force Logo"
                  src="/stitch/dry_force_logo.png"
                  className="h-full w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                South Africa&apos;s No.1 Drying Company. Expert After Disaster Management.
              </p>
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="font-bold text-lg text-white mb-2">Get in touch</h4>
              <div className="flex flex-col gap-3 text-blue-100 text-sm">
                <div className="flex items-start gap-3">
                  <MaterialSymbol name="location_on" className="text-accent mt-0.5" />
                  <span>
                    Cape Town | Johannesburg |
                    <br />
                    Durban | Port Elizabeth
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MaterialSymbol name="mail" className="text-accent" />
                  <CopyEmail
                    className="hover:text-white transition-colors"
                    wrapperClassName="items-start"
                    messageClassName="text-xs text-blue-200"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <MaterialSymbol name="call" className="text-accent" />
                  <a className="hover:text-white transition-colors" href="tel:0860800800">
                    0860 800 800
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MaterialSymbol name="schedule" className="text-accent" />
                  <span>Open 24 Hours</span>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="font-bold text-lg text-white mb-2">Information</h4>
              <div className="flex flex-col gap-2 text-blue-100 text-sm">
                <Link className="hover:text-accent transition-colors flex items-center gap-2" href="/about">
                  <MaterialSymbol name="chevron_right" className="text-xs" /> About Us
                </Link>
                <Link className="hover:text-accent transition-colors flex items-center gap-2" href="/services">
                  <MaterialSymbol name="chevron_right" className="text-xs" /> Services
                </Link>
                <Link className="hover:text-accent transition-colors flex items-center gap-2" href="/contact">
                  <MaterialSymbol name="chevron_right" className="text-xs" /> Contact Us
                </Link>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="font-bold text-lg text-white mb-2">Useful Links</h4>
              <div className="flex flex-col gap-2 text-blue-100 text-sm">
                <a className="hover:text-accent transition-colors flex items-center gap-2" href="#">
                  <MaterialSymbol name="chevron_right" className="text-xs" /> Blog
                </a>
                <a className="hover:text-accent transition-colors flex items-center gap-2" href="#">
                  <MaterialSymbol name="chevron_right" className="text-xs" /> Get Consultation
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-200">
            <p>Ac 2025 Dry Force. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-white transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-white transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
