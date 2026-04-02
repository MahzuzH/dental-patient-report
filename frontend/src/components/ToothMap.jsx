import React, { memo, useMemo } from "react";

const Tooth = memo(function Tooth({ number, diagData }) {
    const bg = diagData?.color;
    const textColor = diagData ? "#ffffff" : "#a0a0a0";
    return (
        <div
            title={
                diagData
                    ? `${diagData.disease} • ${diagData.treatment_recommendation || ""}`
                    : `Gigi ${number}`
            }
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold border transition-all duration-200 ${
                diagData
                    ? "shadow-md hover:scale-110 cursor-pointer"
                    : "hover:border-[#ff91a4]/30 hover:bg-[#ff91a4]/5"
            }`}
            style={{
                backgroundColor: bg || "#353535",
                borderColor: bg ? bg : "#4e4e4e",
                color: textColor,
            }}
        >
            {number}
        </div>
    );
});

export default memo(function ToothMap({ diagnosis = [] }) {
    const upper = [
        18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    ];
    const lower = [
        48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
    ];

    const diagMap = useMemo(() => {
        const map = {};
        (diagnosis || []).forEach((d) => {
            if (d && d.tooth != null) map[d.tooth] = d;
        });
        return map;
    }, [diagnosis]);

    return (
        <div className="w-full max-w-full">
            <div className="text-center text-xs font-semibold text-[#808080] tracking-wider">
                RAHANG ATAS
            </div>

            <div className="flex justify-center gap-3 mt-3 mb-6 flex-wrap">
                {upper.map((t) => (
                    <Tooth key={t} number={t} diagData={diagMap[t]} />
                ))}
            </div>

            <div className="flex items-center justify-center mb-6 px-4">
                <div className="flex-1 border-t border-dashed border-[#4e4e4e]/60" />
                <div className="px-4 mx-4 bg-[#ff91a4]/10 text-[#ff91a4] border border-[#ff91a4]/20 rounded-full text-xs font-medium py-0.5">
                    GARIS OKLUSAL
                </div>
                <div className="flex-1 border-t border-dashed border-[#4e4e4e]/60" />
            </div>

            <div className="flex justify-center gap-3 mt-3 mb-6 flex-wrap">
                {lower.map((t) => (
                    <Tooth key={t} number={t} diagData={diagMap[t]} />
                ))}
            </div>

            <div className="text-center text-xs font-semibold text-[#808080] tracking-wider">
                RAHANG BAWAH
            </div>
        </div>
    );
});
