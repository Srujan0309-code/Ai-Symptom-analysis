"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Activity, Menu, X, ArrowUpRight, LogOut, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Triage", href: "/triage" },
    { name: "Map", href: "/map" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex justify-between items-center transition-all duration-500 ${scrolled ? 'glass-surface rounded-full mx-6 md:mx-12 lg:mx-16 px-6 editorial-shadow' : ''}`}>
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald/80 flex items-center justify-center group-hover:scale-105 transition-transform editorial-shadow">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-heading font-bold text-foreground hidden sm:block tracking-tight">
            MediRoute <span className="text-emerald">AI</span>
          </span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-surface-container rounded-full px-1.5 py-1.5">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`px-5 py-2 text-sm font-heading font-semibold transition-all rounded-full ${
                pathname === link.href 
                  ? "bg-emerald text-white editorial-shadow" 
                  : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-high"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-surface-container rounded-full p-1">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2.5 text-on-surface-variant hover:text-foreground transition-colors rounded-full hover:bg-surface-container-high"
              title="Switch Language"
            >
              <Globe className="h-4 w-4" />
            </button>
            <ThemeToggle />
            {user && (
              <button 
                onClick={async () => { await logout(); router.push("/login"); }}
                className="p-2.5 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-surface-container-high"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          <Link 
            href={user ? "/triage" : "/login"}
            className="btn-pill btn-primary text-sm font-heading font-bold flex items-center gap-2"
          >
            {user ? "Start Triage" : "Get Started"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-foreground"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="md:hidden absolute top-20 left-4 right-4 bg-background rounded-2xl editorial-shadow-lg p-4 z-[60]"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-5 py-4 rounded-xl font-heading font-semibold transition-colors ${
                    pathname === link.href ? "bg-surface-container text-emerald" : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-low"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-outline-variant/15 mx-4 my-2" />
              <div className="flex justify-between items-center px-5 py-3">
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="text-on-surface-variant text-sm font-medium flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Language: <span className="text-foreground font-bold uppercase">{language}</span>
                </button>
                <ThemeToggle />
              </div>
              {user && (
                <button 
                  onClick={async () => { await logout(); router.push("/login"); }}
                  className="text-error text-sm font-bold px-5 py-2 text-left"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
