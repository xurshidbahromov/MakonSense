import React, { useState } from 'react';
import { Plus, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FaqItem {
  id: string;
  q: string;
  a: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    id: "makonscore-calc",
    tag: "Algoritm",
    q: "MakonScore ko‘rsatkichi qanday hisoblanadi va u nimaga asoslanadi?",
    a: "MakonScore (0 dan 100 gacha) — Toshkent shahri fazoviy ma’lumotlar bazasi asosida 4 ta fundamental omil bo‘yicha hisoblanadi: Piyodalar va metro tranziti (30%), Yirik tortish markazlari (25%), Toifadosh raqobat bosimi (-25% jarima) va Turar-joy massivlari aholi qamrovi (20%). Barcha hisob-kitoblar PostGIS va Uber H3 geksagonal algoritmlari orqali xolis amalga oshiriladi.",
  },
  {
    id: "coverage",
    tag: "Hududlar",
    q: "Toshkentning qaysi tumanlari va hududlari qamrab olingan?",
    a: "Hozirda butun Toshkent shahrining barcha 12 ta ma’muriy tumani (Chilonzor, Yunusobod, Mirobod, Yakkasaroy, Shayxontohur, Mirzo Ulug‘bek, Sergeli, Uchtepa, Olmazor, Bektemir, Yashnobod, Yangihayot), 48 ta metro bekati, barcha yirik bozorlar, supermarketlar va savdo markazlari to‘liq kiritilgan.",
  },
  {
    id: "pdf-audit",
    tag: "Hisobot",
    q: "PDF Audit hisoboti biznesimga qanday yordam beradi?",
    a: "Avtomatik generatsiya qilinadigan 5 bo‘limli PDF Audit — banklar, xorijiy franchayzerlar yoki mahalliy investorlarga taqdim etish uchun tayyor professional hujjatdir. Unda hududning kuchli va zaif tomonlari (SWOT), raqobatchilar ro‘yxati, piyoda yetib borish vaqti va xavf darajasi yoritiladi.",
  },
  {
    id: "categories",
    tag: "Biznes turlari",
    q: "Qaysi biznes toifalari bo‘yicha tahlil qilish mumkin?",
    a: "Platforma hozirda eng ommabop 5 ta asosiy tijorat toifasini qo‘llab-quvvatlaydi: Kafe & Fast-food (HoReCa), Dorixonalar, Supermarket va oziq-ovqat, O‘quv markazlari va maktablar hamda Chakana savdo (Retail). Har bir toifa o‘zining individual iste’mol radiusi va raqobat filtrlari bo‘yicha tahlil qilinadi.",
  },
  {
    id: "ab-test",
    tag: "Taqqoslash",
    q: "Ikkita muqobil lokatsiyani solishtirish imkoni bormi?",
    a: "Ha! Platformaning «A/B Taqqoslash» funksiyasi orqali siz o‘zingiz tanlagan joyni Toshkentning eng gavjum nuqtalari (masalan, Amir Temur xiyoboni, Chilonzor 9-Mavze yoki Tashkent City) bilan yonma-yon qo‘yib, qaysi biri ko‘proq daromad keltirishini solishtirishingiz mumkin.",
  },
  {
    id: "pricing",
    tag: "Narx siyosati",
    q: "Platformadan hozir bepul foydalanish mumkinmi?",
    a: "Ha! MakonSense ning barcha asosiy fazoviy tahlil funksiyalari, interaktiv 3D xaritasi, MakonScore hisoblagichi va PDF Audit namunasi hozirda ochiq beta davrida bepul taqdim etilmoqda.",
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("makonscore-calc");

  return (
    <section id="faq" className="py-24 sm:py-32 relative bg-[#FBFBFD] border-t border-[#0C4137]/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: JPRQ Eyebrow & Display Title */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold">
              <span className="text-[#06D6A0]">●</span>
              <span>SAVOL VA JAVOBLAR</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0C4137] tracking-tight leading-[1.1]">
              Eng ko‘p beriladigan <br />
              <span className="text-neutral-400">muhim savollar.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              MakonSense ning Toshkent fazoviy ma’lumotlar bazasi, MakonScore algoritmlari va audit tizimi haqida barcha tafsilotlar.
            </p>

            {/* Quick Contact Card */}
            <div className="p-5 rounded-[14px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#0C4137]">
                <MessageSquare className="w-4 h-4 text-[#06D6A0]" />
                <span>Boshqa savolingiz bormi?</span>
              </div>
              <p className="text-xs text-neutral-500 leading-normal">
                Mutaxassislarimiz bilan to‘g‘ridan-to‘g‘ri bog‘lanib, korporativ tahlil va API integratsiyasini muhokama qiling.
              </p>
              <a
                href="https://t.me/makonsense"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0C4137] hover:text-[#06D6A0] transition-colors group"
              >
                <span>Telegram orqali yozish</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: JPRQ Style Modular Accordion Cards */}
          <div className="lg:col-span-8 space-y-3.5">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-[14px] transition-all duration-200 border ${
                    isOpen
                      ? 'bg-white border-[#06D6A0]/50 shadow-[0_4px_20px_rgba(12,65,55,0.06)]'
                      : 'bg-[#F7F9F8] border-[#0C4137]/[0.08] hover:border-[#0C4137]/20 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5 pr-2">
                      <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#06D6A0] font-bold">
                        {faq.tag}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#0C4137] leading-snug">
                        {faq.q}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 mt-1 ${
                        isOpen
                          ? 'rotate-45 bg-[#0C4137] text-[#06D6A0]'
                          : 'bg-[#0C4137]/[0.06] text-[#0C4137]'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-[#0C4137]/[0.05] animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
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
