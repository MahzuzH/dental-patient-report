import React from "react";

const Doctors = () => {
    const doctors = [
        {
            name: "drg. Sefya Firdaus",
            role: "Dokter Gigi",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-[#ff91a4]",
        },
        {
            name: "drg. Sarah Andintama",
            role: "Dokter Gigi",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-[#ff91a4]",
        },
        {
            name: "Vidia Eka Putri",
            role: "Asisten Dokter Gigi",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-green-500",
        },
        {
            name: "Ika",
            role: "Asisten Dokter Gigi",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-green-500",
        },
        {
            name: "Maya",
            role: "Administrasi",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-yellow-500",
        },
    ];

    return (
        <section
            id="doctors"
            className="py-24 bg-transparent border-y border-[#4e4e4e]/40 relative"
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h4 className="font-roboto text-[#ff91a4] font-semibold tracking-wider uppercase text-sm mb-3">
                        Kenali Tim Kami
                    </h4>
                    <h2 className="font-roboto text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block">
                        Ahli Gigi Kami
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-[#ff91a4] rounded-full"></div>
                    </h2>
                    <p className="text-[#b9b9b9] text-lg">
                        Tenaga profesional kami yang berpengalaman siap
                        memberikan perawatan terbaik sesuai kebutuhan Anda.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Top Row: 2 Doctors */}
                    <div className="flex flex-wrap justify-center gap-10">
                        {doctors.slice(0, 2).map((doctor, index) => (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(33.333%-2.5rem)] max-w-sm"
                            >
                                {/* Card Body */}
                                <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-[#1f1f1f]/40 shadow-2xl transition-all duration-700 group-hover:shadow-[#ff91a4]/10 group-hover:-translate-y-4">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95 z-10"></div>
                                    <div
                                        className={`absolute -top-24 -right-24 w-64 h-64 ${doctor.accent} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-1000`}
                                    ></div>
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 border border-white/20 mb-3">
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${doctor.accent} mr-2 shadow-[0_0_8px] shadow-current animate-pulse`}
                                            ></span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                                {doctor.role}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                                            {doctor.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <br />
                    <br />

                    {/* Bottom Row: 3 Team Members */}
                    <div className="flex flex-wrap justify-center gap-10">
                        {doctors.slice(2, 5).map((doctor, index) => (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(33.333%-2.5rem)] max-w-sm"
                            >
                                {/* Card Body (Copied Style) */}
                                <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-[#1f1f1f]/40 shadow-2xl transition-all duration-700 group-hover:shadow-[#ff91a4]/10 group-hover:-translate-y-4">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95 z-10"></div>
                                    <div
                                        className={`absolute -top-24 -right-24 w-64 h-64 ${doctor.accent} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-1000`}
                                    ></div>
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 border border-white/20 mb-3">
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${doctor.accent} mr-2 shadow-[0_0_8px] shadow-current animate-pulse`}
                                            ></span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                                {doctor.role}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                                            {doctor.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Doctors;
