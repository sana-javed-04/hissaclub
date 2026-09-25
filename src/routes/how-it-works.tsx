import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Shield,
  Send,
  CheckCircle2,
  Users,
  Smartphone,
  Lock,
  Globe,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — HissaClub" },
      {
        name: "description",
        content:
          "Learn how to create, contribute to, and manage group expense pools easily with HissaClub.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const content = {
  en: {
    badge: "User Guide",
    title: "How HissaClub Works",
    subtitle: "A simple guide to pool group money without awkward follow-ups.",
    toggleBtn: "اردو میں پڑھیں",
    roles: {
      organiser: "Organiser Flow",
      member: "Contributor Flow",
    },
    organiserSteps: [
      {
        step: "01",
        title: "Create your pool",
        desc: "Set your target amount, equal shares or open split, and your secret 4-digit PIN.",
        icon: Users,
      },
      {
        step: "02",
        title: "Add expected members (Optional)",
        desc: "Bulk paste names and numbers from WhatsApp to prepare your 1-click nudge queue.",
        icon: Smartphone,
      },
      {
        step: "03",
        title: "Add payout details",
        desc: "Provide your JazzCash, EasyPaisa, SadaPay or Bank IBAN where members should transfer.",
        icon: Send,
      },
      {
        step: "04",
        title: "Verify slips & nudge remaining",
        desc: "Open your PIN-protected dashboard, inspect uploaded screenshots, and send WhatsApp reminders.",
        icon: Shield,
      },
    ],
    memberSteps: [
      {
        step: "01",
        title: "Open the pool link",
        desc: "Open on any mobile or desktop browser without downloading an app or signing up.",
        icon: Globe,
      },
      {
        step: "02",
        title: "Transfer your share",
        desc: "Copy organiser details and send payment directly through your banking or wallet app.",
        icon: Send,
      },
      {
        step: "03",
        title: "Claim your share",
        desc: "Submit your name, phone number, and attach the transaction screenshot.",
        icon: CheckCircle2,
      },
      {
        step: "04",
        title: "Track verification privately",
        desc: "Your device securely saves your submission and displays approval status without leaking it to the public.",
        icon: Lock,
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Can other members see my payment slip?",
        a: "No. Payment receipts and verification slips are strictly confidential and only visible to the pool organiser inside their PIN-protected dashboard.",
      },
      {
        q: "Can someone contribute if they weren't pre-added?",
        a: "Yes! Any friend with the shared pool link can submit a payment anytime using the 'Claim your share' button.",
      },
      {
        q: "What if I used a different WhatsApp number?",
        a: "If the organiser added you beforehand, please use that exact number when submitting your claim so your pending slot updates automatically.",
      },
    ],
    ctaTitle: "Ready to start collecting?",
    ctaBtn: "Start a free pool",
  },
  ur: {
    badge: "رہنمائی اور طریقہ کار",
    title: "حصہ کلب کیسے کام کرتا ہے؟",
    subtitle: "بغیر کسی جھجھک کے گروپ اخراجات اور کمیٹی رقم اکٹھی کرنے کا آسان طریقہ۔",
    toggleBtn: "Read in English",
    roles: {
      organiser: "پول ایڈمن کا طریقہ",
      member: "رقم دینے والے ممبر کا طریقہ",
    },
    organiserSteps: [
      {
        step: "01",
        title: "نیا پول بنائیں",
        desc: "ٹارگٹ رقم اور برابر حصہ منتخب کریں، اور اپنا 4 ہندسوں کا خفیہ پن (PIN) سیٹ کریں۔",
        icon: Users,
      },
      {
        step: "02",
        title: "ممبران کے نام شامل کریں (اختیاری)",
        desc: "واٹس ایپ گروپ سے نام اور نمبر بلک پیسٹ کریں تاکہ خودکار ریمائنڈر لسٹ تیار ہو سکے۔",
        icon: Smartphone,
      },
      {
        step: "03",
        title: "پیمنٹ اکاؤنٹ کی تفصیلات دیں",
        desc: "اپنا JazzCash، EasyPaisa یا بینک اکاؤنٹ درج کریں تاکہ ممبران رقم ٹرانسفر کر سکیں۔",
        icon: Send,
      },
      {
        step: "04",
        title: "رسیدیں چیک کریں اور ریمائنڈر بھیجیں",
        desc: "خفیہ پن سے ڈیش بورڈ کھولیں، سکرین شاٹس دیکھ کر تصدیق کریں اور باقی ممبران کو واٹس ایپ پر یاد دہانی کرائیں۔",
        icon: Shield,
      },
    ],
    memberSteps: [
      {
        step: "01",
        title: "پول کا لنک کھولیں",
        desc: "بغیر کسی ایپ ڈاؤنلوڈ یا لاگ ان کے، لنک سیدھا کسی بھی براؤزر پر کھولیں۔",
        icon: Globe,
      },
      {
        step: "02",
        title: "رقم ٹرانسفر کریں",
        desc: "سکرین پر نظر آنے والے اکاؤنٹ نمبر پر اپنا حصہ JazzCash یا بینک ایپ کے ذریعے بھیجیں۔",
        icon: Send,
      },
      {
        step: "03",
        title: "اپنا حصہ کلیم کریں",
        desc: "اپنا نام اور واٹس ایپ نمبر لکھیں اور پیمنٹ کا سکرین شاٹ منسلک کر کے جمع کرائیں۔",
        icon: CheckCircle2,
      },
      {
        step: "04",
        title: "تصدیق پر نظر رکھیں",
        desc: "آپ کی رسید پبلک نہیں ہوگی۔ جیسے ہی ایڈمن تصدیق کرے گا، آپ کے موبائل پر سٹیٹس ویریفائیڈ ہو جائے گا۔",
        icon: Lock,
      },
    ],
    faqTitle: "اکثر پوچھے جانے والے سوالات",
    faqs: [
      {
        q: "کیا ہر کوئی میری پیمنٹ سلپ دیکھ سکتا ہے؟",
        a: "ہرگز نہیں! سکرین شاٹ اور رسیدیں مکمل پرائیویٹ ہیں اور صرف ایڈمن اپنے پن کوڈ سے ڈیش بورڈ میں دیکھ سکتا ہے۔",
      },
      {
        q: "اگر میرا نام لسٹ میں نہ ہو تو کیا میں پیسے بھیج سکتا ہوں؟",
        a: "جی ہاں! لنک رکھنے والا کوئی بھی دوست 'Claim your share' دبا کر براہ راست رقم بھیج سکتا ہے۔",
      },
      {
        q: "اگر میں نے مختلف نمبر سے کلیم کیا تو کیا ہوگا؟",
        a: "اگر ایڈمن نے آپ کو پہلے سے ایڈ کیا تھا، تو کلیم کرتے وقت وہی نمبر لکھیں تاکہ آپ کا سٹیٹس خود بخود اپڈیٹ ہو سکے۔",
      },
    ],
    ctaTitle: "کیا آپ نیا پول بنانے کے لیے تیار ہیں؟",
    ctaBtn: "مفت پول بنائیں",
  },
};

function HowItWorksPage() {
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [activeTab, setActiveTab] = useState<"organiser" | "member">("organiser");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const t = content[lang];
  const isUrdu = lang === "ur";
  const steps = activeTab === "organiser" ? t.organiserSteps : t.memberSteps;

  return (
    <div
      className={`mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-12 ${isUrdu ? "font-sans text-right" : ""}`}
      dir={isUrdu ? "rtl" : "ltr"}
    >
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
            <HelpCircle className="h-3 w-3" /> {t.badge}
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{t.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "ur" : "en")}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground transition-all hover:border-primary hover:bg-secondary cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span>{t.toggleBtn}</span>
        </button>
      </div>

      {/* Role Switcher Tabs */}
      <div className="mt-6 flex rounded-xl border border-border bg-secondary/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("organiser")}
          className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "organiser"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.roles.organiser}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("member")}
          className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "member"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.roles.member}
        </button>
      </div>

      {/* Modern Compact Step Cards */}
      <div className="mt-5 space-y-2.5">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className="card-surface p-3.5 sm:p-4 flex items-start gap-3 sm:gap-4 transition-all"
            >
              <div className="shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 text-primary font-mono font-bold text-sm sm:text-base">
                {st.step}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                    {st.title}
                  </h3>
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0 opacity-70" />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold sm:text-2xl text-foreground">{t.faqTitle}</h2>

        <div className="mt-4 space-y-2">
          {t.faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="card-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-bold text-foreground cursor-pointer"
                >
                  <span className={isUrdu ? "text-right flex-1 pl-2" : "flex-1 pr-2"}>{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs leading-relaxed text-muted-foreground border-t border-border/50 pt-2.5">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compact Bottom CTA */}
      <div className="card-surface mt-8 p-5 sm:p-8 text-center">
        <h2 className="text-base sm:text-xl font-bold">{t.ctaTitle}</h2>
        <div className="mt-3 flex justify-center">
          <Link to="/create" className="btn-primary text-xs sm:text-sm py-2 px-4">
            {t.ctaBtn} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
