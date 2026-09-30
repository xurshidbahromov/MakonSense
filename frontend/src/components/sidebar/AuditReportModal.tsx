import React from 'react';
import { X, Printer, CheckCircle2, AlertTriangle, ShieldCheck, Download, Share2 } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const AuditReportModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen, auditReport, auditLoading } = useAnalyticsStore();

  if (!reportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto select-text">
      <div className="bg-white border border-[#0C4137]/[0.12] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative text-[#0C4137]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#0C4137]/[0.08] flex items-center justify-between bg-[#F8FAF9] no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center text-[#0C4137] font-bold text-xs">
              MKN
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0C4137] flex items-center gap-2">
                Fazoviy Audit Hisoboti
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 font-semibold">
                  {auditReport?.report_id || 'YUKLANMOQDA...'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                MakonSense Tijoriy Joylashuv Auditi (Toshkent Shahri)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0C4137] text-white font-semibold text-xs hover:bg-[#072822] transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-[#06D6A0]" />
              <span>Chop etish / PDF</span>
            </button>
            <button
              onClick={() => setReportModalOpen(false)}
              className="p-1.5 rounded-full bg-neutral-100 text-neutral-500 hover:text-[#0C4137] hover:bg-neutral-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content / Printable Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#0C4137]">
          {auditLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-2 border-[#06D6A0] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-neutral-500">PostGIS va H3 fazoviy ko'rsatkichlari qayta ishlanmoqda...</p>
            </div>
          ) : auditReport ? (
            <>
              {/* Report Title & Metadata Banner */}
              <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Tahlil Obyekti</div>
                  <h1 className="text-xl font-extrabold text-[#0C4137] mt-0.5">{auditReport.business_name}</h1>
                  <div className="flex items-center gap-3 text-xs text-neutral-600 mt-2 font-medium">
                    <span>Koordinata: <strong className="font-mono text-[#0C4137]">{auditReport.target_location.latitude.toFixed(5)}°N, {auditReport.target_location.longitude.toFixed(5)}°E</strong></span>
                    <span>Toifa: <strong className="capitalize text-[#0C4137]">{auditReport.business_category}</strong></span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-extrabold font-mono text-[#0C4137]">
                    {auditReport.makon_score.toFixed(1)} <span className="text-sm text-neutral-400 font-normal">/ 100</span>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/40 mt-1">
                    {auditReport.status}
                  </div>
                </div>
              </div>

              {/* 1. Executive Summary & Verdict */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">1. Xulosa va Ekspert Bahosi</h3>
                <div className="bg-white border border-[#0C4137]/[0.08] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm">
                  <p className="text-neutral-700">{auditReport.executive_summary}</p>
                  <div className="pt-2 border-t border-[#0C4137]/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Xavf darajasi: <strong className="text-[#0C4137]">{auditReport.risk_level}</strong></span>
                    <span className="text-neutral-500">Generatsiya vaqti: <strong className="font-mono text-[#0C4137]">{auditReport.generated_at}</strong></span>
                  </div>
                </div>
              </div>

              {/* 2. Factor Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">2. Fazoviy Baholash Matritsasi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Tranzit (30%)</span>
                    <div className="text-xl font-extrabold font-mono text-[#0C4137] mt-1">
                      {auditReport.factors.transit_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Metro va bekatlar</span>
                  </div>
                  <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Tortish Markazlari (25%)</span>
                    <div className="text-xl font-extrabold font-mono text-[#06D6A0] mt-1">
                      {auditReport.factors.anchor_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Mall va bozorlar</span>
                  </div>
                  <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Raqobat Bosimi (-25%)</span>
                    <div className="text-xl font-extrabold font-mono text-amber-600 mt-1">
                      {auditReport.factors.competition_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Toifadosh nuqtalar</span>
                  </div>
                  <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Aholi Qamrovi (20%)</span>
                    <div className="text-xl font-extrabold font-mono text-[#0C4137] mt-1">
                      {auditReport.factors.residential_density_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Turar-joy massivlari</span>
                  </div>
                </div>
              </div>

              {/* 3. Surroundings & Competitors */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">3. Joylashuv Infratuzilmasi</h3>
                <div className="bg-white border border-[#0C4137]/[0.08] rounded-2xl p-4 text-xs space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <span className="text-neutral-500">Eng yaqin metro bekati:</span>
                      <div className="font-bold text-[#0C4137] mt-0.5">
                        {auditReport.context.nearest_metro?.name || '500m radiusda metro yo\'q'}
                        {auditReport.context.nearest_metro && (
                          <span className="text-[#06D6A0] font-mono ml-2 font-bold">
                            ({auditReport.context.nearest_metro.distance_meters.toFixed(0)} metr)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Xonadonlar potensiali:</span>
                      <div className="font-bold text-[#0C4137] mt-0.5">
                        ~{auditReport.context.estimated_households.toLocaleString()} ta xonadon
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Raqobatchilar soni (400m):</span>
                      <div className="font-bold text-amber-600 mt-0.5">
                        {auditReport.context.direct_competitors_count} ta nuqta
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. SWOT Analysis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">4. SWOT Strategik Tahlil</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Strengths */}
                  <div className="bg-[#E6FBF6] border border-[#06D6A0]/30 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-[#0C4137] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" /> Kuchli Tomonlar (Strengths)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                      {auditReport.swot_analysis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Zaif Tomonlar (Weaknesses)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                      {auditReport.swot_analysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-sky-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-600" /> Imkoniyatlar (Opportunities)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                      {auditReport.swot_analysis.opportunities.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Xatarlar (Threats)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                      {auditReport.swot_analysis.threats.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. Strategic Recommendation Footer */}
              <div className="bg-[#E6FBF6] border border-[#06D6A0]/40 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 font-bold uppercase text-[10px]">Yakuniy Strategik Tavsiya:</span>
                  <p className="text-[#0C4137] font-bold mt-0.5">{auditReport.recommendation}</p>
                </div>
                <div className="text-right text-[10px] text-neutral-400 font-mono hidden sm:block">
                  MakonSense Engine<br/>v1.0.0-MVP Tashkent
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuditReportModal;
