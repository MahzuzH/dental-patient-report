import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const HIGH_SEVERITY_KEYWORDS = [
    "karies",
    "sisa akar",
    "impaksi",
    "supernumerary",
    "gigi hilang",
];

const MEDIUM_SEVERITY_KEYWORDS = [
    "karang gigi",
    "maloklusi",
    "restorasi indirect",
    "restorasi gigi",
];

function getSeverityFromDiagnosisItem(item) {
    const disease = String(item?.disease || "").toLowerCase();

    if (HIGH_SEVERITY_KEYWORDS.some((k) => disease.includes(k))) return "high";
    if (MEDIUM_SEVERITY_KEYWORDS.some((k) => disease.includes(k)))
        return "medium";
    return "low";
}

function getConditionCards(diagnosis = []) {
    if (!diagnosis.length) {
        return {
            dentalCondition: {
                label: "Sehat",
                badge: "Sangat Baik",
                cardClass:
                    "rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 ring-1 ring-emerald-500",
                iconWrapClass:
                    "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm",
            },
            oralHygiene: {
                label: "Bagus",
                badge: "Terjaga",
                cardClass:
                    "rounded-3xl bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200/50",
                iconWrapClass:
                    "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm",
            },
        };
    }

    const severities = diagnosis.map(getSeverityFromDiagnosisItem);
    const hasHigh = severities.includes("high");
    const hasMedium = severities.includes("medium");

    let dentalCondition;
    let oralHygiene;

    if (hasHigh) {
        dentalCondition = {
            label: "Perlu Perawatan",
            badge: "Prioritas Tinggi",
            cardClass:
                "rounded-3xl bg-rose-600 text-white shadow-xl shadow-rose-200 ring-1 ring-rose-500",
            iconWrapClass:
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm",
        };
        oralHygiene = {
            label: "Kurang",
            badge: "Perlu Ditingkatkan",
            cardClass:
                "rounded-3xl bg-amber-100 text-amber-900 shadow-sm ring-1 ring-amber-200",
            iconWrapClass:
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm",
        };
    } else if (hasMedium) {
        dentalCondition = {
            label: "Cukup",
            badge: "Perlu Perhatian",
            cardClass:
                "rounded-3xl bg-violet-600 text-white shadow-xl shadow-violet-200 ring-1 ring-violet-500",
            iconWrapClass:
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm",
        };
        oralHygiene = {
            label: "Cukup",
            badge: "Kontrol Rutin",
            cardClass:
                "rounded-3xl bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200/50",
            iconWrapClass:
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm",
        };
    } else {
        dentalCondition = {
            label: "Baik",
            badge: "Stabil",
            cardClass:
                "rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 ring-1 ring-emerald-500",
            iconWrapClass:
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm",
        };
        oralHygiene = {
            label: "Bagus",
            badge: "Terjaga",
            cardClass:
                "rounded-3xl bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200/50",
            iconWrapClass:
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm",
        };
    }

    return { dentalCondition, oralHygiene };
}

export function usePublicReportPageLogic() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/report/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Report not found");
                return res.json();
            })
            .then((data) => {
                setReport(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const cards = useMemo(
        () => getConditionCards(report?.diagnosis || []),
        [report?.diagnosis],
    );

    const groupedRecommendations = useMemo(() => {
        const diag = report?.diagnosis || [];
        const map = {};
        diag.forEach((d) => {
            const key = String(d?.disease || "").trim();
            if (!key) return;
            if (!map[key]) {
                map[key] = {
                    disease: key,
                    color: d.color || "#000",
                    treatment_recommendation:
                        d.treatment_recommendation ||
                        d.treatmentRecommendation ||
                        "",
                    teeth: [],
                    symptoms: d.symptoms || "",
                };
            }
            if (d.tooth != null) map[key].teeth.push(d.tooth);
        });

        return Object.values(map).map((g) => ({
            ...g,
            teeth: Array.from(new Set(g.teeth)).sort((a, b) => a - b),
        }));
    }, [report?.diagnosis]);

    return {
        id,
        report,
        loading,
        error,
        cards,
        groupedRecommendations,
    };
}
