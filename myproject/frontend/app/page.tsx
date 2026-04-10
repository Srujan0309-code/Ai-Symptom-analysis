import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 w-full">
        <HowItWorks />
        
        {/* Call to Action Section */}
        <div className="my-24 p-12 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 text-white text-center relative overflow-hidden shadow-2xl shadow-primary-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to prioritize your health?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Joined by over 10,000+ users checking symptoms safely every day. 
              Get started with our AI diagnostic assistant now.
            </p>
            <a 
              href="/triage"
              className="inline-block bg-white text-primary-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all active:scale-95"
            >
              Start Your AI Triage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
