import { useState } from "react";
import loginImg from "../assets/login.png";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Email dan password wajib diisi");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.token) {
                // simpan token
                localStorage.setItem("token", data.token);

                // redirect
                window.location.href = "/dashboard";
            } else {
                alert(data.error || "Login gagal");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen w-screen flex font-poppins">
            {/* LEFT SIDE */}
            <div className="w-1/2 flex flex-col justify-center pl-40 bg-[#ffffff]">
                <p className="text-md text-purple-600 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
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
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full max-w-md border border-gray-300 rounded-md px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        onChange={(e) => setPassword(e.target.value)}
                    />
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
