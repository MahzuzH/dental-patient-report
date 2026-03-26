import React from "react";
import { Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-transparent text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6 border-b border-gray-800 pb-8 mb-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-[#ff91a4] flex items-center justify-center text-white font-bold text-lg">
                                S
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Sefya Dental Studio
                            </span>
                        </div>
                        <p className="text-[#858585] max-w-sm mb-6 leading-relaxed">
                            Providing premium, professional, and comfortable
                            dental care. We bring bright smiles to our community
                            with care and dedication.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-roboto text-white font-bold mb-6 uppercase tracking-wider text-sm"></h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#home"
                                    className="hover:text-rose-400 transition-colors"
                                ></a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="hover:text-rose-400 transition-colors"
                                ></a>
                            </li>
                            <li>
                                <a
                                    href="#doctors"
                                    className="hover:text-rose-400 transition-colors"
                                ></a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="hover:text-rose-400 transition-colors"
                                ></a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-roboto text-white font-bold mb-6 uppercase tracking-wider text-sm">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#home"
                                    className="hover:text-rose-400 transition-colors"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="hover:text-rose-400 transition-colors"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#doctors"
                                    className="hover:text-rose-400 transition-colors"
                                >
                                    Our Doctors
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="hover:text-rose-400 transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#a0a0a0]">
                <p>
                    &copy; {new Date().getFullYear()} Sefya Dental Studio. All
                    rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
