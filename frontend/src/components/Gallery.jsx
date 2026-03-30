import React from "react";
import { Camera, ZoomIn } from "lucide-react";

const Gallery = () => {
    const images = [
        {
            url: "https://images.unsplash.com/photo-1629909606604-4a1511634442?auto=format&fit=crop&q=80&w=800",
            title: "Peralatan Modern",
            category: "Fasilitas",
        },
        {
            url: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800",
            title: "Ruang Tunggu Nyaman",
            category: "Fasilitas",
        },
        {
            url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800",
            title: "Senyum Pasien",
            category: "Hasil Perawatan",
        },
        {
            url: "https://images.unsplash.com/photo-1559839734-2b71f1e9cbee?auto=format&fit=crop&q=80&w=800",
            title: "Konsultasi Dokter",
            category: "Pelayanan",
        },
        {
            url: "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&q=80&w=800",
            title: "Interior Klinik",
            category: "Fasilitas",
        },
        {
            url: "https://images.unsplash.com/photo-1504813184591-015923d1413f?auto=format&fit=crop&q=80&w=800",
            title: "Teknologi Terkini",
            category: "Fasilitas",
        },
    ];

    return (
        <section id="gallery" className="py-24 bg-transparent border-b border-[#4e4e4e]/40 relative">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h4 className="font-roboto text-[#ff91a4] font-semibold tracking-wider uppercase text-sm mb-3">
                        Galeri Kami
                    </h4>
                    <h2 className="font-roboto text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block">
                        Momen & Fasilitas Terbaik
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-[#ff91a4] rounded-full"></div>
                    </h2>
                    <p className="text-[#b9b9b9] text-lg">
                        Lihat lebih dekat kenyamanan fasilitas dan dedikasi kami dalam menghadirkan senyum sehat bagi setiap pasien.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-3xl aspect-[4/3] border border-[#4e4e4e]/40 bg-[#2f2f2f]/80 shadow-lg hover:shadow-[#ff91a4]/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Image */}
                            <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#252525]/90 via-[#252525]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#ff91a4]/20 border border-[#ff91a4]/30 text-[#ff91a4] text-xs font-semibold mb-3 backdrop-blur-md">
                                        {image.category}
                                    </span>
                                    <h3 className="text-white text-xl font-bold mb-1 flex items-center gap-2">
                                        {image.title}
                                        <ZoomIn size={18} className="text-[#ff91a4] opacity-0 group-hover:opacity-100 transition-opacity delay-200" />
                                    </h3>
                                </div>
                            </div>

                            {/* Decorative Corner Icon (Optional) */}
                            <div className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera size={16} className="text-white" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Suggestion */}
                <div className="mt-16 text-center">
                    <p className="text-[#b9b9b9] italic">
                        "Kenyamanan Anda adalah prioritas utama kami di setiap langkah perawatan."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
