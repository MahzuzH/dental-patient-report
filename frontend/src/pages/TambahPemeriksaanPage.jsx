import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  Save,
  Trash2,
  User,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

/* ─── helpers ─── */
const authFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(opts.headers || {}),
    },
  });

function getTokenPayload() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const UPPER_TEETH = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const LOWER_TEETH = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];
const SURFACES = ["occlusal", "buccal", "lingual", "mesial", "distal", "whole"];

const EMPTY_TOOTH_FORM = { condition_id: "", tooth_surface: "", notes: "" };

/* ─── component ─── */
export default function TambahPemeriksaanPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // present only in edit mode
  const isEdit = Boolean(id);

  /* form state */
  const [form, setForm] = useState({
    patient_id: "",
    checkup_date: new Date().toISOString().split("T")[0],
    general_notes: "",
    status: "completed",
  });

  /* odontogram: { [toothNumber]: { condition_id, condition_name, color, tooth_surface, notes } } */
  const [entries, setEntries] = useState({});

  /* supporting data */
  const [patients, setPatients] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dentistId, setDentistId] = useState("");

  /* UI state */
  const [patientSearch, setPatientSearch] = useState("");
  const [patientDropdown, setPatientDropdown] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothDialogOpen, setToothDialogOpen] = useState(false);
  const [toothForm, setToothForm] = useState(EMPTY_TOOTH_FORM);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ─── init ─── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const payload = getTokenPayload();
    if (payload?.user_id) setDentistId(payload.user_id);

    // fetch conditions
    fetch("/api/diseases")
      .then((r) => r.json())
      .then((d) => setConditions(Array.isArray(d.data) ? d.data : []))
      .catch(() => {});

    // fetch patients
    authFetch("/api/patients")
      .then((r) => r.json())
      .then((d) => setPatients(Array.isArray(d) ? d : []))
      .catch(() => {});

    // if edit mode, load existing checkup
    if (isEdit) {
      setLoading(true);
      authFetch(`/api/checkups/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.id) {
            navigate("/pemeriksaan");
            return;
          }
          setForm({
            patient_id: d.patient_id || "",
            checkup_date: d.checkup_date || "",
            general_notes: d.general_notes || "",
            status: (d.status || "completed").toLowerCase(),
          });
          setSelectedPatient({
            id: d.patient_id,
            full_name: d.patient_name,
            institution_name: d.institution,
          });
          setPatientSearch(d.patient_name || "");

          const map = {};
          (d.entries || []).forEach((e) => {
            map[e.tooth_number] = {
              condition_id: e.condition_id,
              condition_name: e.condition_name,
              color: e.color_code || "#8b5cf6",
              tooth_surface: e.tooth_surface || "",
              notes: e.notes || "",
            };
          });
          setEntries(map);
        })
        .catch(() => navigate("/pemeriksaan"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  /* ─── patient search filter ─── */
  const filteredPatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    const list = patients.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(q) ||
        p.student_id?.toLowerCase().includes(q) ||
        p.institution_name?.toLowerCase().includes(q),
    );
    return list.slice(0, 25);
  }, [patients, patientSearch]);

  const selectPatient = (p) => {
    setSelectedPatient(p);
    setForm((f) => ({ ...f, patient_id: p.id }));
    setPatientSearch(p.full_name);
    setPatientDropdown(false);
  };

  /* ─── odontogram helpers ─── */
  const openToothDialog = (tooth) => {
    setSelectedTooth(tooth);
    const existing = entries[tooth];
    setToothForm(
      existing
        ? {
            condition_id: existing.condition_id,
            tooth_surface: existing.tooth_surface || "",
            notes: existing.notes || "",
          }
        : EMPTY_TOOTH_FORM,
    );
    setToothDialogOpen(true);
  };

  const saveToothEntry = () => {
    if (!toothForm.condition_id) {
      // no condition chosen → remove
      removeToothEntry(selectedTooth);
      setToothDialogOpen(false);
      return;
    }
    const cond = conditions.find((c) => c.id === toothForm.condition_id);
    setEntries((prev) => ({
      ...prev,
      [selectedTooth]: {
        condition_id: toothForm.condition_id,
        condition_name: cond?.name || "",
        color: cond?.color_code || "#8b5cf6",
        tooth_surface: toothForm.tooth_surface,
        notes: toothForm.notes,
      },
    }));
    setToothDialogOpen(false);
  };

  const removeToothEntry = (tooth) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[tooth];
      return next;
    });
  };

  /* ─── tooth button renderer ─── */
  const ToothBtn = ({ tooth }) => {
    const entry = entries[tooth];
    return (
      <button
        type="button"
        onClick={() => openToothDialog(tooth)}
        title={
          entry ? `Gigi ${tooth}: ${entry.condition_name}` : `Gigi ${tooth}`
        }
        className={`relative flex h-10 w-9 flex-col items-center justify-center rounded-lg text-[10px] font-bold border-2 transition-all hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 ${
          entry
            ? "text-white shadow-md scale-105"
            : "bg-slate-50 text-slate-400 border-slate-200 hover:border-violet-300 hover:text-violet-500"
        }`}
        style={
          entry
            ? { backgroundColor: entry.color, borderColor: entry.color }
            : {}
        }
      >
        {tooth}
        {entry && (
          <span className="block h-1 w-4 rounded-full bg-white/60 mt-0.5" />
        )}
      </button>
    );
  };

  /* ─── submit ─── */
  const handleSubmit = async () => {
    setError("");
    if (!form.patient_id) {
      setError("Pasien wajib dipilih.");
      return;
    }
    if (!form.checkup_date) {
      setError("Tanggal pemeriksaan wajib diisi.");
      return;
    }
    if (!dentistId) {
      setError(
        "Tidak dapat membaca data dokter dari sesi login. Silakan login ulang.",
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patient_id: form.patient_id,
        dentist_id: dentistId,
        checkup_date: form.checkup_date,
        general_notes: form.general_notes.trim() || "",
        status: form.status,
        entries: Object.entries(entries).map(([tooth, e]) => ({
          tooth_number: parseInt(tooth, 10),
          tooth_surface: e.tooth_surface || "",
          condition_id: e.condition_id,
          notes: e.notes || "",
        })),
        ...(isEdit ? { replace_entries: true } : {}),
      };

      const url = isEdit ? `/api/checkups/${id}` : "/api/checkups";
      const method = isEdit ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan pemeriksaan");

      navigate("/pemeriksaan");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── loading state ─── */
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Memuat data pemeriksaan...</p>
        </div>
      </div>
    );
  }

  /* ─── render ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-slate-900">
      <Sidebar active="pemeriksaan" />

      <div className="lg:pl-64">
        <main className="min-h-screen p-3 sm:p-4 space-y-4 pb-10">
          {/* ── Header ── */}
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-violet-50"
                onClick={() => navigate("/pemeriksaan")}
              >
                <ChevronLeft size={20} />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEdit ? "Edit Pemeriksaan" : "Tambah Pemeriksaan"}
                </h2>
                <p className="text-sm text-slate-500">
                  {isEdit
                    ? "Ubah data pemeriksaan dan odontogram."
                    : "Buat catatan pemeriksaan gigi baru."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/pemeriksaan")}
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                className="gap-2 bg-violet-600 hover:bg-violet-700"
                onClick={handleSubmit}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
              </Button>
            </div>
          </header>

          {/* Error banner */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ── Content Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-1 space-y-4">
              {/* Patient Select */}
              <Card className="border-violet-100 bg-white shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                      <User size={16} className="text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Pilih Pasien
                    </h3>
                  </div>

                  {/* Patient search input */}
                  <div className="relative">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-violet-400 focus-within:bg-white transition-colors">
                      <Search size={14} className="text-slate-400 shrink-0" />
                      <input
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Cari nama atau NIS pasien..."
                        value={patientSearch}
                        onChange={(e) => {
                          setPatientSearch(e.target.value);
                          setPatientDropdown(true);
                          if (!e.target.value) {
                            setSelectedPatient(null);
                            setForm((f) => ({ ...f, patient_id: "" }));
                          }
                        }}
                        onFocus={() => setPatientDropdown(true)}
                      />
                    </div>

                    {/* Dropdown */}
                    {patientDropdown && filteredPatients.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                        <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                          {filteredPatients.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className={`w-full px-3 py-2.5 text-left text-sm hover:bg-violet-50 transition-colors ${
                                form.patient_id === p.id
                                  ? "bg-violet-50 border-l-2 border-violet-500"
                                  : ""
                              }`}
                              onClick={() => selectPatient(p)}
                            >
                              <p className="font-medium text-slate-900">
                                {p.full_name}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {p.student_id || "—"} ·{" "}
                                {p.institution_name || "—"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected patient card */}
                  {selectedPatient && (
                    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
                        Pasien Terpilih
                      </p>
                      <p className="font-semibold text-slate-900">
                        {selectedPatient.full_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedPatient.institution_name || "—"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Checkup Details */}
              <Card className="border-violet-100 bg-white shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                      <CalendarDays size={16} className="text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Detail Pemeriksaan
                    </h3>
                  </div>

                  <div>
                    <Label className="text-slate-600">
                      Tanggal Pemeriksaan{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="mt-1"
                      value={form.checkup_date}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          checkup_date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-slate-600">Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, status: v }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            Pending
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-600">Catatan Umum</Label>
                    <Textarea
                      className="mt-1 resize-none text-sm"
                      rows={3}
                      placeholder="Kondisi umum pasien, temuan awal, dll..."
                      value={form.general_notes}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          general_notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis Summary */}
              <Card className="border-violet-100 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                        <ClipboardList size={16} className="text-violet-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900">
                        Diagnosis
                      </h3>
                    </div>
                    <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                      {Object.keys(entries).length} gigi
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1.5">
                    {Object.keys(entries).length === 0 ? (
                      <p className="text-sm text-slate-400 italic py-3 text-center">
                        Belum ada diagnosis.
                        <br />
                        Klik gigi pada odontogram untuk menambahkan.
                      </p>
                    ) : (
                      Object.entries(entries)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([tooth, e]) => (
                          <div
                            key={tooth}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 group hover:bg-violet-50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="h-3.5 w-3.5 rounded-full shrink-0"
                                style={{ backgroundColor: e.color }}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                  Gigi {tooth}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate">
                                  {e.condition_name}
                                  {e.tooth_surface
                                    ? ` · ${e.tooth_surface}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                className="p-1 rounded-lg hover:bg-violet-100 text-violet-500"
                                onClick={() =>
                                  openToothDialog(parseInt(tooth, 10))
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="p-1 rounded-lg hover:bg-red-100 text-red-400"
                                onClick={() =>
                                  removeToothEntry(parseInt(tooth, 10))
                                }
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── RIGHT COLUMN: Odontogram ── */}
            <div className="lg:col-span-2">
              <Card className="border-violet-100 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Odontogram
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Klik pada nomor gigi untuk menambah atau mengubah
                        diagnosis
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={12} />
                      {Object.keys(entries).length} dipilih
                    </span>
                  </div>

                  {/* ── Upper Jaw ── */}
                  <div className="mb-1">
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Rahang Atas
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {UPPER_TEETH.map((t) => (
                        <ToothBtn key={t} tooth={t} />
                      ))}
                    </div>
                  </div>

                  {/* Jaw divider */}
                  <div className="my-5 flex items-center gap-3">
                    <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                    <div className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-100">
                      Garis Oklusal
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                  </div>

                  {/* ── Lower Jaw ── */}
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {LOWER_TEETH.map((t) => (
                        <ToothBtn key={t} tooth={t} />
                      ))}
                    </div>
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3">
                      Rahang Bawah
                    </p>
                  </div>

                  {/* ── Condition Legend ── */}
                  {conditions.length > 0 && (
                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Legenda Kondisi
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {conditions.map((c) => (
                          <span
                            key={c.id}
                            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                            style={{
                              backgroundColor: c.color_code || "#8b5cf6",
                            }}
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* ── Tooth Entry Dialog ── */}
      <Dialog open={toothDialogOpen} onOpenChange={setToothDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
                style={{
                  backgroundColor: entries[selectedTooth]?.color || "#8b5cf6",
                }}
              >
                {selectedTooth}
              </span>
              Gigi {selectedTooth}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            {/* Kondisi */}
            <div>
              <Label>Kondisi Gigi</Label>
              <Select
                value={toothForm.condition_id}
                onValueChange={(v) =>
                  setToothForm((f) => ({ ...f, condition_id: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih kondisi..." />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.color_code || "#ccc" }}
                        />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permukaan */}
            <div>
              <Label>Permukaan Gigi</Label>
              <Select
                value={toothForm.tooth_surface}
                onValueChange={(v) =>
                  setToothForm((f) => ({ ...f, tooth_surface: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih permukaan (opsional)..." />
                </SelectTrigger>
                <SelectContent>
                  {SURFACES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Catatan */}
            <div>
              <Label>Catatan</Label>
              <Input
                className="mt-1"
                value={toothForm.notes}
                onChange={(e) =>
                  setToothForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Catatan tambahan (opsional)"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              {entries[selectedTooth] && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    removeToothEntry(selectedTooth);
                    setToothDialogOpen(false);
                  }}
                >
                  <Trash2 size={13} /> Hapus
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setToothDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                onClick={saveToothEntry}
                disabled={!toothForm.condition_id}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
