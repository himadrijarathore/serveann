"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-primary-light selection:text-white relative">
      {/* Navbar (simplified for landing) */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-20">
        <div className="text-3xl font-heading font-bold text-primary flex items-center gap-3">
          <span className="text-4xl">🍲</span> ServeAnn
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/login" className="text-secondary font-bold hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" className="rounded-full px-6 shadow-md">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
          
          {/* Decorative background glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary/10 via-gold/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto z-10 animate-fade-in relative">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-6 text-charcoal leading-tight">
              Rescue Food,<br />
              <span className="bg-gradient-to-r from-primary via-accent to-gold bg-clip-text text-transparent">
                Nourish Lives
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-charcoal-light max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join India's smartest food rescue network. We seamlessly connect restaurants, events, and generous donors with local shelters to eliminate food waste and fight hunger.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-16 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="rounded-full px-8 text-lg shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform border border-primary-light/50">
                  Start Donating
                </Button>
              </Link>
              <Link href="#impact">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-lg border-2 border-primary text-primary hover:bg-primary/10 hover:-translate-y-1 transition-transform">
                  View Impact
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Row in an Arch Style */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="indian-arch bg-white/80 backdrop-blur-md p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-heading font-bold text-secondary mb-2">10,000+</h3>
              <p className="text-charcoal font-semibold uppercase tracking-widest text-sm">Meals Served</p>
            </div>
            <div className="indian-arch bg-white/80 backdrop-blur-md p-8 text-center hover:-translate-y-2 transition-transform duration-300 delay-100">
              <h3 className="text-4xl font-heading font-bold text-primary mb-2">500+ kg</h3>
              <p className="text-charcoal font-semibold uppercase tracking-widest text-sm">CO₂ Saved</p>
            </div>
            <div className="indian-arch bg-white/80 backdrop-blur-md p-8 text-center hover:-translate-y-2 transition-transform duration-300 delay-200">
              <h3 className="text-4xl font-heading font-bold text-accent mb-2">50+</h3>
              <p className="text-charcoal font-semibold uppercase tracking-widest text-sm">Partners</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-24 px-6 border-y border-cream-dark relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">How It Works</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
              <p className="text-charcoal-light max-w-2xl mx-auto text-lg">Seamlessly transforming surplus food into smiles in three easy steps.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="group relative indian-border bg-cream p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-primary-light/20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border border-primary/20">
                  📸
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-3">Snap & Share</h3>
                <p className="text-charcoal-light leading-relaxed">
                  Take a photo of surplus food. Our AI instantly analyzes type, weight, and veg/non-veg category.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="group relative indian-border bg-cream p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-secondary-light/20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border border-secondary/20">
                  🤖
                </div>
                <h3 className="text-2xl font-heading font-bold text-secondary mb-3">Smart Matching</h3>
                <p className="text-charcoal-light leading-relaxed">
                  Our engine instantly pairs your donation with the nearest shelter matching food preferences.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="group relative indian-border bg-cream p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-accent-light/20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border border-accent/20">
                  🚗
                </div>
                <h3 className="text-2xl font-heading font-bold text-accent mb-3">Swift Delivery</h3>
                <p className="text-charcoal-light leading-relaxed">
                  Volunteer drivers pick up and deliver the warm food directly to those in need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA / Roles Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">Join the Movement</h2>
          <div className="w-16 h-1 bg-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-charcoal-light max-w-2xl mx-auto mb-16 text-lg">
            Whether you have surplus food, need provisions, or have time to drive — there's a place for you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/signup?role=DONOR" className="block group">
              <div className="indian-arch bg-white p-10 h-full border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-xl">
                <div className="text-6xl mb-6">🏪</div>
                <h3 className="text-3xl font-heading font-bold text-charcoal mb-3 group-hover:text-primary transition-colors">I'm a Donor</h3>
                <p className="text-charcoal-light mb-8">Restaurants, caterers, and events looking to donate surplus food.</p>
                <div className="text-primary font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  Sign up as Donor <span>→</span>
                </div>
              </div>
            </Link>
            
            <Link href="/signup?role=SHELTER" className="block group">
              <div className="indian-arch bg-white p-10 h-full border-2 border-transparent group-hover:border-secondary transition-all duration-300 shadow-sm group-hover:shadow-xl">
                <div className="text-6xl mb-6">🏠</div>
                <h3 className="text-3xl font-heading font-bold text-charcoal mb-3 group-hover:text-secondary transition-colors">I'm a Shelter</h3>
                <p className="text-charcoal-light mb-8">NGOs, orphanages, and community kitchens in need of food provisions.</p>
                <div className="text-secondary font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  Sign up as Shelter <span>→</span>
                </div>
              </div>
            </Link>
            
            <Link href="/signup?role=DRIVER" className="block group">
              <div className="indian-arch bg-white p-10 h-full border-2 border-transparent group-hover:border-accent transition-all duration-300 shadow-sm group-hover:shadow-xl">
                <div className="text-6xl mb-6">🚗</div>
                <h3 className="text-3xl font-heading font-bold text-charcoal mb-3 group-hover:text-accent transition-colors">I'm a Driver</h3>
                <p className="text-charcoal-light mb-8">Volunteers willing to pick up and deliver food between locations.</p>
                <div className="text-accent font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  Sign up as Driver <span>→</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-cream py-12 px-6 text-center mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-gold) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-2xl font-heading font-bold text-primary-light flex items-center gap-2">
            <span>🍲</span> ServeAnn
          </div>
          
          <div className="flex gap-8 text-sm font-semibold tracking-wider uppercase">
            <Link href="#" className="hover:text-gold transition-colors">About</Link>
            <Link href="/impact" className="hover:text-gold transition-colors">Impact</Link>
            <Link href="/login" className="hover:text-gold transition-colors">Login</Link>
          </div>
          
          <div className="text-sm text-cream-dark">
            Made with <span className="text-accent-light text-lg">❤️</span> for India
          </div>
        </div>
      </footer>
    </div>
  );
}
