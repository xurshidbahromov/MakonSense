import React, { useEffect, useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Download,
  Share2,
  Check,
  DollarSign,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const AuditReportModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen, auditReport, auditLoading } = useAnalyticsStore();
  const [copied, setCopied] = useState(false);

  // Close Audit Modal on Escape key
  useEffect(() => {
    if (!reportModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reportModalOpen, setReportModalOpen]);

  if (!reportModalOpen) return null;

  const fin = auditReport?.context?.financials;

  const handleDownloadJson = () => {
    if (!auditReport) return;
    const blob = new Blob([JSON.stringify(auditReport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${auditReport.report_id.toLowerCase()}-spatial-audit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    if (!auditReport) return;
    const summaryText = `MakonSense Audit [${auditReport.report_id}]\nManzil: ${auditReport.business_name}\nKoordinata: ${auditReport.target_location.latitude.toFixed(4)}, ${auditReport.target_location.longitude.toFixed(4)}\nMakonScore: ${auditReport.makon_score}/100 (${auditReport.status})\nTavsiya: ${auditReport.recommendation}`;
    navigator.clipboard?.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      onClick={() => setReportModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto overscroll-contain select-text"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="popover-origin-tc bg-white dark:bg-[#141416] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative text-[#111111] dark:text-[#FDFDFD] tabular-nums"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-black/[0.07] dark:border-white/[0.08] flex items-center justify-between bg-[#F8F9F8] dark:bg-[#18181B] no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0E9F6E]/15 border border-[#0E9F6E]/30 flex items-center justify-center text-[#0E9F6E] font-mono font-bold text-xs select-none">
              MKN
            </div>
            <div>
              <h2
                id="audit-modal-title"
                className="text-sm font-bold text-[#111111] dark:text-[#FDFDFD] flex items-center gap-2"
              >
                <span>Fazoviy va Moliyaviy Audit Hisoboti</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0E9F6E]/10 text-[#0E9F6E] border border-[#0E9F6E]/25 font-semibold">
                  {auditReport?.report_id || 'YUKLANMOQDA...'}
                </span>
              </h2>
              <p className="text-[11px] text-[#7A807C] dark:text-[#9CA3AF]">
                MakonSense B2B Tijoriy Joylashuv Ekspertizasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 select-none">
            <button
              type="button"
              onClick={handleCopySummary}
              title="Xulosani nusxalash"
              className="press-scale flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-xs font-medium cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0E9F6E]" />
                  <span className="hidden sm:inline text-[#0E9F6E]">Nusxalandi</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#7A807C]" />
                  <span className="hidden sm:inline">Ulashish</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              title="JSON formatda yuklab olish"
              className="press-scale flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-xs font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#0E9F6E]" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="press-scale flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-semibold text-xs hover:opacity-90 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#0E9F6E]" />
              <span>Chop etish / PDF</span>
            </button>

            <button
              type="button"
              aria-label="Hisobot oynasini yopish (Esc)"
              title="Yopish (Esc)"
              onClick={() => setReportModalOpen(false)}
              className="press-scale p-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] text-[#7A807C] hover:text-[#111111] dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Audit Content */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-5">
          {auditLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-9 h-9 border-2 border-[#0E9F6E] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#7A807C] dark:text-[#9CA3AF]">
                Fazoviy qatlamlar va ROI ko‘rsatkichlari hisoblanmoqda...
              </p>
            </div>
          ) : auditReport ? (
            <>
              {/* Report Title & Score Hero Banner */}
              <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono text-[#7A807C] dark:text-[#9CA3AF] uppercase tracking-wider font-bold">
                    Tahlil Obyekti · {auditReport.context.district_name || 'Toshkent sh.'}
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-[#111111] dark:text-[#FDFDFD] mt-0.5">
                    {auditReport.business_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#525854] dark:text-[#9CA3AF] mt-2">
                    <span>
                      GPS:{' '}
                      <strong className="font-mono text-[#111111] dark:text-[#FDFDFD]">
                        {auditReport.target_location.latitude.toFixed(5)}°N,{' '}
                        {auditReport.target_location.longitude.toFixed(5)}°E
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Biznes toifasi:{' '}
                      <strong className="uppercase font-mono text-[#0E9F6E]">
                        {auditReport.business_category}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end">
                  <div className="text-3xl font-bold font-mono text-[#111111] dark:text-[#FDFDFD]">
                    {auditReport.makon_score.toFixed(1)}{' '}
                    <span className="text-sm text-[#7A807C] font-normal">/ 100</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0E9F6E]/15 text-[#0E9F6E] border border-[#0E9F6E]/30 mt-1">
                    {auditReport.status}
                  </div>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] uppercase tracking-wider">
                  01 · Xulosa va Ekspert Bahosi
                </h3>
                <div className="bg-white dark:bg-[#18181B] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-4 text-xs leading-relaxed space-y-2">
                  <p className="text-[#27272A] dark:text-[#E5E7EB]">{auditReport.executive_summary}</p>
                  <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-[#7A807C]">
                      Investitsion risk:{' '}
                      <strong className="text-[#111111] dark:text-white">{auditReport.risk_level}</strong>
                    </span>
                    <span className="text-[#7A807C]">
                      Sana:{' '}
                      <strong className="font-mono text-[#111111] dark:text-white">
                        {auditReport.generated_at}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Financial & ROI Forecast Matrix */}
              {fin && (
                <div className="space-y-2">
                  <h3 className="text-[11px] font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#0E9F6E]" />
                    <span>02 · Moliyaviy va ROI Prognoz Modeli</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-2xl p-3.5">
                      <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] uppercase font-mono">
                        Kunlik Piyoda Oqimi
                      </span>
                      <div className="text-lg font-bold font-mono text-[#111111] dark:text-white mt-1">
                        ~{fin.daily_foot_traffic.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#7A807C]">
                        ~{fin.estimated_customers_daily} xarid/kun
                      </span>
                    </div>

                    <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-2xl p-3.5">
                      <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] uppercase font-mono">
                        Oylik Aylanma (Gross)
                      </span>
                      <div className="text-lg font-bold font-mono text-[#0E9F6E] mt-1">
                        ${Math.round(fin.monthly_revenue_min_usd / 1000)}k – $
                        {Math.round(fin.monthly_revenue_max_usd / 1000)}k
                      </div>
                      <span className="text-[10px] text-[#7A807C]">
                        O‘rtacha chek: ${fin.avg_check_usd}
                      </span>
                    </div>

                    <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-2xl p-3.5">
                      <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] uppercase font-mono">
                        Bozor Ijara Stavkasi
                      </span>
                      <div className="text-lg font-bold font-mono text-[#111111] dark:text-white mt-1">
                        ~${fin.estimated_rent_sqm_usd} / m²
                      </div>
                      <span className="text-[10px] text-[#7A807C]">
                        Oylik ~${fin.estimated_monthly_rent_usd.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-2xl p-3.5">
                      <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] uppercase font-mono">
                        O‘zini Oqlash (Payback)
                      </span>
                      <div className="text-lg font-bold font-mono text-[#0E9F6E] mt-1">
                        ~{fin.payback_months} oy
                      </div>
                      <span className="text-[10px] text-[#7A807C]">
                        Yillik ROI: ~{fin.roi_annual_percent}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Spatial Factor Matrix */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] uppercase tracking-wider">
                  03 · Fazoviy Baholash Matritsasi
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white dark:bg-[#18181B] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-[#7A807C] uppercase font-mono">Tranzit (T)</span>
                    <div className="text-xl font-bold font-mono text-[#0E9F6E] mt-1">
                      {auditReport.factors.transit_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-[#7A807C]">Metro va yo‘laklar</span>
                  </div>
                  <div className="bg-white dark:bg-[#18181B] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-[#7A807C] uppercase font-mono">Magnitlar (A)</span>
                    <div className="text-xl font-bold font-mono text-indigo-500 mt-1">
                      {auditReport.factors.anchor_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-[#7A807C]">Mall va oliygohlar</span>
                  </div>
                  <div className="bg-white dark:bg-[#18181B] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-[#7A807C] uppercase font-mono">Raqobat (C)</span>
                    <div className="text-xl font-bold font-mono text-amber-500 mt-1">
                      {auditReport.factors.competition_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-[#7A807C]">Toifadosh bosimi</span>
                  </div>
                  <div className="bg-white dark:bg-[#18181B] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3.5 text-center">
                    <span className="text-[10px] text-[#7A807C] uppercase font-mono">Rezidentlar (R)</span>
                    <div className="text-xl font-bold font-mono text-[#111111] dark:text-white mt-1">
                      {auditReport.factors.residential_density_score.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-[#7A807C]">Turar-joy zichligi</span>
                  </div>
                </div>
              </div>

              {/* 4. SWOT Analysis */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] uppercase tracking-wider">
                  04 · SWOT Strategik Tahlil
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0E9F6E]/[0.07] border border-[#0E9F6E]/25 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0E9F6E]" /> Kuchli Tomonlar (Strengths)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#27272A] dark:text-[#D1D5DB] text-[11px]">
                      {auditReport.swot_analysis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-500/[0.07] border border-amber-500/25 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Zaif Tomonlar (Weaknesses)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#27272A] dark:text-[#D1D5DB] text-[11px]">
                      {auditReport.swot_analysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-indigo-500/[0.07] border border-indigo-500/25 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" /> Imkoniyatlar (Opportunities)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#27272A] dark:text-[#D1D5DB] text-[11px]">
                      {auditReport.swot_analysis.opportunities.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-500/[0.07] border border-rose-500/25 rounded-2xl p-4 space-y-2">
                    <span className="font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" /> Xatarlar (Threats)
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#27272A] dark:text-[#D1D5DB] text-[11px]">
                      {auditReport.swot_analysis.threats.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. Final Recommendation */}
              <div className="bg-[#0E9F6E]/10 border border-[#0E9F6E]/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[#0E9F6E] font-mono font-bold uppercase text-[10px]">
                    05 · Yakuniy Investitsion Qaror:
                  </span>
                  <p className="text-[#111111] dark:text-[#FDFDFD] font-semibold mt-0.5">
                    {auditReport.recommendation}
                  </p>
                </div>
                <div className="text-right text-[10px] text-[#7A807C] font-mono hidden sm:block shrink-0">
                  MakonSense Spatial Engine
                  <br />
                  v2.4 Enterprise Audit
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
