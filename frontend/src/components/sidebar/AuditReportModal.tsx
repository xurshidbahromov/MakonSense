import React from 'react';
import { X, Printer, CheckCircle2, AlertTriangle, ShieldCheck, Download, Share2 } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const AuditReportModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen, auditReport, auditLoading } = useAnalyticsStore();

  if (!reportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto select-text">
      <div className="bg-[#13151D] border border-[#222735] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#222735] flex items-center justify-between bg-[#0D0F16] no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              MKN
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Fazoviy Audit Hisoboti
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1A1E2C] text-emerald-400 border border-[#222735]">
                  {auditReport?.report_id || 'YUKLANMOQDA...'}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                MakonSense Tijoriy Joylashuv Auditi (Toshkent Shahri)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all shadow-md active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish / PDF</span>
            </button>
            <button
              onClick={() => setReportModalOpen(false)}
              className="p-1.5 rounded-lg bg-[#1A1E2C] text-gray-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content / Printable Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-200">
          {auditLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">PostGIS va H3 fazoviy ko'rsatkichlari qayta ishlanmoqda...</p>
            </div>
          ) : auditReport ? (
            <>
              {/* Report Title & Metadata Banner */}
              <div className="bg-[#1A1E2C] border border-[#222735] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tahlil Obyekti</div>
                  <h1 className="text-xl font-extrabold text-white mt-0.5">{auditReport.business_name}</h1>
                  <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                    <span>Koordinata: <strong className="font-mono text-emerald-400">{auditReport.target_location.latitude.toFixed(5)}°N, {auditReport.target_location.longitude.toFixed(5)}°E</strong></span>
                    <span>Toifa: <strong className="capitalize text-white">{auditReport.business_category}</strong></span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {auditReport.makon_score.toFixed(1)} <span className="text-sm text-gray-400 font-normal">/ 100</span>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 mt-1">
                    {auditReport.status}
                  </div>
                </div>
              </div>

              {/* 1. Executive Summary & Verdict */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">1. Xulosa va Ekspert Bahosi</h3>
                <div className="bg-[#13151D] border border-[#222735] rounded-xl p-4 text-xs leading-relaxed space-y-2">
                  <p className="text-gray-200">{auditReport.executive_summary}</p>
                  <div className="pt-2 border-t border-[#222735] flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Xavf darajasi: <strong className="text-cyan-400">{auditReport.risk_level}</strong></span>
                    <span className="text-gray-400">Generatsiya vaqti: <strong className="font-mono text-gray-300">{auditReport.generated_at}</strong></span>
                  </div>
                </div>
              </div>

              {/* 2. Factor Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">2. Fazoviy Baholash Matritsasi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="bg-[#1A1E2C] border border-[#222735] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Tranzit (30%)</span>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                      {auditReport.factors.transit_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-gray-500">Metro va bekatlar</span>
                  </div>
                  <div className="bg-[#1A1E2C] border border-[#222735] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Tortish Markazlari (25%)</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {auditReport.factors.anchor_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-gray-500">Mall va bozorlar</span>
                  </div>
                  <div className="bg-[#1A1E2C] border border-[#222735] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Raqobat Bosimi (-25%)</span>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                      {auditReport.factors.competition_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-gray-500">Toifadosh nuqtalar</span>
                  </div>
                  <div className="bg-[#1A1E2C] border border-[#222735] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Aholi Qamrovi (20%)</span>
                    <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                      {auditReport.factors.residential_density_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-gray-500">Turar-joy massivlari</span>
                  </div>
                </div>
              </div>

              {/* 3. Surroundings & Competitors */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">3. Joylashuv Infratuzilmasi</h3>
                <div className="bg-[#13151D] border border-[#222735] rounded-xl p-4 text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <span className="text-gray-400">Eng yaqin metro bekati:</span>
                      <div className="font-semibold text-white mt-0.5">
                        {auditReport.context.nearest_metro?.name || '500m radiusda metro yo\'q'}
                        {auditReport.context.nearest_metro && (
                          <span className="text-cyan-400 font-mono ml-2">
                            ({auditReport.context.nearest_metro.distance_meters.toFixed(0)} metr)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Xonadonlar potensiali:</span>
                      <div className="font-semibold text-white mt-0.5">
                        ~{auditReport.context.estimated_households.toLocaleString()} ta xonadon
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Raqobatchilar soni (400m):</span>
                      <div className="font-semibold text-amber-400 mt-0.5">
                        {auditReport.context.direct_competitors_count} ta nuqta
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. SWOT Analysis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">4. SWOT Strategik Tahlil</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Strengths */}
                  <div className="bg-[#1A1E2C]/80 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kuchli Tomonlar (Strengths)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                      {auditReport.swot_analysis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-[#1A1E2C]/80 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Zaif Tomonlar (Weaknesses)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                      {auditReport.swot_analysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-[#1A1E2C]/80 border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Imkoniyatlar (Opportunities)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                      {auditReport.swot_analysis.opportunities.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="bg-[#1A1E2C]/80 border border-rose-500/20 rounded-xl p-3.5 space-y-2">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Xatarlar (Threats)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                      {auditReport.swot_analysis.threats.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. Strategic Recommendation Footer */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-[#13151D] to-cyan-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Yakuniy Strategik Tavsiya:</span>
                  <p className="text-white font-medium mt-0.5">{auditReport.recommendation}</p>
                </div>
                <div className="text-right text-[10px] text-gray-500 hidden sm:block">
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
