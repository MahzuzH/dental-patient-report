import React from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";

const Doctors = () => {
    const doctors = [
        {
            name: "drg. Sefya Firdaus",
            role: "General Dentist",
            description: "FKG Universitas Jendral Ahmad Yani Bandung 2016",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-[#ff91a4]",
        },
        {
            name: "drg. Sarah Andintama",
            role: "General Dentist",
            description: "FKG Universitas Jendral Ahmad Yani Bandung 2019",
            image: "https://images.unsplash.com/photo-1594824436998-05ea266b38a5?auto=format&fit=crop&q=80&w=400&h=400",
            accent: "bg-blue-500",
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
                        Meet Our Team
                    </h4>
                    <h2 className="font-roboto text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block">
                        Our Dental Experts
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-[#ff91a4] rounded-full"></div>
                    </h2>
                    <p className="text-[#b9b9b9] text-lg">
                        Our highly qualified and experienced dental
                        professionals are here to provide you with the best
                        possible treatment.
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {doctors.map((doctor, index) => (
                        <div
                            key={index}
                            className="bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20 rounded-[2rem] p-6 shadow-sm border border-[#4e4e4e]/40 hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                        >
                            {/* Doctor Image */}
                            <div className="relative w-40 h-40 shrink-0">
                                <div
                                    className={`absolute inset-0 ${doctor.accent} rounded-full opacity-0 group-hover:opacity-10 scale-110 transition-all duration-500`}
                                ></div>
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-md relative z-10 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-1 text-center sm:text-left mt-2">
                                <h3 className="font-roboto text-2xl font-bold text-white mb-1">
                                    {doctor.name}
                                </h3>
                                <p
                                    className={`text-sm font-semibold mb-4 inline-block px-3 py-1 rounded-full bg-rose-50 text-[#d67a8a]`}
                                >
                                    {doctor.role}
                                </p>
                                <p className="text-[#b9b9b9] leading-relaxed mb-6 text-sm">
                                    {doctor.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Doctors;
