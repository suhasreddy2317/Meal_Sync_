import Link from "next/link";
import {
  CheckCircle2,
  Brain,
  Calendar,
  Star,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { QubiteLogo } from "@/components/shared/qubite-logo";

function IsometricHeroArtwork() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-[10%] bottom-[4%] h-[18%] rounded-[50%] bg-[#A91D32]/10 blur-2xl"
      />
      <svg
        viewBox="0 0 560 420"
        role="img"
        aria-label="Decorative isometric illustration of a smart mess ecosystem"
        className="landing-isometric relative h-auto w-full"
      >
        <defs>
          <linearGradient id="platformTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF1EA" />
          </linearGradient>
          <linearGradient id="orangeSurface" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF9A66" />
            <stop offset="100%" stopColor="#EF6A32" />
          </linearGradient>
        </defs>

        <ellipse cx="280" cy="348" rx="205" ry="28" fill="#A91D32" opacity="0.08" />

        <g className="landing-art-float-slow">
          <path d="M108 235 275 142l177 98-168 96z" fill="#EADCD6" />
          <path d="M108 235l176 101v25L108 260z" fill="#FFBFA5" />
          <path d="M284 336l168-96v25l-168 96z" fill="#EF6A32" />
          <path d="M108 235 275 142l177 98-168 96z" fill="url(#platformTop)" stroke="#FFFFFF" strokeWidth="5" />

          <path d="M154 230l121-69 138 76-122 70z" fill="#FBE7DD" />
          <path d="M154 230l137 77v13l-137-77z" fill="#F7D2C2" />
          <path d="M291 307l122-70v13l-122 70z" fill="#F2A98A" />

          <g transform="translate(203 190)">
            <ellipse cx="69" cy="61" rx="56" ry="31" fill="#EADCD6" />
            <ellipse cx="69" cy="53" rx="56" ry="31" fill="#FFFFFF" stroke="#FFBFA5" strokeWidth="5" />
            <ellipse cx="69" cy="53" rx="35" ry="19" fill="#FFF5EF" />
            <path d="M51 51c12-18 27-16 38-2-11 20-29 20-38 2z" fill="#EF6A32" />
            <circle cx="69" cy="52" r="7" fill="#A91D32" />
            <circle cx="46" cy="46" r="4" fill="#FFBFA5" />
            <circle cx="92" cy="59" r="4" fill="#FFBFA5" />
          </g>

          <g transform="translate(124 228)">
            <path d="m0 0 42-24 45 25-43 25z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3" />
            <path d="m44 26 43-25v42l-43 25z" fill="#F7CDBA" />
            <path d="M0 0l44 26v42L0 42z" fill="#FFF5EF" />
            <ellipse cx="44" cy="1" rx="26" ry="15" fill="#FFBFA5" />
            <ellipse cx="44" cy="-1" rx="15" ry="8" fill="#A91D32" />
          </g>

          <g transform="translate(337 237)">
            <path d="m0 0 40-23 43 24-41 24z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3" />
            <path d="m42 25 41-24v40l-41 24z" fill="#F5B096" />
            <path d="M0 0l42 25v40L0 40z" fill="#FFF5EF" />
            <rect x="20" y="-8" width="44" height="10" rx="5" fill="#EF6A32" transform="skewY(-30)" />
          </g>
        </g>

        <g className="landing-art-float-delay">
          <g transform="translate(54 92)">
            <path d="M0 20 72-21l80 45-72 42z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3" />
            <path d="m80 66 72-42v76l-72 42z" fill="#F1C2AF" />
            <path d="M0 20l80 46v76L0 96z" fill="#FFF5EF" />
            <rect x="18" y="38" width="44" height="8" rx="4" fill="#A91D32" transform="skewY(30)" />
            <rect x="18" y="56" width="31" height="8" rx="4" fill="#FFBFA5" transform="skewY(30)" />
            <circle cx="48" cy="10" r="8" fill="#EF6A32" />
          </g>

          <g transform="translate(400 74)">
            <path d="M0 20 76-22l70 40-76 44z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3" />
            <path d="m70 62 76-44v70l-76 44z" fill="#F7C5AF" />
            <path d="M0 20l70 42v70L0 90z" fill="#FFF5EF" />
            <path d="M22 43l23-13 24 14-24 14z" fill="#EF6A32" />
            <path d="M22 43v25l23 13V70z" fill="#A91D32" />
            <path d="m45 70 24-14v24l-24 15z" fill="#FFBFA5" />
          </g>
        </g>

        <g className="landing-art-float-slow" transform="translate(430 270)">
          <ellipse cx="52" cy="52" rx="47" ry="27" fill="#A91D32" opacity="0.12" />
          <path d="m0 34 52-30 58 32-53 31z" fill="url(#orangeSurface)" />
          <path d="m57 67 53-31v43l-53 31z" fill="#C94A2D" />
          <path d="M0 34l57 33v43L0 77z" fill="#FFBFA5" />
          <circle cx="57" cy="30" r="10" fill="#FFFFFF" />
          <path d="m57 22 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#EF6A32" />
        </g>

        <g fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3">
          <path d="m65 330 34-20 36 20-34 20z" />
          <path d="m99 350 36-20v26l-36 20z" fill="#F7CDBA" />
          <path d="M65 330l34 20v26l-34-20z" fill="#FFF5EF" />
        </g>

        <g fill="none" stroke="#EF6A32" strokeLinecap="round" strokeWidth="5" opacity="0.72">
          <path d="M257 137c-8-16 8-22 0-38" />
          <path d="M279 128c-8-16 8-22 0-38" />
          <path d="M300 137c-8-16 8-22 0-38" />
        </g>
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: "Weekly Menus & Cutoffs",
      desc: "Rotating daily meal menus with nutritional information, calorie counts, and strict automated cutoff timers.",
      color: "bg-[#FFBFA5]/45 text-[#A91D32]",
    },
    {
      icon: CheckCircle2,
      title: "Real-Time Meal Booking",
      desc: "One-click 'Will You Eat?' Yes/No opt-ins enabling the kitchen to cook exact headcounts with zero food waste.",
      color: "bg-[#24866B]/10 text-[#24866B]",
    },
    {
      icon: CreditCard,
      title: "Dining Wallet & Payments",
      desc: "Prepaid hostel digital wallet with zero-fee UPI recharges, instant meal deductions, and downloadable receipts.",
      color: "bg-[#FFBFA5]/35 text-[#EF6A32]",
    },
    {
      icon: Brain,
      title: "Explainable AI Demand",
      desc: "Predictive turn-out algorithm blending 4-week moving averages and opt-in ratios with a 5% kitchen buffer.",
      color: "bg-[#EF6A32]/12 text-[#A91D32]",
    },
    {
      icon: Star,
      title: "Student Culinary Reviews",
      desc: "1 to 5 star ratings and qualitative comments unlocked strictly after meal serving commences.",
      color: "bg-[#FFBFA5]/45 text-[#A91D32]",
    },
    {
      icon: ShoppingBag,
      title: "Pantry & Recipe Matcher",
      desc: "Real-time kitchen stock tracking that matches ingredients against recipes with 70%+ availability scores.",
      color: "bg-[#24866B]/10 text-[#24866B]",
    },
  ];

  return (
    <div className="landing-page min-h-screen flex flex-col overflow-hidden antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-[#EADCD6]/80 bg-white/85 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#241D1B]">
            <QubiteLogo size="md" className="border-[#FFBFA5]/70 bg-white" />
            <div>
              <span>Meal<span className="text-[#EF6A32]">Sync</span></span>
              <span className="-mt-1 block text-[10px] font-bold uppercase tracking-widest text-[#71645F]">
                Smarter Meals. Seamless Management.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-4 py-2 text-xs font-bold text-[#241D1B] transition-colors duration-200 hover:text-[#A91D32] sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-[12px] border border-[#A91D32] bg-[#A91D32] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_-12px_rgba(169,29,50,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8E1729] sm:px-5"
            >
              Student Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 overflow-hidden py-12 sm:py-16 lg:min-h-[620px] lg:py-20">
        <div className="landing-hero-grid absolute inset-0 pointer-events-none opacity-70" />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-28 h-72 w-72 rounded-full bg-[#FFBFA5]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-[8%] top-10 h-24 w-24 rotate-45 rounded-[28px] border border-[#EF6A32]/10 bg-white/30"
        />

        <div className="container relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-4">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EADCD6] bg-white px-3.5 py-1.5 text-xs font-bold text-[#241D1B] shadow-[0_10px_30px_-20px_rgba(169,29,50,0.35)]">
              <Sparkles className="h-3.5 w-3.5 fill-[#FFBFA5] text-[#EF6A32]" />
              <span>Intelligent Food &amp; Dining Management Platform</span>
            </div>

            <h1 className="mt-6 text-[40px] font-bold leading-[1.06] tracking-[-0.035em] text-[#241D1B] sm:text-5xl lg:text-[64px]">
              Smart Dining. Zero Waste.{" "}
              <span className="text-[#A91D32]">
                Effortless Hostel Operations.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#71645F] sm:text-base lg:mx-0">
              The next-generation digital mess platform designed for colleges and universities. Real-time meal opt-ins, transparent cutoff timers, digital dining wallet, and predictive demand analytics.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/login"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] bg-[#A91D32] px-7 py-3 text-sm font-bold text-white shadow-[0_18px_35px_-18px_rgba(169,29,50,0.72)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8E1729]"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-[12px] border border-[#EADCD6] bg-white px-7 py-3 text-sm font-bold text-[#241D1B] shadow-[0_10px_24px_-18px_rgba(36,29,27,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFBFA5] hover:text-[#A91D32]"
              >
                Admin Management Console
              </Link>
            </div>
          </div>

          <div className="relative mt-2 lg:mt-0">
            <IsometricHeroArtwork />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative border-t border-[#EADCD6]/70 bg-white/35 py-16">
        <div className="container mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#241D1B] md:text-3xl">
            A Professional SaaS Experience
          </h2>
          <p className="mt-3 text-xs text-[#71645F]">
            Engineered with soft neubrutalism, warm cream aesthetics, and instant interactions.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 text-left md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="landing-feature-card space-y-3 rounded-[20px] border border-[#EADCD6] bg-white p-6 shadow-[0_18px_45px_-30px_rgba(36,29,27,0.28)]"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${feat.color}`}>
                    <Icon className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-bold text-[#241D1B]">{feat.title}</h3>
                  <p className="text-xs leading-6 text-[#71645F]">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#EADCD6] bg-white py-8 text-center text-xs text-[#71645F]">
        <div className="container mx-auto px-5 sm:px-6">
          <p>© {new Date().getFullYear()} MealSync • Smarter Meals. Seamless Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
