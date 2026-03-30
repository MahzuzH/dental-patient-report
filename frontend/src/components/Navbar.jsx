import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, UserRound } from "lucide-react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "#home" },
        { name: "Tentang", href: "#about" },
        { name: "Tim Medis", href: "#doctors" },
        { name: "Galeri", href: "#gallery" },
        { name: "Kontak", href: "#contact" },
    ];

    const waLink =
        "https://wa.me/6288975262351?text=Halo%20saya%20ingin%20booking%20perawatan%20di%20Sefya%20Dental%20Studio";

    const handleSmoothScroll = (e, href) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#2a2a2a]/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={(e) => handleSmoothScroll(e, "#home")}
                        className="flex items-center gap-2 group"
                    >
                        <img
                            src="/logo.jpg"
                            alt="Logo Sefya Dental Studio"
                            className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <span
                            className={`font-montserrat text-xl font-bold tracking-tight text-white`}
                        >
                            Sefya Dental Studio
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={(e) =>
                                            handleSmoothScroll(e, link.href)
                                        }
                                        className="text-white hover:text-[#ff91a4] font-medium transition-colors drop-shadow-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-[#ff91a4] font-medium hover:text-rose-800 transition-colors"
                            >
                                <UserRound size={18} />
                                <span>Masuk</span>
                            </Link>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-[#ff91a4] hover:bg-[#d67a8a] text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md shadow-[#ff91a4]/20 hover:-translate-y-0.5"
                            >
                                <Phone size={18} />
                                <span>Buat Janji</span>
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-[#b9b9b9] p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-transparent shadow-lg border-t border-[#4e4e4e]/40 py-4 px-4 flex flex-col gap-4">
                    <ul className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    onClick={(e) =>
                                        handleSmoothScroll(e, link.href)
                                    }
                                    className="block text-[#d0d0d0] hover:text-[#ff91a4] font-medium py-2"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="h-px bg-[#252525]/80 border-[#3d3d3d] my-2"></div>
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-[#ff91a4] font-medium py-2 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                        <UserRound size={18} />
                        <span>Masuk</span>
                    </Link>
                    <a
                        filter="_blank"
                        href={waLink}
                        className="flex items-center justify-center gap-2 bg-[#ff91a4] hover:bg-[#d67a8a] text-white px-5 py-3 rounded-lg font-medium transition-all"
                    >
                        <Phone size={18} />
                        <span>Booking via WhatsApp</span>
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
