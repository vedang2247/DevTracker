import '../index.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/signin', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json' // <-- ADD THIS
                },
                credentials: 'include'
            })
            const data = await response.json();

            if (!response.ok) {
                setError("Wrong Username or Password!!");
                return;
            }
            navigate('/dashboard');
        }
        catch (err) {
            setError('Unable to connect to Database!')
        }
    }

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(circle at center, #1f2937 0%, transparent 100%)', backgroundSize: '40px 40px' }}>

            {/* Logo Header */}
            <div className="flex items-center gap-2 mb-8 z-10">
                <div className="bg-[#1f2937] p-2 rounded-md border border-gray-700">
                    <span className="text-[#818cf8] font-mono text-sm">&lt;/&gt;</span>
                </div>
                <h1 className="text-xl font-bold text-white">
                    Dev<span className="text-[#818cf8]">Tracker</span>
                </h1>
            </div>

            {/* Main Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl z-10">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                    <p className="text-gray-400 text-sm">Sign in to keep grinding.</p>
                </div>

                {/* Form - You need an onSubmit handler here */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 block">Email</label>
                        {/* You need value and onChange bindings here */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@dev.local"
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#818cf8] focus:ring-1 focus:ring-[#818cf8] transition-colors"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Forgot?</a>
                        </div>
                        {/* You need value and onChange bindings here */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#818cf8] focus:ring-1 focus:ring-[#818cf8] transition-colors"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#818cf8] hover:bg-[#6366f1] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        Sign in
                        <span className="text-lg">→</span>
                    </button>
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    {/* Divider */}
                    <div className="relative flex items-center justify-center py-4">
                        <div className="absolute border-t border-gray-800 w-full"></div>
                        <span className="bg-[#161b22] px-3 text-xs text-gray-500 relative uppercase tracking-wider">or</span>
                    </div>

                    {/* Google Button (Visual only for now) */}
                    <button
                        type="button"
                        className="w-full bg-[#1c2128] hover:bg-[#22272e] border border-gray-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                        Continue with Google
                    </button>
                </form>
            </div>

            {/* Footer Link */}
            <p className="mt-8 text-sm text-gray-500 z-10">
                New here? <a href="/register" className="text-[#818cf8] hover:text-[#6366f1] hover:underline">Create an account</a>
            </p>
        </div>
    );
}

export default Login