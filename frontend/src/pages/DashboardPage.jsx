export default function DashboardPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded shadow">Patients</div>
                <div className="bg-white p-4 rounded shadow">Scans</div>
                <div className="bg-white p-4 rounded shadow">Reports</div>
            </div>
        </div>
    );
}
