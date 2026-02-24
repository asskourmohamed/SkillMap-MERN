import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import handshake from "../assets/Handshakes.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      navigate("/app/discovery");
    } catch (error) {
      setError(error.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${handshake})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-16 w-full text-white">
  
  <div className="max-w-md text-center">
    <h2 className="text-5xl font-extrabold leading-tight mb-6">
      Connect with the world's top talent.
    </h2>
    <p className="text-xl text-white/90 leading-relaxed">
      Join over 10 million professionals to share ideas, find
      opportunities, and grow your career.
    </p>
  </div>

  <div className="absolute bottom-6 text-sm text-white/70">
    © 2026 SkillMap Inc. All rights reserved.
  </div>

</div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button className="flex-1 py-4 text-sm font-semibold text-primary border-b-2 border-primary">
                Sign In
              </button>
              <Link
                to="/signup"
                className="flex-1 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-center"
              >
                Create Account
              </Link>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Please enter your details to sign in.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="w-full mt-2 px-4 py-3 bg-slate-100 dark:bg-slate-900 border rounded-lg outline-none dark:text-white"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border rounded-lg outline-none dark:text-white"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Keep me logged in
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-lg font-bold disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
