import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardPageLogic } from "@/hooks/useDashboardPageLogic";
import {
    Search,
    Bell,
    User,
    Plus,
    QrCode,
    LayoutDashboard,
    FileText,
    ClipboardList,
    Download,
    LogOut,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

export default function DashboardPage() {
    const {
        loading,
        error,
        searchQuery,
        setSearchQuery,
        stats,
        visitorsLast7Days,
        statusData,
        institutionData,
        recentExams,
        handleDownloadReport,
        handleLogout,
        formatDate,
    } = useDashboardPageLogic();

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-slate-900 transition-colors">
            <div className="h-full w-full">
                <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-violet-100 bg-white px-4 py-6 lg:flex">
                    <div className="mb-8 px-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-600">
                            Sefya Dental Studio
                        </p>
                        <h1 className="mt-2 text-xl font-bold">
                            Clinic Dashboard
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-2 text-sm">
                        <Button
                            variant="ghost"
                            className="justify-start gap-2 bg-violet-100 text-violet-700 hover:bg-violet-200"
                        >
                            <LayoutDashboard size={16} /> Dashboard
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2">
                            <ClipboardList size={16} /> Pemeriksaan
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2">
                            <FileText size={16} /> Report
                        </Button>
                    </nav>

                    <div className="mt-auto rounded-xl border border-violet-100 bg-violet-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Akun Aktif
                        </p>
                        <p className="mt-1 font-semibold">Administrator</p>
                        <p className="text-xs text-slate-500">
                            Dental Reporting Unit
                        </p>
                    </div>
                </aside>

                <main className="h-full space-y-3 overflow-hidden p-3 sm:p-4 lg:pl-[17rem]">
                    <header className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-violet-100 bg-white p-3 shadow-sm">
                        <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2">
                            <Search size={16} className="text-slate-500" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, instansi, status..."
                                className="h-auto w-[220px] border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={handleDownloadReport}
                            >
                                <Download size={15} /> Download Report
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Notifikasi"
                            >
                                <Bell size={16} />
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <User size={16} /> Admin
                            </Button>
                            <Button
                                variant="destructive"
                                className="gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} /> Logout
                            </Button>
                        </div>
                    </header>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Card className="border-violet-100 bg-white">
                            <CardContent className="p-3">
                                <p className="text-sm text-slate-500">
                                    Pemeriksaan Hari Ini
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">
                                    {stats.today}
                                </h2>
                            </CardContent>
                        </Card>
                        <Card className="border-violet-100 bg-white">
                            <CardContent className="p-3">
                                <p className="text-sm text-slate-500">
                                    Total Pemeriksaan
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">
                                    {stats.total}
                                </h2>
                            </CardContent>
                        </Card>
                        <Card className="border-violet-100 bg-white">
                            <CardContent className="p-3">
                                <p className="text-sm text-slate-500">
                                    Pending
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-amber-500">
                                    {stats.pending}
                                </h2>
                            </CardContent>
                        </Card>
                        <Card className="border-violet-100 bg-white">
                            <CardContent className="p-3">
                                <p className="text-sm text-slate-500">
                                    Completed
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-emerald-500">
                                    {stats.done}
                                </h2>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-3 xl:grid-cols-3">
                        <Card className="border-violet-100 bg-white xl:col-span-2">
                            <CardContent className="p-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-base font-semibold">
                                        Visualisasi Pengunjung (7 Hari)
                                    </h3>
                                    <span className="text-xs text-slate-500">
                                        Berdasarkan tanggal scan
                                    </span>
                                </div>
                                <div className="h-40">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={visitorsLast7Days}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                opacity={0.2}
                                            />
                                            <XAxis dataKey="day" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="total"
                                                stroke="#7c3aed"
                                                strokeWidth={3}
                                                dot={{ r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-violet-100 bg-white">
                            <CardContent className="p-3">
                                <h3 className="mb-2 text-base font-semibold">
                                    Status Pemeriksaan
                                </h3>
                                <div className="h-40">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={2}
                                            >
                                                {statusData.map((entry) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-1.5">
                                    {statusData.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                            <span className="font-semibold">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-3 xl:grid-cols-3">
                        <Card className="border-violet-100 bg-white xl:col-span-2">
                            <CardContent className="p-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-base font-semibold">
                                        Pemeriksaan Terbaru
                                    </h3>
                                    <Button className="gap-2" size="sm">
                                        <Plus size={14} /> Pemeriksaan Baru
                                    </Button>
                                </div>

                                {loading ? (
                                    <p className="text-sm text-slate-500">
                                        Loading data...
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[680px] text-xs sm:text-sm">
                                            <thead>
                                                <tr className="border-b border-violet-100 text-left text-slate-500">
                                                    <th className="py-2">
                                                        Nama
                                                    </th>
                                                    <th className="py-2">
                                                        Instansi
                                                    </th>
                                                    <th className="py-2">
                                                        Tanggal
                                                    </th>
                                                    <th className="py-2">
                                                        Status
                                                    </th>
                                                    <th className="py-2 text-center">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentExams.map((exam) => (
                                                    <tr
                                                        key={exam.id}
                                                        className="border-b border-violet-50"
                                                    >
                                                        <td className="py-2 font-medium">
                                                            {exam.patientName}
                                                        </td>
                                                        <td className="py-2">
                                                            {exam.institution}
                                                        </td>
                                                        <td className="py-2">
                                                            {formatDate(
                                                                exam.scanDate,
                                                            )}
                                                        </td>
                                                        <td className="py-2">
                                                            <span
                                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                                    exam.status ===
                                                                    "Completed"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-amber-100 text-amber-700"
                                                                }`}
                                                            >
                                                                {exam.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-2">
                                                            <div className="flex items-center justify-center gap-2">
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
                                                                    <QrCode
                                                                        size={
                                                                            14
                                                                        }
                                                                    />{" "}
                                                                    QR
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {!recentExams.length && (
                                            <p className="py-4 text-center text-sm text-slate-500">
                                                Data pemeriksaan tidak
                                                ditemukan.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-violet-100 bg-white">
                            <CardContent className="p-3">
                                <h3 className="mb-2 text-base font-semibold">
                                    Top Instansi
                                </h3>
                                <div className="h-40">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={institutionData}
                                            layout="vertical"
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                opacity={0.2}
                                            />
                                            <XAxis
                                                type="number"
                                                allowDecimals={false}
                                            />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={90}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="total"
                                                fill="#8b5cf6"
                                                radius={[0, 8, 8, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </main>
            </div>
        </div>
    );
}
