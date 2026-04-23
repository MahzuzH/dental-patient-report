import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";

const Hero = () => {
  const waLink =
    "https://wa.me/6288975262351?text=Halo%20saya%20ingin%20booking%20perawatan%20di%20Sefya%20Dental%20Studio";

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center w-full"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-2xl flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles size={14} className="text-[#ff91a4]" />
              <span className="text-xs font-semibold tracking-widest text-[#ededed] uppercase">
                Layanan Gigi Premium
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-white leading-[1.1] mb-6 tracking-tighter">
              Wujudkan <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff91a4] to-[#d67a8a]">
                Senyum Impian
              </span>
              <br className="hidden sm:block" /> Anda Bersama Kami
            </h1>

            <p className="text-lg text-[#888] mb-10 leading-relaxed max-w-lg">
              Nikmati perawatan gigi dengan dukungan teknologi modern dan
              suasana yang nyaman. Tim kami siap membantu anda untuk mendapatkan
              senyum yang sehat dan percaya diri.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#ededed] hover:bg-white text-black min-w-[200px] px-8 py-4 rounded-full font-semibold transition-colors duration-200"
              >
                <CalendarCheck size={20} />
                <span>Booking Sekarang</span>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 w-full">
              <div>
                <p className="text-3xl font-bold text-[#ededed] mb-1 tracking-tight">
                  3+
                </p>
                <p className="text-xs text-[#888] font-medium uppercase tracking-wider">
                  Tahun Pengalaman
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#ededed] mb-1 tracking-tight">
                  3.000+
                </p>
                <p className="text-xs text-[#888] font-medium uppercase tracking-wider">
                  Pasien Puas
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#ededed] mb-1 tracking-tight">
                  Modern
                </p>
                <p className="text-xs text-[#888] font-medium uppercase tracking-wider">
                  Alat & Teknologi
                </p>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative hidden lg:flex justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-[#050505] group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800&h=1000"
                alt="Modern Dental Clinic"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-8 -left-6 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl z-20 flex items-center gap-4 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff91a4]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#ededed] tracking-tight">
                    Terjamin 100%
                  </p>
                  <p className="text-xs text-[#888] font-medium">
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