import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PublicReportPage() {
    const { id } = useParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetch(`/api/report/${id}`)
            .then((res) => res.json())
            .then((data) => setReport(data));
    }, [id]);

    if (!report) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Report Pasien</h1>

            <p>Nama: {report.patient_name}</p>

            <div className="mt-4">
                {report.diagnosis.map((d, i) => (
                    <div key={i}>
                        Gigi {d.tooth} → {d.disease}
                    </div>
                ))}
            </div>
        </div>
    );
}
