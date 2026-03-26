import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const authFetch = (url, opts = {}) =>
    fetch(url, {
        ...opts,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...(opts.headers || {}),
        },
    });

export function usePatientPageLogic() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [viewPatient, setViewPatient] = useState(null);

    // pagination state (server-side capable)
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);

    const cacheRef = useRef(new Map());
    const controllerRef = useRef(null);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // debounce searchQuery -> debouncedQuery
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 350);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const fetchPatients = async (q, pageNum = 1, limitNum = 20) => {
        setLoading(true);
        try {
            const key = `${q || ""}|${pageNum}|${limitNum}`;
            if (cacheRef.current.has(key)) {
                const cached = cacheRef.current.get(key);
                if (cached && cached.items) {
                    setPatients(cached.items);
                    setTotal(cached.total || cached.items.length);
                } else {
                    setPatients(Array.isArray(cached) ? cached : []);
                    setTotal(Array.isArray(cached) ? cached.length : 0);
                }
                setLoading(false);
                return;
            }

            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();

            const url = `/api/patients?q=${encodeURIComponent(q || "")}&page=${pageNum}&limit=${limitNum}`;
            const res = await authFetch(url, {
                signal: controllerRef.current.signal,
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Gagal memuat data pasien");
            let items = [];
            let totalCount = 0;
            if (Array.isArray(data)) {
                items = data;
                totalCount = data.length;
            } else if (data && data.items) {
                items = data.items;
                totalCount = data.total || items.length;
            }
            cacheRef.current.set(key, { items, total: totalCount });
            setPatients(items);
            setTotal(totalCount);
        } catch (e) {
            if (e.name === "AbortError") return;
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // when debounced query changes, reset to first page
    useEffect(() => {
        setPage(1);
    }, [debouncedQuery]);

    // fetch whenever query/page/limit changes (and ensure auth)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/", { replace: true });
            return;
        }
        fetchPatients(debouncedQuery, page, limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, page, limit, navigate]);

    // compute visible patients
    // Backend returns paged `items`, so `patients` already contains current page.
    const visible = useMemo(() => patients, [patients]);

    return {
        navigate,
        patients,
        visiblePatients: visible,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        viewPatient,
        setViewPatient,
        page,
        setPage,
        limit,
        setLimit,
        total,
    };
}
