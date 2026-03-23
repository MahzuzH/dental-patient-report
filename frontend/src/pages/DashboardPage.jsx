import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, User, Plus, QrCode } from "lucide-react";

export default function Dashboard() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/scans", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Gagal ambil data");

                const data = await res.json();
                if (!Array.isArray(data)) throw new Error("Format data salah");

                setExams(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const today = new Date().toISOString().split("T")[0];

    const stats = {
        today: exams.filter((e) => e.scan_date?.startsWith(today)).length,
        school: exams.filter(
            (e) => (e.patient?.institution || e.institution) === "Asta Hanas",
        ).length,
        pending: exams.filter((e) => e.status === "Pending").length,
        done: exams.filter((e) => e.status === "Completed").length,
    };

    const getPatientName = (exam) =>
        exam.patient?.name || exam.patient_name || exam.name || "-";
    const getInstitution = (exam) =>
        exam.patient?.institution || exam.institution || "-";

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-6">
                <h1 className="text-xl font-bold">Sefya Dental</h1>
                <nav className="flex flex-col gap-2 text-sm">
                    <Button variant="ghost">Dashboard</Button>
                    <Button variant="ghost">Pemeriksaan</Button>
                    <Button variant="ghost">Report</Button>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
                {/* Topbar */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-xl border border-gray-800">
                        <Search size={18} />
                        <Input
                            placeholder="Cari pasien..."
                            className="border-none bg-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell />
                        <User />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">
                                Pemeriksaan Hari Ini
                            </p>
                            <h2 className="text-2xl font-bold">
                                {stats.today}
                            </h2>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">
                                Pasien Asta Hanas
                            </p>
                            <h2 className="text-2xl font-bold">
                                {stats.school}
                            </h2>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">
                                Perlu Perawatan
                            </p>
                            <h2 className="text-2xl font-bold">
                                {stats.pending}
                            </h2>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">Selesai</p>
                            <h2 className="text-2xl font-bold">{stats.done}</h2>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button className="gap-2">
                        <Plus size={16} /> Pemeriksaan Baru
                    </Button>
                </div>

                {/* Table */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">
                            Pemeriksaan Terbaru
                        </h2>

                        {loading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : (
                            <table className="w-full text-sm text-center">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-800">
                                        <th className="py-2 text-center">
                                            Nama
                                        </th>
                                        <th className="text-center">
                                            Instansi
                                        </th>
                                        <th className="text-center">Tanggal</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((e, i) => (
                                        <tr
                                            key={i}
                                            className="border-t border-gray-800"
                                        >
                                            <td className="py-2 text-center">
                                                {getPatientName(e)}
                                            </td>
                                            <td className="text-center">
                                                {getInstitution(e)}
                                            </td>
                                            <td>
                                                {e.scan_date?.split("T")[0]}
                                            </td>
                                            <td className="text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${
                                                        e.status === "Completed"
                                                            ? "bg-green-500/10 text-green-400"
                                                            : "bg-yellow-500/10 text-yellow-400"
                                                    }`}
                                                >
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="flex gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="gap-1"
                                                >
                                                    <QrCode size={14} /> QR
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
