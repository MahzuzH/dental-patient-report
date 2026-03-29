import loginImg from "../assets/login.png";
import { useState } from "react";
import { useLoginPageLogic } from "../hooks/useLoginPageLogic";

export default function LoginPage() {
    const { email, setEmail, password, setPassword, loading, handleLogin } =
        useLoginPageLogic();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-screen w-screen flex font-poppins">
            {/* LEFT SIDE */}
            <div className="w-1/2 flex flex-col justify-center pl-40 bg-[#ffffff]">
                <p className="text-md text-purple-600 mb-4 flex items-center gap-2">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-8 h-8 rounded-lg"
                    />
                    Sefya Dental Studio
                </p>

                <h1 className="text-4xl font-semibold mb-6 leading-tight">
                    Holla, <br /> Welcome Back
                </h1>

                {/* 🔥 FORM START */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    {/* EMAIL */}
                    <input
                        autoFocus
                        type="email"
                        placeholder="Email"
                        className="w-full max-w-md border border-gray-300 rounded-md px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* PASSWORD */}
                    <div className="relative mb-6 max-w-md">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full max-w-md border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md text-purple-600 hover:bg-purple-50 focus:outline-none"
                            aria-label={
                                showPassword
                                    ? "Sembunyikan password"
                                    : "Lihat password"
                            }
                        >
                            {showPassword ? (
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
                            ) : (
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
                            )}
                        </button>
                    </div>
                    <br />

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-32 bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                </form>
                {/* 🔥 FORM END */}
            </div>

            <div className="w-1/2 h-full bg-[#ffffff] flex items-center justify-center">
                {/* WRAPPER (biar ada space masuk) */}
                <div className="w-[95%] h-[95%] rounded-3xl overflow-hidden shadow-xl">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${loginImg})`,
                            backgroundPosition: "35% center",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
