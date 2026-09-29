import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "MakonScore ko'rsatkichi qanday hisoblanadi va u nimaga asoslanadi?",
    a: "MakonScore (0 dan 100 gacha) — Toshkent shahri fazoviy ma'lumotlar bazasi asosida 4 ta fundamental omil bo'yicha hisoblanadi: Piyodalar va metro tranziti (30%), Yirik tortish markazlari (25%), Toifadosh raqobat bosimi (-25% jarima) va Turar-joy massivlari aholi qamrovi (20%). Barcha hisob-kitoblar PostGIS va Uber H3 geksagonal algoritmlari orqali xolis amalga oshiriladi.",
  },
  {
    q: "Toshkentning qaysi tumanlari va hududlari qamrab olingan?",
    a: "Hozirda butun Toshkent shahrining barcha 12 ta ma'muriy tumani (Chilonzor, Yunusobod, Mirobod, Yakkasaroy, Shayxontohur, Mirzo Ulug'bek, Sergeli va boshqalar), 48 ta metro bekati, barcha yirik bozorlar, supermarketlar va savdo markazlari to'liq kiritilgan.",
  },
  {
    q: "PDF Audit hisoboti biznesimga qanday yordam beradi?",
    a: "Avtomatik generatsiya qilinadigan 5 bo'limli PDF Audit — banklar, xorijiy franchayzerlar yoki mahalliy investorlarga taqdim etish uchun tayyor professional hujjatdir. Unda hududning kuchli va zaif tomonlari (SWOT), raqobatchilar ro'yxati, piyoda yetib borish vaqti va xavf darajasi yoritiladi.",
  },
  {
    q: "Qaysi biznes toifalari bo'yicha tahlil qilish mumkin?",
    a: "Platforma hozirda eng ommabop 5 ta asosiy tijorat toifasini qo'llab-quvvatlaydi: Kafe & Fast-food (HoReCa), Dorixonalar, Supermarket va oziq-ovqat, O'quv markazlari va maktablar hamda Chakana savdo (Retail). Har bir toifa o'zining individual iste'mol radiusi va raqobat filtrlari bo'yicha tahlil qilinadi.",
  },
  {
    q: "Ikkita muqobil lokatsiyani solishtirish imkoni bormi?",
    a: "Ha! Platformaning 'A/B Taqqoslash' funksiyasi orqali siz o'zingiz tanlagan joyni Toshkentning eng gavjum nuqtalari (masalan, Amir Temur, Chilonzor 9-Mavze yoki Tashkent City) bilan yonma-yon qo'yib, qaysi biri ko'proq daromad keltirishini solishtirishingiz mumkin.",
  },
  {
    q: "Platformadan hozir bepul foydalanish mumkinmi?",
    a: "Ha! MakonSense ning barcha asosiy fazoviy tahlil funksiyalari, interaktiv 3D xaritasi, MakonScore hisoblagichi va PDF Audit namunasi hozirda bepul taqdim etilmoqda.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 font-mono">
            Savol-Javoblar
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ko'p beriladigan savollar
          </h2>
          <p className="text-sm text-gray-400">
            MakonSense platformasi haqida eng muhim ma'lumotlar bilan tanishing.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0C0E17]/85 border border-white/[0.08] hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/[0.04] pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
