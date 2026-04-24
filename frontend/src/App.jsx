import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

// Lazy load pages for route-based code splitting
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PublicReportPage = lazy(() => import("./pages/PublicReportPage"));
const PemeriksaanPage = lazy(() => import("./pages/PemeriksaanPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const PatientPage = lazy(() => import("./pages/PatientPage"));
const TambahPemeriksaanPage = lazy(() => import("./pages/TambahPemeriksaanPage"));
const TambahPasienPage = lazy(() => import("./pages/TambahPasienPage"));

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-pink-500"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Eagerly load the Home page */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pemeriksaan" element={<PemeriksaanPage />} />
          <Route path="/pemeriksaan/baru" element={<TambahPemeriksaanPage />} />
          <Route
            path="/pemeriksaan/:id/edit"
            element={<TambahPemeriksaanPage />}
          />
          <Route path="/pasien" element={<PatientPage />} />
          <Route path="/pasien/baru" element={<TambahPasienPage />} />
          <Route path="/pasien/:id/edit" element={<TambahPasienPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/:id" element={<PublicReportPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
