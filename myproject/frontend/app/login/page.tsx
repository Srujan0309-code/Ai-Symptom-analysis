"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side — editorial branding */}
      <motion.div layout className={`hidden lg:flex lg:w-1/2 relative items-center justify-center p-16 overflow-hidden ${isLogin ? '' : 'order-2'}`}>
        <div className="absolute inset-0 emerald-surface z-0" />
        <div className="absolute inset-0 sanctuary-grid opacity-10 z-[1]" />
        
        {/* Soft orbs */}
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] z-[1]" />
        <div className="absolute bottom-[15%] left-[15%] w-[250px] h-[250px] bg-lavender/10 rounded-full blur-[80px] z-[1]" />
        
        <div className="relative z-20 w-full max-w-lg text-center flex flex-col items-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-10 mx-auto backdrop-blur-sm">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-heading font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              {isLogin ? "Your AI Clinical Partner." : "Join the Medical Revolution."}
            </h1>
            <p className="text-lg text-white/70 font-body max-w-md leading-relaxed">
              {isLogin 
                ? "Analyze symptoms, visualize triage data, and route to the best medical care with surgical precision."
                : "Register today to save your symptom history securely and access powerful diagnostic tools."
              }
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side — form */}
      <motion.div layout className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${isLogin ? '' : 'order-1'}`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="surface-float p-10 md:p-12 text-center">
            
            <h2 className="text-3xl font-heading font-extrabold text-foreground mb-3">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-on-surface-variant text-sm mb-10 max-w-xs mx-auto">
              {isLogin ? "Sign in to securely access your triage history." : "First time here? Register to save your health data privately."}
            </p>

            {error && (
              <div className="mb-6 p-4 badge-emergency rounded-xl text-xs font-body font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-low text-foreground placeholder:text-outline outline-none focus:ring-2 focus:ring-emerald/20 transition-all font-body text-sm"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-low text-foreground placeholder:text-outline outline-none focus:ring-2 focus:ring-emerald/20 transition-all font-body text-sm"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pill btn-primary font-heading font-bold editorial-shadow mt-4 flex items-center justify-center gap-2 py-4 disabled:opacity-50"
              >
                {loading ? (
                   <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {isLogin ? "Sign In" : "Register"}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant/20" />
              <span className="text-[11px] text-outline font-heading font-bold uppercase tracking-[0.1em] px-2">Or continue with</span>
              <div className="h-px flex-1 bg-outline-variant/20" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-3 bg-surface-container hover:bg-surface-container-high py-4 rounded-xl font-heading font-bold transition-all active:scale-[0.98] disabled:opacity-50 text-foreground"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <div className="mt-8 p-5 rounded-xl bg-surface-container-low flex flex-col items-center gap-3">
              <p className="text-xs text-on-surface-variant">
                {isLogin ? "No medical profile yet?" : "Already registered?"}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald font-heading font-bold hover:underline transition-all w-full py-3 rounded-lg hover:bg-emerald/5 text-sm"
              >
                {isLogin ? "Register a new profile" : "Return to Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
