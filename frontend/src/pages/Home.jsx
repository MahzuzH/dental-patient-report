import React, { Suspense, lazy } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SEO from "../components/SEO";

const About = lazy(() => import("../components/About"));
const Doctors = lazy(() => import("../components/Doctors"));
const Gallery = lazy(() => import("../components/Gallery"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
    return (
        <div className="min-h-screen bg-[#3a3a3a] text-[#b9b9b9] font-opensans selection:bg-[#ff91a4] selection:text-white relative z-0">
            <SEO />

            {/* Dynamic Ambient Background */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] via-[#3a3a3a] to-[#252525]"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff91a4] mix-blend-screen opacity-[0.08] blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#b9b9b9] mix-blend-screen opacity-[0.05] blur-[100px]"></div>
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#ff91a4] mix-blend-screen opacity-[0.04] blur-[80px]"></div>
            </div>

            <Navbar />
            <main className="relative z-10">
                <Hero />
                <Suspense
                    fallback={
                        <div className="h-64 flex items-center justify-center text-[#ff91a4]">
                            Loading content...
                        </div>
                    }
                >
                    <About />
                    <Doctors />
                    <Gallery />
                    <Contact />
                </Suspense>
            </main>
            <Suspense fallback={<div className="h-32"></div>}>
                <Footer />
            </Suspense>
        </div>
    );
};

export default Home;
