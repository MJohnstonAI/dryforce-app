import type { Metadata } from "next";
import Link from "next/link";
import LogoImage from "@/components/LogoImage";
import MaterialSymbol from "@/components/MaterialSymbol";
import CopyEmail from "@/components/CopyEmail";

export const metadata: Metadata = {
  title: "Dry Force - Fire & Flood Restoration Experts",
};

export default function HomePage() {
  return (
    <div className="theme-home bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased overflow-x-hidden">
      <div className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800">
        <div className="layout-container flex justify-center">
          <div className="layout-content-container flex flex-col max-w-[1280px] w-full px-4 md:px-10">
            <header className="flex items-center justify-between h-28">
              <div className="flex items-center gap-3">
                <LogoImage
                  alt="Dry Force Logo"
                  src="/stitch/dry_force_logo.png"
                  className="h-28 w-auto object-contain"
                  priority
                />
              </div>
              <div className="hidden md:flex items-center gap-8">
                <nav className="flex gap-6">
                  <Link
                    className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 text-sm font-semibold transition-colors"
                    href="/services"
                  >
                    Services
                  </Link>
                  <Link
                    className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 text-sm font-semibold transition-colors"
                    href="/about"
                  >
                    About Us
                  </Link>
                  <a
                    className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 text-sm font-semibold transition-colors"
                    href="#"
                  >
                    Service Areas
                  </a>
                </nav>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex gap-3">
                  <button className="hidden lg:flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold border border-slate-200 dark:border-slate-700">
                    <span>Client Portal</span>
                  </button>
                  <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-secondary text-white hover:bg-red-700 transition-colors text-sm font-bold gap-2">
                    <MaterialSymbol name="call" className="text-[20px]" />
                    <span>0860 800 800</span>
                  </button>
                </div>
              </div>
              <button
                className="md:hidden p-2 text-slate-900 dark:text-white"
                aria-label="Open menu"
              >
                <MaterialSymbol name="menu" />
              </button>
            </header>
          </div>
        </div>
      </div>

      <main>
        <section className="relative w-full flex justify-center py-12 md:py-20 lg:py-24 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-900 dark:to-background-dark">
          <div className="layout-content-container flex flex-col max-w-[1280px] w-full px-4 md:px-10">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
              <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1.5 rounded-sm bg-red-50 dark:bg-red-900/20 text-secondary text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Your Trusted 24/7 Fire &amp; Flood Restoration Experts!
                  </div>
                  <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                    <span className="text-primary">Flood &amp; Fire</span>
                    <br />
                    Recovery Specialists
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    When disaster strikes, trust South Africa&apos;s leading restoration experts.
                    Immediate deployment in JHB, Cape Town, and Durban.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link
                    className="flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-white text-base font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                    href="/contact"
                  >
                    Request Emergency Service
                  </Link>
                  <button className="flex items-center justify-center h-12 px-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    View Our Services
                  </button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="verified" className="text-green-600 text-xl" />
                    <span>IICRC Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="verified" className="text-green-600 text-xl" />
                    <span>Insurance Approved</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full lg:max-w-[600px]">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/home-hero.png')" }}
                  ></div>
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center gap-4 p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-xl">
                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                      <MaterialSymbol name="security" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-bold text-sm">
                        &quot;Saved our home from total ruin.&quot;
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MaterialSymbol name="star" className="text-yellow-400 text-[14px]" />
                        <MaterialSymbol name="star" className="text-yellow-400 text-[14px]" />
                        <MaterialSymbol name="star" className="text-yellow-400 text-[14px]" />
                        <MaterialSymbol name="star" className="text-yellow-400 text-[14px]" />
                        <MaterialSymbol name="star" className="text-yellow-400 text-[14px]" />
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] ml-1 font-medium">
                          (500+ Reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-white dark:bg-slate-900 py-10 border-y border-slate-100 dark:border-slate-800">
          <div className="layout-container flex justify-center">
            <div className="layout-content-container max-w-[1280px] w-full px-4 md:px-10">
              <p className="text-center text-xs font-bold text-primary dark:text-blue-400 mb-8 uppercase tracking-widest">
                Preferred Partner For South Africa&apos;s Leading Insurers
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 group cursor-default">
                  <MaterialSymbol name="security" className="text-2xl" />
                  <span className="text-lg font-bold">Santam</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <MaterialSymbol name="shield" className="text-2xl" />
                  <span className="text-lg font-bold">OUTsurance</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <MaterialSymbol name="health_and_safety" className="text-2xl" />
                  <span className="text-lg font-bold">Discovery</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <MaterialSymbol name="gavel" className="text-2xl" />
                  <span className="text-lg font-bold">Hollard</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <MaterialSymbol name="verified_user" className="text-2xl" />
                  <span className="text-lg font-bold">Old Mutual</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-background-light dark:bg-background-dark">
          <div className="layout-container flex justify-center">
            <div className="layout-content-container flex flex-col max-w-[1280px] w-full px-4 md:px-10">
              <div className="mb-12">
                <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">
                  Our Expertise
                </span>
                <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                  Core Recovery Services
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                  <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">
                    Comprehensive restoration solutions tailored to the unique challenges of South
                    African properties.
                  </p>
                  <button className="hidden md:flex items-center text-primary font-bold hover:text-blue-700 gap-1 whitespace-nowrap group text-sm">
                    View all services
                    <MaterialSymbol
                      name="arrow_forward"
                      className="text-sm transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-lg transition-all">
                  <div
                    className="w-full h-56 bg-cover bg-center relative"
                    style={{ backgroundImage: "url('/images/home-service-water.png')" }}
                  >
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-lg text-primary shadow-sm">
                      <MaterialSymbol name="water_drop" className="text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col p-6 gap-3 flex-1">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                      Water Damage Restoration
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      Rapid water extraction, structural drying, and dehumidification to prevent
                      secondary damage and mould growth.
                    </p>
                    <a
                      className="mt-auto text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                      href="#"
                    >
                      Learn more <MaterialSymbol name="arrow_forward" className="text-sm" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-lg transition-all">
                  <div
                    className="w-full h-56 bg-cover bg-center relative"
                    style={{ backgroundImage: "url('/images/home-service-fire.png')" }}
                  >
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-lg text-secondary shadow-sm">
                      <MaterialSymbol name="local_fire_department" className="text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col p-6 gap-3 flex-1">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                      Fire &amp; Smoke Recovery
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      Comprehensive soot removal, odor control, and structural repairs to bring your
                      property back to pre-loss condition.
                    </p>
                    <a
                      className="mt-auto text-secondary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                      href="#"
                    >
                      Learn more <MaterialSymbol name="arrow_forward" className="text-sm" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-lg transition-all">
                  <div
                    className="w-full h-56 bg-cover bg-center relative"
                    style={{ backgroundImage: "url('/images/home-service-mould.png')" }}
                  >
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-lg text-green-600 shadow-sm">
                      <MaterialSymbol name="sanitizer" className="text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col p-6 gap-3 flex-1">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                      Decontamination &amp; Mould
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      Specialized deep cleaning and mold remediation services ensuring a safe and
                      healthy environment for your family.
                    </p>
                    <a
                      className="mt-auto text-green-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                      href="#"
                    >
                      Learn more <MaterialSymbol name="arrow_forward" className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>
              <button className="flex md:hidden mt-8 w-full justify-center items-center h-12 rounded-lg border border-primary text-primary font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                View all services
              </button>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-white dark:bg-slate-900">
          <div className="layout-container flex justify-center">
            <div className="layout-content-container flex flex-col max-w-[1280px] w-full px-4 md:px-10">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-secondary font-bold tracking-wider uppercase text-xs mb-2 block">
                  Our Process
                </span>
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold mb-4">
                  The Road to Recovery
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  We streamline the restoration process to get you back to normal as quickly as
                  possible.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="hidden md:block absolute top-[50px] left-[16%] right-[16%] h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="size-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-6 border-2 border-primary shadow-sm">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Assessment</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                    We arrive on site within 60 minutes to inspect the damage and create a detailed
                    recovery plan.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="size-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-6 border-2 border-primary shadow-sm">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Restoration</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                    Our team removes damaged materials, dries the structure, and begins detailed
                    repairs.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="size-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-6 border-2 border-primary shadow-sm">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Recovery</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                    We complete finishing touches and ensure your property is safe, clean, and ready
                    for occupancy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-background-light dark:bg-background-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-slate-900 dark:to-background-dark"></div>
          <div className="layout-container flex justify-center relative z-10">
            <div className="layout-content-container flex flex-col md:flex-row max-w-[1280px] w-full px-4 md:px-10 gap-12">
              <div className="flex-1">
                <span className="text-secondary font-bold tracking-wider uppercase text-xs mb-2 block">
                  Emergency Response
                </span>
                <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
                  We Respond in Under 60 Minutes
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                  Our rapid response teams are on standby 24/7 across South Africa. When you call,
                  we dispatch immediately to minimize damage and restore your property.
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="bolt" className="text-primary text-xl" />
                    <span>Rapid Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="location_on" className="text-primary text-xl" />
                    <span>Nationwide Coverage</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center md:justify-end">
                <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl max-w-sm w-full relative">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold">Emergency?</h3>
                    <p className="text-slate-600 text-sm mb-6">
                      Our operators are standing by 24/7 to dispatch a team to your location.
                    </p>
                  </div>
                  <a
                    className="flex items-center justify-center w-full h-14 rounded-lg bg-secondary text-white font-bold text-lg hover:bg-red-700 transition-colors gap-3 mb-3 shadow-lg shadow-red-500/20"
                    href="tel:0860800800"
                  >
                    <MaterialSymbol name="phone_in_talk" />
                    0860 800 800
                  </a>
                  <p className="text-center text-xs text-slate-400">
                    Toll-free from all SA landlines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white border-t border-white/10 pt-16 pb-8">
        <div className="layout-container flex justify-center">
          <div className="layout-content-container max-w-[1280px] w-full px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <LogoImage
                    alt="Dry Force Logo"
                    src="/stitch/dry_force_logo.png"
                    className="h-20 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  South Africa&apos;s trusted partner for disaster recovery. We restore more than
                  just property; we restore lives.
                </p>
                <div className="flex gap-4">
                  <a
                    className="text-blue-100 hover:text-accent transition-colors"
                    href="#"
                    aria-label="Facebook"
                  >
                    <MaterialSymbol name="thumb_up" className="text-xl" />
                  </a>
                  <a
                    className="text-blue-100 hover:text-accent transition-colors"
                    href="#"
                    aria-label="Instagram"
                  >
                    <MaterialSymbol name="photo_camera" className="text-xl" />
                  </a>
                  <a
                    className="text-blue-100 hover:text-accent transition-colors"
                    href="#"
                    aria-label="YouTube"
                  >
                    <MaterialSymbol name="smart_display" className="text-xl" />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Services</h4>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li>
                    <a className="hover:text-accent transition-colors" href="#">
                      Water Damage
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-accent transition-colors" href="#">
                      Fire &amp; Smoke
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-accent transition-colors" href="#">
                      Mould Remediation
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-accent transition-colors" href="#">
                      Storm Damage
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li>
                    <Link className="hover:text-accent transition-colors" href="/about">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a className="hover:text-accent transition-colors" href="#">
                      Our Team
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-accent transition-colors" href="#">
                      Careers
                    </a>
                  </li>
                  <li>
                    <Link className="hover:text-accent transition-colors" href="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Contact HQ</h4>
                <ul className="space-y-4 text-sm text-blue-100">
                  <li className="flex items-start gap-3">
                    <MaterialSymbol name="location_on" className="text-base mt-0.5 text-accent" />
                    <span>
                      123 Rivonia Road,
                      <br />
                      Sandton, Johannesburg
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                  <MaterialSymbol name="mail" className="text-base text-accent" />
                  <CopyEmail
                    className="hover:text-white transition-colors"
                    wrapperClassName="items-start"
                    messageClassName="text-xs text-blue-200"
                  />
                </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-blue-200 text-xs">Ac 2025 Dry Force SA. All rights reserved.</p>
              <div className="flex gap-6 text-blue-200 text-xs">
                <a className="hover:text-white transition-colors" href="#">
                  Privacy Policy
                </a>
                <a className="hover:text-white transition-colors" href="#">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
