import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Plus, Pencil, Eye, Users, X } from "lucide-react";

const authFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(opts.headers || {}),
    },
  });

const EMPTY_FORM = {
  institution_id: "",
  full_name: "",
  student_id: "",
  date_of_birth: "",
  age: "",
  gender: "",
  address: "",
  phone: "",
};

function genderLabel(gender) {
  if (gender === "male") return "Laki-laki";
  if (gender === "female") return "Perempuan";
  return "-";
}

function genderBadge(gender) {
  if (gender === "female") return "bg-pink-100 text-pink-700";
  if (gender === "male") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-500";
}

export default function PatientPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalMode, setModalMode] = useState(null); // "create" | "edit" | "view"
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  /* ─── data fetchers ─── */
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/patients");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat data pasien");
      setPatients(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const res = await authFetch("/api/institutions");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setInstitutions(data);
    } catch (e) {
      console.error("Failed to load institutions:", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    fetchPatients();
    fetchInstitutions();
  }, [navigate]);

  /* ─── filtering ─── */
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(q) ||
        p.student_id?.toLowerCase().includes(q) ||
        p.institution_name?.toLowerCase().includes(q),
    );
  }, [patients, searchQuery]);

  /* ─── modal helpers ─── */
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setSelectedPatient(null);
    setModalMode("create");
  };

  const openEdit = (patient) => {
    setSelectedPatient(patient);
    setForm({
      institution_id: patient.institution_id || "",
      full_name: patient.full_name || "",
      student_id: patient.student_id || "",
      date_of_birth: patient.date_of_birth || "",
      age: patient.age != null ? String(patient.age) : "",
      gender: patient.gender || "",
      address: patient.address || "",
      phone: patient.phone || "",
    });
    setFormError("");
    setModalMode("edit");
  };

  const openView = (patient) => {
    setSelectedPatient(patient);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPatient(null);
    setFormError("");
  };

  /* ─── save ─── */
  const handleSave = async () => {
    setFormError("");
    if (!form.institution_id) {
      setFormError("Instansi wajib dipilih.");
      return;
    }
    if (!form.full_name.trim()) {
      setFormError("Nama lengkap wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        institution_id: form.institution_id,
        full_name: form.full_name.trim(),
        student_id: form.student_id.trim(),
        date_of_birth: form.date_of_birth || undefined,
        age: form.age ? parseInt(form.age, 10) : undefined,
        gender: form.gender || undefined,
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
      };

      const isCreate = modalMode === "create";
      const url = isCreate
        ? "/api/patients"
        : `/api/patients/${selectedPatient.id}`;
      const method = isCreate ? "POST" : "PUT";

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");

      await fetchPatients();
      closeModal();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  /* ─── render ─── */
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-slate-900">
      <Sidebar active="pasien" />

      <div className="h-full lg:pl-64">
        <main className="h-full overflow-auto p-3 sm:p-4 space-y-4">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Data Pasien</h2>
              <p className="text-sm text-slate-500">
                Kelola data pasien yang terdaftar di klinik.
              </p>
            </div>
            <Button
              className="gap-2 bg-violet-600 hover:bg-violet-700"
              onClick={openCreate}
            >
              <Plus size={16} /> Tambah Pasien
            </Button>
          </header>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Table card */}
          <Card
            className="border-violet-100 bg-white shadow-sm overflow-hidden flex flex-col"
            style={{ height: "calc(100vh - 164px)" }}
          >
            <CardContent className="p-0 flex flex-col h-full">
              {/* Search bar */}
              <div className="p-4 border-b border-violet-50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 w-full md:w-96">
                  <Search size={15} className="text-slate-400 shrink-0" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, NIS, instansi..."
                    className="h-auto border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X
                        size={13}
                        className="text-slate-400 hover:text-slate-600"
                      />
                    </button>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {filtered.length} pasien
                </span>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-violet-100 bg-slate-50/50 text-left text-slate-500">
                      <th className="px-6 py-3 font-semibold">Nama</th>
                      <th className="px-6 py-3 font-semibold">NIS</th>
                      <th className="px-6 py-3 font-semibold">Instansi</th>
                      <th className="px-6 py-3 font-semibold">Usia</th>
                      <th className="px-6 py-3 font-semibold">Kelamin</th>
                      <th className="px-6 py-3 font-semibold text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-violet-50">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-14 text-center text-slate-400"
                        >
                          Memuat data...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-14 text-center text-slate-400 italic"
                        >
                          <Users
                            size={36}
                            className="mx-auto mb-2 text-slate-200"
                          />
                          Tidak ada data pasien ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-violet-50/30 transition-colors"
                        >
                          <td className="px-6 py-3 font-medium text-slate-900">
                            {p.full_name}
                          </td>
                          <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                            {p.student_id || "-"}
                          </td>
                          <td className="px-6 py-3 text-slate-600">
                            {p.institution_name || "-"}
                          </td>
                          <td className="px-6 py-3 text-slate-600">
                            {p.age != null ? `${p.age} th` : "-"}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${genderBadge(p.gender)}`}
                            >
                              {genderLabel(p.gender)}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
                                title="Lihat detail"
                                onClick={() => openView(p)}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-violet-400 hover:text-violet-700 hover:bg-violet-50"
                                title="Edit pasien"
                                onClick={() => openEdit(p)}
                              >
                                <Pencil size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-violet-50 bg-slate-50/30 text-xs text-slate-500">
                Menampilkan {filtered.length} dari {patients.length} pasien
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* ── Create / Edit Modal ── */}
      <Dialog
        open={modalMode === "create" || modalMode === "edit"}
        onOpenChange={closeModal}
      >
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" ? "Tambah Pasien Baru" : "Edit Pasien"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* Instansi */}
            <div>
              <Label>
                Instansi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.institution_id}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, institution_id: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih instansi..." />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nama Lengkap */}
            <div>
              <Label>
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-1"
                value={form.full_name}
                onChange={setField("full_name")}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* NIS + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>NIS / Student ID</Label>
                <Input
                  className="mt-1"
                  value={form.student_id}
                  onChange={setField("student_id")}
                  placeholder="AH-2024-XXXX"
                />
              </div>
              <div>
                <Label>Jenis Kelamin</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tanggal Lahir + Usia */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tanggal Lahir</Label>
                <Input
                  className="mt-1"
                  type="date"
                  value={form.date_of_birth}
                  onChange={setField("date_of_birth")}
                />
              </div>
              <div>
                <Label>Usia (tahun)</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  max={120}
                  value={form.age}
                  onChange={setField("age")}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Telepon */}
            <div>
              <Label>No. Telepon</Label>
              <Input
                className="mt-1"
                value={form.phone}
                onChange={setField("phone")}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Alamat */}
            <div>
              <Label>Alamat</Label>
              <Textarea
                className="mt-1 resize-none"
                rows={2}
                value={form.address}
                onChange={setField("address")}
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeModal}
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Menyimpan..."
                  : modalMode === "create"
                    ? "Simpan Pasien"
                    : "Update Pasien"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Modal ── */}
      <Dialog open={modalMode === "view"} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Pasien</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="mt-2 space-y-0">
              {[
                { label: "Nama Lengkap", value: selectedPatient.full_name },
                {
                  label: "NIS / Student ID",
                  value: selectedPatient.student_id || "-",
                },
                {
                  label: "Instansi",
                  value: selectedPatient.institution_name || "-",
                },
                {
                  label: "Tanggal Lahir",
                  value: selectedPatient.date_of_birth
                    ? new Date(
                        selectedPatient.date_of_birth,
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-",
                },
                {
                  label: "Usia",
                  value:
                    selectedPatient.age != null
                      ? `${selectedPatient.age} tahun`
                      : "-",
                },
                {
                  label: "Jenis Kelamin",
                  value: genderLabel(selectedPatient.gender),
                },
                { label: "No. Telepon", value: selectedPatient.phone || "-" },
                { label: "Alamat", value: selectedPatient.address || "-" },
                {
                  label: "Terdaftar",
                  value: selectedPatient.created_at
                    ? new Date(selectedPatient.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "-",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-slate-50 py-2.5"
                >
                  <span className="text-sm text-slate-500 shrink-0 w-36">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-slate-800 text-right">
                    {value}
                  </span>
                </div>
              ))}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={closeModal}
                >
                  Tutup
                </Button>
                <Button
                  className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700"
                  onClick={() => {
                    closeModal();
                    openEdit(selectedPatient);
                  }}
                >
                  <Pencil size={14} /> Edit Pasien
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
