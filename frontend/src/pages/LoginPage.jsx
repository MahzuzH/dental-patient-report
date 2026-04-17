import loginImg from "../assets/login.png";
import { useState, useEffect } from "react";
import { preload } from "react-dom";
import { useLoginPageLogic } from "../hooks/useLoginPageLogic";

// Hoist static JSX to avoid re-creation on every render
const ShowIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.768-6.818M6.18 6.18A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.06-.163 2.084-.468 3.04M3 3l18 18"
        />
    </svg>
);

const HideIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
        <circle
            cx="12"
            cy="12"
            r="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

export default function LoginPage() {
    const { email, setEmail, password, setPassword, loading, handleLogin } =
        useLoginPageLogic();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Preload heavy background image for LCP optimization
    useEffect(() => {
        preload(loginImg, { as: "image" });
    }, []);

    return (
        <div className="h-screen w-screen flex font-poppins bg-[#3a3a3a] overflow-hidden">
            {/* LEFT SIDE */}
            <div 
                className={`w-1/2 flex flex-col justify-center pl-40 transition-all duration-1000 transform ${
                    isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}
            >
                <p className="text-md text-[#ff91a4] mb-4 flex items-center gap-2 font-medium">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-8 h-8 rounded-lg shadow-lg shadow-[#ff91a4]/20"
                    />
                    Sefya Dental Studio
                </p>

                <h1 className="text-4xl font-semibold mb-6 leading-tight text-white">
                    Holla, <br /> Welcome Back
                </h1>

                {/* 🔥 FORM START */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className={`space-y-4 transition-all duration-1000 delay-300 transform ${
                        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
                >
                    {/* EMAIL */}
                    <div className="max-w-md">
                        <input
                            autoFocus
                            type="email"
                            placeholder="Email"
                            className="w-full bg-[#4a4a4a] border border-[#b9b9b9]/30 rounded-xl px-4 py-3 placeholder-[#b9b9b9] text-white focus:outline-none focus:ring-2 focus:ring-[#ff91a4]/50 focus:border-[#ff91a4] transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative max-w-md">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-[#4a4a4a] border border-[#b9b9b9]/30 rounded-xl px-4 py-3 pr-12 placeholder-[#b9b9b9] text-white focus:outline-none focus:ring-2 focus:ring-[#ff91a4]/50 focus:border-[#ff91a4] transition-all"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#ff91a4] hover:bg-[#ff91a4]/10 rounded-full transition-colors focus:outline-none"
                            aria-label={
                                showPassword
                                    ? "Sembunyikan password"
                                    : "Lihat password"
                            }
                        >
                            {showPassword ? ShowIcon : HideIcon}
                        </button>
                    </div>

                    <div className="pt-2">
                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-40 bg-[#ff91a4] text-white py-3 rounded-xl hover:bg-[#ff7a91] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ff91a4]/30 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ff91a4] disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                    </div>
                </form>
                {/* 🔥 FORM END */}
            </div>

            <div className={`w-1/2 h-full flex items-center justify-center p-8 transition-all duration-1000 delay-500 transform ${
                isLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}>
                {/* WRAPPER */}
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-[#ffffff10] group">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
                        style={{
                            backgroundImage: `url(${loginImg})`,
                            backgroundPosition: "35% center",
                        }}
                    ></div>
                    {/* Darker Overlay for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3a3a3a]/40 to-transparent pointer-events-none"></div>
                    
                    {/* Abstract design elements */}
                    <div className="absolute bottom-10 left-10 text-white/80 max-w-xs animate-pulse">
                        <p className="text-xl font-light italic">"A smile is the universal welcome."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


