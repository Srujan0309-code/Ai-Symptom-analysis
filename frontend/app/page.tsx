"use client";

import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesChess from "@/components/FeaturesChess";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import CtaFooter from "@/components/CtaFooter";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      
      <div className="relative">
        <HowItWorks />
        <FeaturesChess />
        <FeaturesGrid />
        <StatsSection />
        <Testimonials />
        <CtaFooter />
      </div>
    </div>
  );
}
