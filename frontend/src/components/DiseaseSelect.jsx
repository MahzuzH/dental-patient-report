export default function DiseaseSelect({
    diseases,
    selectedDisease,
    setSelectedDisease,
    onApply,
}) {
    return (
        <div>
            <h3>Assign Diagnosis</h3>

            <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
            >
                <option value="">Pilih Penyakit</option>
                {diseases.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>

            <button onClick={onApply}>Apply</button>
        </div>
    );
}
