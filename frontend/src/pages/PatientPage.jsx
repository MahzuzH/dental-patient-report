import { useEffect, useState } from "react";

export default function PatientPage() {
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({});

    const fetchPatients = async () => {
        const res = await fetch("/api/patients");
        const data = await res.json();
        setPatients(data);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleSubmit = async () => {
        await fetch("/api/patients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        fetchPatients();
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Patients</h1>

            <input
                placeholder="Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Age"
                onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <button onClick={handleSubmit}>Add</button>

            {patients.map((p) => (
                <div key={p.id}>{p.name}</div>
            ))}
        </div>
    );
}
