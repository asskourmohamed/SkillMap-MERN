import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Link } from 'react-router-dom';
import dashboardImg from "../assets/dashboard.jpg";
const HomePage = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Join 50k+ Professionals
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
              Connect with your <br className="hidden md:block"/>
              <span className="text-primary">professional future</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
              Expand your network, discover career-changing opportunities, and master new skills with a community of global professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-all">
                Get Started Today
              </Link>
              <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                View Demo
              </Link>
            </div>

            {/* Hero Image */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl overflow-hidden">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img 
                  src={dashboardImg} 
                  alt="Platform Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white dark:bg-background-dark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Why choose our platform?</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Unlock your professional potential with our comprehensive suite of networking tools designed for the modern career.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Networking */}
              <div className="group p-8 bg-background-light dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Networking</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Build meaningful professional relationships with industry peers through verified connections and interest-based groups.
                </p>
              </div>

              {/* Opportunities */}
              <div className="group p-8 bg-background-light dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">work</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Opportunities</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Access exclusive job listings and career-changing projects tailored to your specific skill set and career aspirations.
                </p>
              </div>

              {/* Skills */}
              <div className="group p-8 bg-background-light dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Skills</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upskill with industry-leading insights, expert-led workshops, and curated resources to stay ahead in your field.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-primary/5 dark:bg-primary/10 border-y border-primary/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Ready to transform your career?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">Join thousands of professionals already growing their networks and finding their next big break.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all">
                Join SkillMap Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;