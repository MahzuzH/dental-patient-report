import {
  Info,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Search,
} from "lucide-react";
import { usePublicReportPageLogic } from "@/hooks/usePublicReportPageLogic";

export default function PublicReportPage() {
  const { id, report, loading, error, cards } = usePublicReportPageLogic();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent shadow-xl shadow-violet-100"></div>
          <p className="font-medium text-slate-600 animate-pulse">
            Menyiapkan laporan kesehatan gigi...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          Oops! Terjadi kesalahan
        </h2>
        <p className="mt-2 text-slate-500 max-w-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-violet-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-violet-200 transition-transform active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-12 text-slate-900 selection:bg-violet-100 font-sans">
      <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-violet-600"></div>
          <span className="text-sm font-bold tracking-tight text-slate-900 uppercase">
            Oral Health Report
          </span>
        </div>
        <div className="text-xs font-medium text-slate-500">
          ID: #{id?.padStart(5, "0")}
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-6 pt-8">
        <section className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Laporan Kesehatan Gigi
          </h1>
          <p className="mt-2 text-slate-500">
            Bentuk ringkasan hasil pemeriksaan medis digital.
          </p>
        </section>

        <div className="mb-8 overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Ringkasan Profil
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                report.status === "Completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {report.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <User size={10} /> Nama Lengkap
              </p>
              <p className="font-bold text-slate-800">{report.patient_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> Instansi
              </p>
              <p className="font-bold text-slate-800">
                {report.institution || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Calendar size={10} /> Usia / Kelamin
              </p>
              <p className="font-bold text-slate-800">
                {report.age} Tahun / {report.gender || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Info size={10} /> Tanggal Scan
              </p>
              <p className="font-bold text-slate-800">
                {new Date(report.scan_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic cards */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div
            className={`flex items-center gap-4 p-5 ${cards.dentalCondition.cardClass}`}
          >
            <div className={cards.dentalCondition.iconWrapClass}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-80">
                Dental Condition
              </p>
              <p className="text-lg font-extrabold">
                {cards.dentalCondition.label}
              </p>
              <p className="text-[10px] opacity-85 mt-0.5">
                {cards.dentalCondition.badge}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 p-5 ${cards.oralHygiene.cardClass}`}
          >
            <div className={cards.oralHygiene.iconWrapClass}>
              <AlertCircle size={24} className="text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Oral Hygiene
              </p>
              <p className="text-lg font-extrabold">
                {cards.oralHygiene.label}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {cards.oralHygiene.badge}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Peta Kesehatan Gigi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Status diagnosis per elemen gigi
              </p>
            </div>
            <Search size={20} className="text-slate-300" />
          </div>

          <div className="relative mx-auto flex max-w-sm justify-center gap-1.5 pb-20">
            <div className="flex flex-col gap-12 w-full">
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27,
                  28,
                ].map((t) => {
                  const d = report.diagnosis?.find((diag) => diag.tooth === t);
                  return (
                    <div key={t} className="relative group transition-all">
                      <div
                        className={`flex h-10 w-8 items-center justify-center rounded-lg text-[10px] font-bold transition-all shadow-sm ring-1 ring-inset ${
                          d
                            ? "scale-110 shadow-lg"
                            : "bg-slate-50 text-slate-300 ring-slate-100"
                        }`}
                        style={{
                          backgroundColor: d?.color,
                          color: d ? "white" : undefined,
                          borderColor: d?.color,
                        }}
                      >
                        {t}
                      </div>
                      {d && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-4 w-px bg-violet-200"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mx-auto h-40 w-40 rounded-full bg-violet-50/50 flex flex-col items-center justify-center border border-dashed border-violet-200 relative overflow-hidden">
                <div className="absolute inset-4 rounded-full border border-violet-100 bg-white shadow-inner flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Total Issue
                  </p>
                  <p className="text-2xl font-black text-violet-600">
                    {report.diagnosis?.length || 0}
                  </p>
                </div>
                <div className="h-full w-full rotate-45 border-4 border-violet-100 rounded-full animate-pulse opacity-50"></div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37,
                  38,
                ].map((t) => {
                  const d = report.diagnosis?.find((diag) => diag.tooth === t);
                  return (
                    <div key={t} className="relative group">
                      {d && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-4 w-px bg-violet-200"></div>
                      )}
                      <div
                        className={`flex h-10 w-8 items-center justify-center rounded-lg text-[10px] font-bold transition-all shadow-sm ring-1 ring-inset ${
                          d
                            ? "scale-110 shadow-lg"
                            : "bg-slate-50 text-slate-300 ring-slate-100"
                        }`}
                        style={{
                          backgroundColor: d?.color,
                          color: d ? "white" : undefined,
                          borderColor: d?.color,
                        }}
                      >
                        {t}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-50 pt-6">
            {report.diagnosis?.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 transition-colors hover:bg-violet-50"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                ></div>
                <span className="text-[10px] font-bold tracking-tight text-slate-400">
                  Gigi {d.tooth}
                </span>
                <span className="text-[11px] font-bold text-slate-700 truncate">
                  {d.disease}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 rounded-full bg-violet-600"></div>
            <h3 className="text-lg font-bold text-slate-900">
              Diagnosis Detail
            </h3>
          </div>

          <Card
            content={
              report.diagnosis?.length
                ? `Ditemukan ${report.diagnosis.length} temuan pada pemeriksaan ini. Silakan lihat rekomendasi perawatan berdasarkan diagnosis di bawah.`
                : "Tidak ada temuan diagnosis spesifik pada laporan ini."
            }
          />

          <div className="grid grid-cols-1 gap-4">
            {report.diagnosis?.length ? (
              report.diagnosis.map((d, i) => (
                <div
                  key={`${d.tooth}-${i}`}
                  className="rounded-3xl bg-violet-50 p-6 border border-violet-100"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">
                    Rekomendasi Gigi {d.tooth} • {d.disease}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {d.treatment_recommendation ||
                      "Belum ada rekomendasi perawatan."}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-violet-50 p-6 border border-violet-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">
                  Rekomendasi Utama
                </p>
                <p className="text-sm leading-relaxed text-slate-700">
                  Belum ada rekomendasi perawatan dari data diagnosis.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 underline decoration-violet-200 underline-offset-4 pointer-events-none">
            Sefya Dental Studio Reporting
          </p>
          <p className="text-[10px] text-slate-300">
            Laporan ini dibuat secara otomatis melalui sistem analisis digital.
            Hasil pemeriksaan ini bersifat sementara dan perlu divalidasi oleh
            dokter gigi ahli.
          </p>
        </div>
      </main>
    </div>
  );
}

function Card({ content }) {
  return (
    <div className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm leading-relaxed text-slate-600 italic">
        "{content}"
      </p>
    </div>
  );
}
