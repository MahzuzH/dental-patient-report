import { useState } from "react";

export function useLoginPageLogic() {
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

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        handleLogin,
    };
}
