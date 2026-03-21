export default function DiagnosisList({ diagnosis }) {
    return (
        <div style={styles.box}>
            <h3>Diagnosis Result</h3>

            {Object.keys(diagnosis).map((t) => (
                <div key={t}>
                    Gigi {t} → {diagnosis[t].name}
                </div>
            ))}
        </div>
    );
}

const styles = {
    box: {
        marginTop: "20px",
        background: "#f3f4f6",
        padding: "10px",
        borderRadius: "6px",
    },
};
