import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, ArrowRight, ShieldCheck } from "lucide-react";

const Hero = () => {
    const waLink =
        "https://wa.me/6288975262351?text=Halo%20saya%20ingin%20booking%20perawatan%20di%20Sefya%20Dental%20Studio";

    return (
        <section
            id="home"
            className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center"
        >
            {/* Removed Background Decorations to let true dark theme shine through */}

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="max-w-2xl">
                        <span>Layanan Gigi Premium & Terpercaya</span>

                        <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            Wujudkan{" "}
                            <span className="text-[#ff91a4]">
                                Senyum Impian
                            </span>{" "}
                            Anda Bersama Kami
                        </h1>

                        <p className="text-lg text-white mb-8 leading-relaxed max-w-lg drop-shadow-sm">
                            Nikmati perawatan gigi dengan dukungan teknologi
                            modern dan suasana yang nyaman. Tim kami siap
                            membantu anda untuk mendapatkan senyum yang sehat
                            dan percaya diri.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#ff91a4] hover:bg-[#d67a8a] text-white min-w-[200px] px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-[#ff91a4]/30 hover:-translate-y-1"
                            >
                                <CalendarCheck size={20} />
                                <span>Booking Sekarang (WhatsApp)</span>
                            </a>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-12 pt-8 border-t border-[#4e4e4e]/60 grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    3+
                                </p>
                                <p className="text-sm text-[#a0a0a0] font-medium">
                                    Tahun Pengalaman
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    3.000+
                                </p>
                                <p className="text-sm text-[#a0a0a0] font-medium">
                                    Pasien Puas
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    Alat
                                </p>
                                <p className="text-sm text-[#a0a0a0] font-medium">
                                    Modern & Canggih
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="relative hidden lg:block">
                        {/* Decorative elements behind image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff91a4] to-blue-500 rounded-[2.5rem] rotate-3 opacity-20 scale-105 transition-transform duration-500 hover:rotate-6"></div>

                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-transparent border border-[#4e4e4e]/40 aspect-[4/5] object-cover flex items-center justify-center">
                            {/* Using a placeholder since we don't have the actual image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-white"></div>
                            <img
                                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800&h=1000"
                                alt="Modern Dental Clinic"
                                className="w-full h-full object-cover relative z-10 transition-transform duration-700 hover:scale-105"
                            />

                            {/* Floating Badge */}
                            <div
                                className="absolute bottom-10 left-[-1px] bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-xl z-20 flex items-center gap-4 border border-white/10 animate-bounce"
                                style={{ animationDuration: "3s" }}
                            >
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Terjamin 100%
                                    </p>
                                    <p className="text-xs text-[#a0a0a0] font-medium">
                                        Aman & Steril
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
