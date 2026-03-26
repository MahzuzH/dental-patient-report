import React from "react";
import { Microscope, Stethoscope, HeartHandshake, Award } from "lucide-react";

const About = () => {
    const features = [
        {
            icon: <Stethoscope size={28} className="text-blue-500" />,
            title: "Professional Service",
            description:
                "Our certified dentists provide rigorous, standards-compliant care tailored to your unique oral health needs.",
            bgColor: "bg-blue-50",
        },
        {
            icon: <Microscope size={28} className="text-[#ff91a4]" />,
            title: "Modern Equipment",
            description:
                "We utilize cutting-edge medical technologies and advanced dental tools to ensure precise and painless treatments.",
            bgColor: "bg-rose-50",
        },
        {
            icon: <HeartHandshake size={28} className="text-pink-500" />,
            title: "Comfortable Treatment",
            description:
                "Experience a relaxing atmosphere designed to ease anxiety and turn your dental visits into pleasant experiences.",
            bgColor: "bg-pink-50",
        },
        {
            icon: <Award size={28} className="text-orange-500" />,
            title: "Top-Tier Quality",
            description:
                "We only use premium materials and proven techniques to ensure lasting and beautiful results for every patient.",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <section id="about" className="py-24 bg-transparent relative">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h4 className="font-roboto text-[#ff91a4] font-semibold tracking-wider uppercase text-sm mb-3">
                        About Us
                    </h4>
                    <h2 className="font-roboto text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block">
                        Why Choose Sefya Dental Studio?
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-[#ff91a4] rounded-full"></div>
                    </h2>
                    <p className="text-[#b9b9b9] text-lg">
                        We are dedicated to providing the highest quality dental
                        care in a patient-friendly environment. Your comfort and
                        health are our top priorities.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20 rounded-2xl p-8 border border-[#4e4e4e]/40 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                        >
                            <div
                                className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="font-roboto text-xl font-bold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-[#b9b9b9] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="mt-20 bg-gradient-to-br from-[#d67a8a] to-rose-900 rounded-3xl p-8 md:p-12 border border-[#4e4e4e]/40 overflow-hidden relative shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff91a4]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] transform translate-x-1/4 -translate-y-1/4">
                        <svg
                            width="200"
                            height="200"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-white"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm6 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                            <path d="M12 16c-1.48 0-2.75-.81-3.45-2H8.5c.78 2.34 2.95 4 5.5 4s4.72-1.66 5.5-4h-2.05c-.7 1.19-1.97 2-3.45 2z" />
                        </svg>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 text-white">
                        <div>
                            <h3 className="font-roboto text-2xl md:text-3xl font-bold mb-4 drop-shadow-sm">
                                Committed to Excellence in Dental Care
                            </h3>
                            <p className="text-white/90 mb-6 leading-relaxed">
                                At Sefya Dental Studio, we believe that a
                                healthy smile is a beautiful smile. Our clinic
                                was founded on the principle of providing
                                transparent, ethical, and high-quality dental
                                services to our community.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Comprehensive Examinations",
                                    "Painless Procedures",
                                    "Affordable Care Plans",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-white/90 font-medium"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shadow-sm">
                                            ✓
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl overflow-hidden shadow-2xl h-64 md:h-80 relative border border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800&h=600"
                                alt="Dental Equipment"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                                <p className="text-white font-medium drop-shadow-md">
                                    Modern sterilization machines ensuring your
                                    safety.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
