import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import handshake from "../assets/presenting.jpg";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Développement',
    jobTitle: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const departments = [
    'Développement',
    'Design',
    'Marketing',
    'Commercial',
    'RH',
    'Administration',
    'Product',
    'Data',
    'DevOps'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!agreeTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);

    try {
      // Préparer les données (sans confirmPassword)
      const { confirmPassword, ...signupData } = formData;
      
      const response = await authService.register(signupData);
      
      // Sauvegarder le token et l'utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      // Rediriger vers la page de profil pour compléter
      navigate('/app/my-profile');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError(error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
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
    
            <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
    
              {/* Text */}
              <div className="max-w-md">
                <h2 className="text-5xl font-extrabold leading-tight mb-6">
                  Connect with the world's top talent.
                </h2>
                <p className="text-xl text-white/90 leading-relaxed">
                  Join over 10 million professionals to share ideas, find
                  opportunities, and grow your career.
                </p>
              </div>
    
              <div className="text-sm text-white/70">
                © 2026 SkillMap Inc. All rights reserved.
              </div>
            </div>
          </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md">

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <Link to="/login" className="flex-1 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-center">
                Sign In
              </Link>
              <button className="flex-1 py-4 text-sm font-semibold text-primary border-b-2 border-primary">
                Create Account
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h3>
                <p className="text-slate-500 dark:text-slate-400">Join our professional community today.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="name" 
                      name="name"
                      placeholder="John Doe" 
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="email" 
                      name="email"
                      placeholder="name@company.com" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="department">
                    Department
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">business_center</span>
                    <select
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white appearance-none"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">expand_more</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="jobTitle">
                    Job Title
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">work</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="jobTitle" 
                      name="jobTitle"
                      placeholder="Senior Developer" 
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="company">
                    Company
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">business</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="company" 
                      name="company"
                      placeholder="TechFlow Systems" 
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                    <input 
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="password" 
                      name="password"
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
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
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                    <input 
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                      id="confirmPassword" 
                      name="confirmPassword"
                      placeholder="••••••••" 
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 py-2">
                  <input 
                    className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary" 
                    id="terms" 
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label className="text-sm text-slate-600 dark:text-slate-400 select-none" htmlFor="terms">
                    I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <button 
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 font-medium">Or sign up with</span>
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
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 text-center border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                By creating an account, you agree to our 
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

export default SignupPage;