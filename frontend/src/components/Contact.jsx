import React from "react";
import { MapPin, Phone, Clock, MessageSquareShare } from "lucide-react";

const Contact = () => {
    const waLink =
        "https://wa.me/6288975262351?text=Halo%20saya%20ingin%20booking%20perawatan%20di%20Sefya%20Dental%20Studio";

    return (
        <section
            id="contact"
            className="py-24 bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20"
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h4 className="font-roboto text-[#ff91a4] font-semibold tracking-wider uppercase text-sm mb-3">
                        Hubungi Kami
                    </h4>
                    <h2 className="font-roboto text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block">
                        Lokasi & Kontak
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-[#ff91a4] rounded-full"></div>
                    </h2>
                    <p className="text-[#b9b9b9] text-lg">
                        Punya pertanyaan atau ingin buat janji temu? Tim kami
                        siap membantu Anda mewujudkan senyum impian.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10 bg-transparent rounded-3xl shadow-xl border border-[#4e4e4e]/40 overflow-hidden max-w-6xl mx-auto">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-[#d67a8a] to-rose-900 p-10 text-white relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff91a4]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <h3 className="font-roboto text-2xl font-bold mb-8 relative z-10">
                            Informasi Kontak
                        </h3>

                        <div className="space-y-8 relative z-10 flex-1">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20/10 flex items-center justify-center shrink-0">
                                    <MapPin
                                        size={24}
                                        className="text-rose-200"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-roboto font-semibold text-lg mb-1">
                                        Alamat Klinik
                                    </h4>
                                    <p className="text-rose-100 leading-relaxed">
                                        Jl. Subang Pamanukan,
                                        <br />
                                        Sukamulya, Kec. Pagaden,
                                        <br />
                                        Kabupaten Subang, Jawa Barat 41252
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20/10 flex items-center justify-center shrink-0">
                                    <Phone
                                        size={24}
                                        className="text-rose-200"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-roboto font-semibold text-lg mb-1">
                                        Nomor Telepon
                                    </h4>
                                    <p className="text-rose-100">
                                        +62 889-7526-2351
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20/10 flex items-center justify-center shrink-0">
                                    <Clock
                                        size={24}
                                        className="text-rose-200"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-roboto font-semibold text-lg mb-1">
                                        Jam Operasional
                                    </h4>
                                    <p className="text-rose-100">
                                        Setiap Hari
                                        <br />
                                        Pagi: 08:00 - 12:00
                                        <br />
                                        Sore/Malam: 15:00 - 20:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 relative z-10">
                            <p className="text-rose-200 text-sm mb-4">
                                Ingin booking segera?
                            </p>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-green-500/30"
                            >
                                <MessageSquareShare size={20} />
                                <span>Chat via WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Real Google Maps Embed */}
                    <div className="lg:col-span-3 min-h-[400px] bg-[#252525]/80 border-[#3d3d3d] relative rounded-2xl overflow-hidden p-2">
                        <iframe
                            title="Sefya Dental Studio Location Map"
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d126842.22030254555!2d107.82731097070311!3d-6.544477402279908!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69392ce35c6901%3A0xb85eae4e6bc6bab2!2sPraktik%20Dokter%20Gigi%20drg.%20Sefya%20Firdaus!5e0!3m2!1sen!2sid!4v1774529535689!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: "1rem" }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="bg-[#2f2f2f]/80 backdrop-blur-md shadow-black/20"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
