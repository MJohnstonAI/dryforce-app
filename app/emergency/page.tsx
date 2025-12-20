import type { Metadata } from "next";
import Link from "next/link";
import MaterialSymbol from "@/components/MaterialSymbol";
import CopyEmail from "@/components/CopyEmail";

export const metadata: Metadata = {
  title: "Dry Force - Emergency & Booking",
};

export default function EmergencyBookingPage() {
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
            <button className="hidden md:flex items-center justify-center rounded-lg h-10 px-6 bg-secondary hover:bg-secondary-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              <MaterialSymbol name="call" className="mr-2 text-[20px]" />
              <span>0860 800 800</span>
            </button>
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
                <p className="text-sm font-bold text-slate-400">Step 1 of 3</p>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-1/3 rounded-full shadow-[0_0_10px_rgba(218,41,28,0.5)]"></div>
              </div>
            </div>
            <form className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Type of Incident
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="relative flex cursor-pointer rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark p-5 shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all group">
                    <input className="sr-only peer" name="service-type" type="radio" defaultChecked />
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
                    <input className="sr-only peer" name="service-type" type="radio" />
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
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors" type="button">
                        <MaterialSymbol name="chevron_left" />
                      </button>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        October 2023
                      </span>
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors" type="button">
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
                      <button className="aspect-square flex items-center justify-center rounded-lg text-slate-300 pointer-events-none" type="button">
                        29
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg text-slate-300 pointer-events-none" type="button">
                        30
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        1
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        2
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md shadow-indigo-900/20" type="button">
                        3
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        4
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        5
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        6
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        7
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        8
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        9
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        10
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        11
                      </button>
                      <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-colors" type="button">
                        12
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                      Available Times
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 text-sm font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-white dark:bg-surface-dark transition-all" type="button">
                        09:00
                      </button>
                      <button className="px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-indigo-900/20 border border-primary" type="button">
                        11:30
                      </button>
                      <button className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 text-sm font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-white dark:bg-surface-dark transition-all" type="button">
                        14:00
                      </button>
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Property Location
                    </label>
                    <div className="relative">
                      <select className="w-full rounded-lg border-slate-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary appearance-none transition-shadow shadow-sm">
                        <option>Select Metro Area</option>
                        <option>Johannesburg</option>
                        <option>Cape Town</option>
                        <option>Durban</option>
                        <option>Pretoria</option>
                        <option>Port Elizabeth</option>
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
                        <input className="peer sr-only" name="severity" type="radio" />
                        <div className="rounded-lg py-2 text-center text-sm font-bold text-slate-500 peer-checked:bg-white peer-checked:text-green-700 peer-checked:shadow-sm dark:peer-checked:bg-green-900/30 dark:peer-checked:text-green-400 transition-all">
                          Minor
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input className="peer sr-only" name="severity" type="radio" defaultChecked />
                        <div className="rounded-lg py-2 text-center text-sm font-bold text-slate-500 peer-checked:bg-white peer-checked:text-secondary peer-checked:shadow-sm dark:peer-checked:bg-red-900/30 dark:peer-checked:text-red-400 transition-all">
                          Moderate
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input className="peer sr-only" name="severity" type="radio" />
                        <div className="rounded-lg py-2 text-center text-sm font-bold text-slate-500 peer-checked:bg-white peer-checked:text-red-700 peer-checked:shadow-sm dark:peer-checked:bg-red-900/30 dark:peer-checked:text-red-400 transition-all">
                          Critical
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-gray-700 mt-6">
                <button className="text-sm font-bold text-slate-500 hover:text-primary dark:hover:text-white transition-colors" type="button">
                  Cancel Booking
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white font-bold h-12 px-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5" type="button">
                  Review Booking Details
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
