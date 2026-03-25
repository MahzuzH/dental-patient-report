import { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    fetchPatients();
  }, [navigate]);

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

  return {
    navigate,
    patients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    viewPatient,
    setViewPatient,
    filtered,
  };
}
