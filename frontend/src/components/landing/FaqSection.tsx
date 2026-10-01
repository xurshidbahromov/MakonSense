import React, { useState } from 'react';

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
    a: "Platforma butun O'zbekiston Respublikasining barcha 14 ta ma'muriy hududini, 208 ta shahar va tumanini, 500,000+ dan ortiq bino va savdo obyektlarini to'liq qamrab oladi: Toshkent shahri va viloyati, Samarqand, Farg'ona, Andijon, Namangan, Buxoro, Navoiy, Qashqadaryo, Surxondaryo, Xorazm, Jizzax, Sirdaryo va Qoraqalpog'iston.",
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
    a: "Ha! MakonSense ning barcha asosiy funksiyalari — interaktiv xarita, MakonScore hisoblagichi va PDF Audit namunasi — hozirda ochiq beta davrida to'liq bepul taqdim etilmoqda.",
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faq"
      className="py-24 sm:py-36 bg-[#FDFDFD] dark:bg-[#111111] border-t border-black/[0.05] dark:border-white/[0.05] select-none"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">

        {/* Label + Headline */}
        <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
          Ko'p so'raladigan savollar
        </span>

        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
          Savollar &{' '}
          <span className="text-[#A4A9A5] font-normal">javoblar.</span>
        </h2>

        {/* FAQ List */}
        <div className="mt-16 space-y-0">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border-b border-black/[0.06] dark:border-white/[0.06]"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-start justify-between gap-4 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 mt-0.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#A4A9A5] bg-[#A4A9A5]/[0.08] px-2 py-0.5 rounded-sm">
                      {faq.tag}
                    </span>
                    <span className="text-[16px] font-semibold text-[#111111] dark:text-[#FDFDFD] group-hover:text-[#0E9F6E] transition-colors duration-150 leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 mt-0.5 w-5 h-5 text-[#A4A9A5] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
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
                  <p className="pb-7 pl-[calc(2.5rem+0.5rem)] text-[15px] leading-relaxed text-[#A4A9A5] dark:text-[#A4A9A5]">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
