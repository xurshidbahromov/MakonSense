import React, { useState } from 'react';
import { MorphAnchor } from './MorphObject';

interface FaqItem {
  id: string;
  tag: string;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'makonscore-calc',
    tag: 'Algoritm',
    q: "MakonScore ko'rsatkichi qanday hisoblanadi?",
    a: "MakonScore (0 dan 100 gacha) — O'zbekiston fazoviy ma'lumotlar bazasi asosida 4 ta omil bo'yicha hisoblanadi: Piyodalar va transport tranziti (30%), Yirik savdo markazlari (25%), Raqobat bosimi (–25% jarima) va Turar-joy aholi qamrovi (20%). Hisob-kitoblar PostGIS va Uber H3 algoritmlari orqali amalga oshiriladi.",
  },
  {
    id: 'coverage',
    tag: 'Hududlar',
    q: "MakonSense O'zbekistonning qaysi hududlarini qamrab olgan?",
    a: "Platforma butun O'zbekiston Respublikasining barcha 14 ta ma'muriy hududini, 208 ta shahar va tumanini, 524,000+ dan ortiq bino va savdo obyektlarini to'liq qamrab oladi: Toshkent shahri va viloyati, Samarqand, Farg'ona, Andijon, Namangan, Buxoro, Navoiy, Qashqadaryo, Surxondaryo, Xorazm, Jizzax, Sirdaryo va Qoraqalpog'iston.",
  },
  {
    id: 'pdf-audit',
    tag: 'Hisobot',
    q: 'PDF Audit hisoboti biznesga qanday yordam beradi?',
    a: "5 bo'limli PDF Audit banklar, xorijiy franchayzerlar yoki investorlarga taqdim etish uchun tayyor professional hujjatdir. Unda SWOT tahlili, raqobatchilar ro'yxati, piyoda yetib borish vaqti va xavf darajasi yoritiladi.",
  },
  {
    id: 'categories',
    tag: 'Biznes turlari',
    q: 'Qaysi biznes toifalari bo\'yicha tahlil qilish mumkin?',
    a: "Platforma 5 ta asosiy toifani qo'llab-quvvatlaydi: Kafe & Fast-food (HoReCa), Dorixonalar, Supermarket va oziq-ovqat, O'quv markazlari va Chakana savdo (Retail). Har bir toifa individual raqobat filtrlari bilan tahlil qilinadi.",
  },
  {
    id: 'ab-test',
    tag: 'Taqqoslash',
    q: 'Ikkita lokatsiyani solishtirish imkoni bormi?',
    a: "Ha! «A/B Taqqoslash» funksiyasi orqali siz tanlagan joyni Toshkentning eng gavjum nuqtalari bilan yonma-yon qo'yib, qaysi biri ko'proq daromad keltirishini aniq ko'rasiz.",
  },
  {
    id: 'pricing',
    tag: 'Narx',
    q: "Platformadan hozir bepul foydalanish mumkinmi?",
    a: "Ha! MakonSense ning barcha asosiy funksiyalari — interaktiv xarita, MakonScore hisoblagichi va PDF Audit namunasi — hozirda to'liq bepul. Karta raqami va ro'yxatdan o'tish talab qilinmaydi.",
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faq"
      className="py-24 sm:py-36 border-t border-black/[0.05] dark:border-white/[0.05] select-none scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">

        {/* Label + Headline */}
        <div className="max-w-2xl">
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-500 dark:text-neutral-400 font-semibold">
            Ko'p so'raladigan savollar
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
            Savollar &{' '}
            <span className="text-neutral-400 dark:text-neutral-500 font-normal">javoblar.</span>
          </h2>
        </div>

        {/* FAQ List with Grand 3D Gyroscope Ring Hologram Backdrop */}
        <div className="relative mt-14">
          {/* Top-Right Quadrant 3D Backdrop Anchor (2/4 scale, peeks out visibly above box) */}
          <div className="absolute -top-36 sm:-top-44 -right-12 lg:-right-6 xl:right-0 pointer-events-none -z-10">
            <MorphAnchor shape="ring" className="w-[580px] h-[580px] lg:w-[640px] lg:h-[640px] xl:w-[680px] xl:h-[680px]" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 rounded-3xl bg-white/35 dark:bg-[#161616]/35 backdrop-blur-md backdrop-saturate-[150%] border-2 border-white/80 dark:border-white/[0.05] shadow-none dark:shadow-none divide-y divide-black/[0.05] dark:divide-white/[0.07]">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="py-1"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 mt-0.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#0E9F6E] bg-[#0E9F6E]/[0.08] px-2 py-0.5 rounded-sm">
                      {faq.tag}
                    </span>
                    <span className="text-[16px] font-semibold text-[#111111] dark:text-[#FDFDFD] group-hover:text-[#0E9F6E] transition-colors duration-150 leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 mt-0.5 w-5 h-5 text-neutral-400 group-hover:text-[#0E9F6E] transition-all duration-200 ${isOpen ? 'rotate-45 text-[#0E9F6E]' : ''}`}
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10 4v12M4 10h12" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{ maxHeight: isOpen ? '400px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <p className="pb-6 pl-[calc(2.5rem+0.5rem)] text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
