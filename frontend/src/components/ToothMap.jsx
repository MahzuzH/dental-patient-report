import React from "react";

export default function ToothMap({ diagnosis = [] }) {
    const upper = [
        18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    ];
    const lower = [
        48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
    ];

    const diagMap = {};
    (diagnosis || []).forEach((d) => {
        if (d && d.tooth != null) diagMap[d.tooth] = d;
    });

    const Tooth = ({ number }) => {
        const d = diagMap[number];
        const bg = d?.color;
        const textColor = d ? "#ffffff" : "#6b7280";
        return (
            <div
                title={
                    d
                        ? `${d.disease} • ${d.treatment_recommendation || ""}`
                        : `Gigi ${number}`
                }
                className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-semibold border"
                style={{
                    backgroundColor: bg || "#ffffff",
                    borderColor: bg ? bg : "#e6e7eb",
                    color: textColor,
                }}
            >
                {number}
            </div>
        );
    };

    return (
        <div className="w-full max-w-full">
            <div className="text-center text-xs font-semibold text-gray-400">
                RAHANG ATAS
            </div>

            <div className="flex justify-center gap-3 mt-3 mb-6 flex-wrap">
                {upper.map((t) => (
                    <Tooth key={t} number={t} />
                ))}
            </div>

            <div className="flex items-center justify-center mb-6 px-4">
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <div className="px-4 mx-4 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                    GARIS OKLUSAL
                </div>
                <div className="flex-1 border-t border-dashed border-gray-300" />
            </div>

            <div className="flex justify-center gap-3 mt-3 mb-6 flex-wrap">
                {lower.map((t) => (
                    <Tooth key={t} number={t} />
                ))}
            </div>

            <div className="text-center text-xs font-semibold text-gray-400">
                RAHANG BAWAH
            </div>
        </div>
    );
}
