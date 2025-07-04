"use client"

import Header from "./(components)/Header";
import Hero from "./(components)/Hero";
import Features from "./(components)/Features";
import Pricing from "./(components)/Pricing";
import Contact from "./(components)/Contact";
import Footer from "./(components)/Footer";
import { useTheme } from "next-themes";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}