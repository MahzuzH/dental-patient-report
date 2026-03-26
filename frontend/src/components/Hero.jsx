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
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff91a4]/20 text-white font-medium text-sm mb-6 shadow-sm border border-[#ff91a4]/50">
                            <ShieldCheck size={16} className="text-[#ff91a4]" />
                            <span>Premium Dental Care in Town</span>
                        </div>

                        <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            Create Your{" "}
                            <span className="text-[#ff91a4]">
                                Perfect Smile
                            </span>{" "}
                            With Professional Care
                        </h1>

                        <p className="text-lg text-white mb-8 leading-relaxed max-w-lg drop-shadow-sm">
                            Experience the highest standard of dental care in a
                            modern, comfortable environment. Our team of experts
                            is dedicated to bringing out your best and brightest
                            smile.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#ff91a4] hover:bg-[#d67a8a] text-white min-w-[200px] px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-[#ff91a4]/30 hover:-translate-y-1"
                            >
                                <CalendarCheck size={20} />
                                <span>Book Now (WhatsApp)</span>
                            </a>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#4a4a4a] text-white border border-[#b9b9b9] min-w-[160px] px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-sm hover:shadow hover:-translate-y-1"
                            >
                                <span>Login</span>
                                <ArrowRight
                                    size={20}
                                    className="text-[#ff91a4]"
                                />
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-12 pt-8 border-t border-[#4e4e4e]/60 grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    3+
                                </p>
                                <p className="text-sm text-[#a0a0a0] font-medium">
                                    Years Experience
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    3k+
                                </p>
                                <p className="text-sm text-[#a0a0a0] font-medium">
                                    Happy Patients
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    Modern
                                </p>
                                <p className="text-sm text-[#a0a0a0] font-medium">
                                    Equipment
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
                                className="absolute bottom-10 left-[-20px] bg-transparent rounded-2xl p-4 shadow-xl z-20 flex items-center gap-4 border border-[#4e4e4e]/40 animate-bounce"
                                style={{ animationDuration: "3s" }}
                            >
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        100% Guaranteed
                                    </p>
                                    <p className="text-xs text-[#a0a0a0] font-medium">
                                        Safe & Sterile
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
