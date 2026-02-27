import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('═══════════════════════════════════════');
    console.log('🔐 TENTATIVE DE CONNEXION');
    console.log('📧 Email saisi:', email);
    console.log('🔑 Password saisi:', password);

    try {
      // Nettoyer les anciennes données avant de se connecter
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim(),
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('✅ Réponse du serveur:', response.data);

      if (response.data.success) {
        // Sauvegarder les nouvelles données
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        
        console.log('✅ Nouvel utilisateur connecté:', response.data.data.email);
        
        // Rediriger vers Discovery
        navigate('/app/discovery');
      } else {
        setError(response.data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      
      if (error.response) {
        setError(error.response.data.error || `Erreur ${error.response.status}`);
      } else if (error.request) {
        setError('Le serveur ne répond pas. Vérifiez que le backend est lancé.');
      } else {
        setError('Erreur: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Visual Anchor */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 z-10 bg-primary/40 mix-blend-multiply"></div>
        <img 
          alt="Professionals Collaborating" 
          className="absolute inset-0 object-cover w-full h-full" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS_sshOmTIbv8ksWJuDiSGumjthANGMr7XEJqQmMu92i0Ll781mrDqmjrCzn2YjLJs7c87FiHxTYPQtCiFF3Z1uhG79lQg5Bebx8CdWyeSXWkbnox30VDq3ULtEQXwfE9HfPf2z1VgiCwBAWdRaR9paGswmG3GXb9OUOFK1IKGAapDms45d0WwDWldq5QdyE6Ip07EoORlbsQwzLxPh3xHDbOQa6THq4pe79DHX7533-98vBaUOUZ0U3JyujwrH9f18mHeNvyAGUNL"
        />
        <div className="relative z-20 flex flex-col justify-between p-16 w-full text-white">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-lg">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ProNetwork</h1>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-5xl font-extrabold leading-tight mb-6">Connect with the world's top talent.</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join over 10 million professionals to share ideas, find opportunities, and grow your career.
            </p>
            
            <div className="mt-10 flex gap-4">
              <div className="flex -space-x-3">
                <img alt="User" className="size-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADlnyGNiYOFJ9Eg41bOztqq-S_6WhmnDl3iulX7VigV4UDwEgI-GB9L-JMKb0JkrPJNGelgA3cvu3FLIUMxoGR-g6PjFqIUTQr2348BXcqhI7b9G22tD-iJXN4WeSRGU0UHcxjLhvvZ288-RryKhkjNDfyq4oITIIYQgP8Qe5B6ieWIsWXfa_3tBwceOc1wmYqWoOmB32-N8aUvbZg0sssRQlxO7jwvDGI6IhkBP5qV_gks9E0qyYHR24f3rXdJ0gebqsmT3oPE1lu"/>
                <img alt="User" className="size-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa1OQPDfRWNDRvmTu2ImrL6QoUQEcPpeOxuadP9raNJFU2a2AxAM0M9K__3X_TzeNXd9oIRbiZaVoFn2_D6GGSEu0MjBaOoXSJcBhtWHJjWlfMJ9wEQKEHEUaNoMxDHfjUo7jRc8N0b3w6G-IIzSN44YRNLCgso1BkXtBD4JLE7Uz3BRHiYZHzJ5ppXGk-8c7xPeP8bdlEEEPuZQixBM1xAMuBTnaOk9CQMHpxCZBoDwaQFwIsDU4KaM8PdMNh79WZW0qtQrEbpSQF"/>
                <img alt="User" className="size-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBas6RBYj1dNWlP5PvDlUqYXA-cWfQA2O-wPhDVEAVgbRTaaAe0qtLPFFzVF1nHpDwz2DekGa13fBmeODvB9lKz4RblcJVbVDMsMe8pY7BlMwyXe6RmiojHoOiHq1nWAq3-cYxkUhl8JqAzeV2j_aAdHawav54_RXV-uAkFC_0-MO9NTis_Ct7YWZvveCwlUOGoF8pJ3bwx2I2XRKdiFe6xafnPmhATAk_wgwV2mArm0GkbImW6IVk20PNaxj8XkwBJmQ03HtWgXxGg"/>
                <div className="size-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-xs font-bold">+2k</div>
              </div>
              <p className="text-sm self-center font-medium">Trusted by industry leaders</p>
            </div>
          </div>
          
          <div className="text-sm text-white/70">
            © 2024 ProNetwork Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">hub</span>
            <span className="text-2xl font-bold dark:text-white">ProNetwork</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button className="flex-1 py-4 text-sm font-semibold text-primary border-b-2 border-primary">
                Sign In
              </button>
              <Link to="/signup" className="flex-1 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-center">
                Create Account
              </Link>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h3>
                <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="email" 
                      placeholder="name@company.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                    <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                    <input 
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="password" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input 
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary" 
                    id="remember" 
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="text-sm text-slate-600 dark:text-slate-400 select-none" htmlFor="remember">Keep me logged in</label>
                </div>

                <button 
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google</span>
                </button>
                
                <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <svg className="size-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">LinkedIn</span>
                </button>
              </div>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 text-center border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                By signing in, you agree to our 
                <a className="text-primary font-semibold hover:underline ml-1" href="#">Terms of Service</a> 
                and 
                <a className="text-primary font-semibold hover:underline ml-1" href="#">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Global Footer Links */}
          <div className="mt-8 flex justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a className="hover:text-primary transition-colors" href="#">Help Center</a>
            <a className="hover:text-primary transition-colors" href="#">About Us</a>
            <a className="hover:text-primary transition-colors" href="#">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;