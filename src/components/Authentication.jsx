import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_GOWN_API_BASE;

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (password === "secret123" && username === "admin") {   // 🔑 replace with real auth later
            setIsAuthenticated(true);
        } else {
            alert("Invalid password");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username, password);
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                username,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setIsAuthenticated(true);
        } catch (err) {
            setError("Wrong username or password");
        }
    };

    if (!isAuthenticated) {
        return (
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-xl font-bold mb-4">Login Required</h2>
                        <input
                            type="username"
                            placeholder="Enter username"
                            className="border rounded p-2 w-full mb-3"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="border rounded p-2 w-full mb-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <p className="text-red-600 text-sm mb-2">{error}</p>  // show inline error
                        )}
                        <button
                            className="w-full !bg-green-700 text-white py-2 rounded hover:!bg-green-800">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    // ✅ If logged in, show the protected page
    return <>{children}</>;
}

export default ProtectedRoute;
