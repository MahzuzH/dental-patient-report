const teeth = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 38, 37, 36,
    35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48,
];

export default function ToothMap({
    diagnosis,
    selectedTooth,
    setSelectedTooth,
}) {
    return (
        <div style={styles.map}>
            {teeth.map((t) => (
                <div
                    key={t}
                    onClick={() => setSelectedTooth(t)}
                    style={{
                        ...styles.tooth,
                        background: diagnosis[t]?.color_code || "#e5e7eb",
                        border:
                            selectedTooth === t ? "2px solid black" : "none",
                    }}
                >
                    {t}
                </div>
            ))}
        </div>
    );
}

const styles = {
    map: {
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: "10px",
    },
    tooth: {
        padding: "10px",
        textAlign: "center",
        borderRadius: "6px",
        cursor: "pointer",
    },
};
