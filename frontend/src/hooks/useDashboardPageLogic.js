import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useDashboardPageLogic() {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    const cacheRef = useRef(new Map());
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const token = localStorage.getItem("token");
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
        localStorage.removeItem("dashboard-theme");
    }, []);

    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [navigate, token]);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        const controller = new AbortController();

        const key = `${page}|${limit}|${debouncedQuery || ""}`;
        const cached = cacheRef.current.get(key);

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (cached) {
                setExams(cached.items);
                setTotal(cached.total ?? cached.items.length);
                setLoading(false);
                return;
            }

            try {
                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("limit", String(limit));
                if (debouncedQuery) params.set("q", debouncedQuery);

                const url = `/api/scans?${params.toString()}`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error("Gagal ambil data pemeriksaan");
                }

                const data = await res.json();

                // Support two response shapes: { items: [], total: n } or []
                if (Array.isArray(data)) {
                    if (cancelled) return;
                    setExams(data);
                    setTotal(data.length);
                    cacheRef.current.set(key, {
                        items: data,
                        total: data.length,
                    });
                } else if (data && Array.isArray(data.items)) {
                    if (cancelled) return;
                    setExams(data.items);
                    setTotal(Number(data.total) || data.items.length);
                    cacheRef.current.set(key, {
                        items: data.items,
                        total: Number(data.total) || data.items.length,
                    });
                } else {
                    throw new Error("Format data dari server tidak valid");
                }
            } catch (err) {
                if (err.name === "AbortError") return;
                console.error(err);
                if (!cancelled) setError(err.message || "Terjadi kesalahan");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [token, page, limit, debouncedQuery]);

    // Debounce searchQuery to avoid expensive filtering/fetching on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 350);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const normalizedExams = useMemo(
        () =>
            exams.map((exam) => ({
                ...exam,
                patientName:
                    exam.patient?.name ||
                    exam.patient_name ||
                    exam.name ||
                    "Tanpa Nama",
                institution:
                    exam.patient?.institution || exam.institution || "-",
                status: exam.status || "Pending",
                scanDate: exam.scan_date,
            })),
        [exams],
    );

    const filteredExams = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return normalizedExams;

        return normalizedExams.filter((exam) => {
            const dateText = exam.scanDate
                ? new Date(exam.scanDate).toLocaleDateString("id-ID")
                : "";

            return (
                exam.patientName.toLowerCase().includes(query) ||
                exam.institution.toLowerCase().includes(query) ||
                exam.status.toLowerCase().includes(query) ||
                dateText.toLowerCase().includes(query)
            );
        });
    }, [normalizedExams, searchQuery]);

    const recentExams = useMemo(
        () => filteredExams.slice(0, 4),
        [filteredExams],
    );

    const allExams = useMemo(() => filteredExams, [filteredExams]);

    const stats = useMemo(
        () => ({
            today: normalizedExams.filter((e) => e.scanDate?.startsWith(today))
                .length,
            total: normalizedExams.length,
            pending: normalizedExams.filter((e) => e.status === "Pending")
                .length,
            done: normalizedExams.filter((e) => e.status === "Completed")
                .length,
        }),
        [normalizedExams, today],
    );

    const visitorsLast7Days = useMemo(() => {
        const dates = Array.from({ length: 7 }, (_, idx) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - idx));
            return date;
        });

        return dates.map((date) => {
            const key = date.toISOString().split("T")[0];
            const total = normalizedExams.filter((exam) =>
                exam.scanDate?.startsWith(key),
            ).length;

            return {
                day: date.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                }),
                total,
            };
        });
    }, [normalizedExams]);

    const statusData = useMemo(() => {
        const completed = normalizedExams.filter(
            (exam) => exam.status === "Completed",
        ).length;
        const pending = normalizedExams.filter(
            (exam) => exam.status === "Pending",
        ).length;
        const other = normalizedExams.length - completed - pending;

        return [
            { name: "Completed", value: completed, color: "#22c55e" },
            { name: "Pending", value: pending, color: "#f59e0b" },
            { name: "Lainnya", value: other, color: "#8b5cf6" },
        ].filter((item) => item.value > 0);
    }, [normalizedExams]);

    const institutionData = useMemo(() => {
        const grouped = normalizedExams.reduce((acc, exam) => {
            const key = exam.institution || "-";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [normalizedExams]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handleDownloadReport = () => {
        const header = ["No", "Nama", "Instansi", "Tanggal", "Status"];
        const rows = filteredExams.map((exam, index) => [
            index + 1,
            exam.patientName,
            exam.institution,
            exam.scanDate ? exam.scanDate.split("T")[0] : "-",
            exam.status,
        ]);

        const csv = [header, ...rows]
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(","),
            )
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `report-pemeriksaan-${today}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const formatDate = (value) => {
        if (!value) return "-";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return {
        loading,
        error,
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        limit,
        setLimit,
        total,
        stats,
        visitorsLast7Days,
        statusData,
        institutionData,
        recentExams,
        allExams,
        handleDownloadReport,
        handleLogout,
        formatDate,
    };
}
