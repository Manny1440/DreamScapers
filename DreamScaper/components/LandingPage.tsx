import React, { useRef } from 'react';
import { Star, ArrowRight, Play } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';

const DEFAULT_BEFORE = '/before.png';
const DEFAULT_AFTER = '/after.png';

interface LandingPageProps {
  onLaunchApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promo bar */}
      <div className="bg-emerald-900 text-white text-xs font-bold py-2 text-center uppercase tracking-widest">
        🚀 Launch Promo: Sign up today &amp; get 30 days free
      </div>

      {/* Hero */}
      <section className="bg-emerald-950 text-white pt-24 pb-36 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-emerald-200 text-sm mb-10 border border-white/10">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span>#1 AI Tool for Modern Landscapers</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none">
          Transform Backyards <br />
          <span className="text-emerald-400">In 30 Seconds.</span>
        </h1>

        <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12">
          Close more deals by showing clients their dream garden before you dig.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onLaunchApp}
            className="px-10 py-5 bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-2xl transition-transform hover:scale-105 active:scale-95"
          >
            Start Free Trial
          </button>

          <button
            onClick={scrollToDemo}
            className="px-10 py-5 bg-white/10 border border-white/20 text-white font-bold text-xl rounded-2xl backdrop-blur hover:bg-white/20 transition flex items-center justify-center gap-2"
          >
            <Play size={20} /> View Demo
          </button>
        </div>
      </section>

      {/* Demo section */}
      <section
        ref={demoRef}
        className="py-24 bg-slate-50 -mt-24 px-4"
      >
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <BeforeAfterSlider
            beforeImage={DEFAULT_BEFORE}
            afterImage={DEFAULT_AFTER}
          />
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Drag the slider to compare before &amp; after
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
