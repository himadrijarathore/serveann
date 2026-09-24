"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatRelativeTime, lbsToMeals, lbsToKgCO2 } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Simple Counter component for animations
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutExpo function for smooth ending
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    
    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function ImpactPage() {
  const { getImpactStats, matches, getDonationById, getOrganizationById } = useStore();
  const stats = getImpactStats();

  // Get 5 most recent completed deliveries for the feed
  const recentDeliveries = [...matches]
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const treesPlanted = Math.floor(stats.co2Diverted / 22);
  const carTripsSaved = Math.floor(stats.co2Diverted / 4.6);
  const waterBathtubs = Math.floor(stats.totalLbsRescued * 1.5); // completely arbitrary fun fact metric

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Paisley/Mandala-inspired decorative bg */}
      <section className="relative overflow-hidden bg-primary py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          {/* Abstract mandala-ish shapes */}
          <div className="absolute -top-20 -left-20 w-64 h-64 border-[40px] border-accent rounded-full opacity-20"></div>
          <div className="absolute -bottom-32 -right-20 w-80 h-80 border-[30px] border-gold rounded-full opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            Our Collective Impact
          </h1>
          <p className="text-xl md:text-2xl text-cream-dark font-medium max-w-2xl mx-auto">
            Every meal rescued makes a difference. Together, we're building a sustainable future and fighting food insecurity.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="arch" padding="lg" className="border-t-4 border-t-primary text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-charcoal-light font-semibold uppercase tracking-wider text-sm mb-2">Meals Provided</h3>
            <p className="text-4xl font-heading font-bold text-primary-dark">
              <AnimatedCounter end={stats.mealsProvided} />
            </p>
          </Card>
          
          <Card variant="arch" padding="lg" className="border-t-4 border-t-secondary text-center">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="text-charcoal-light font-semibold uppercase tracking-wider text-sm mb-2">CO₂ Diverted</h3>
            <p className="text-4xl font-heading font-bold text-secondary-dark">
              <AnimatedCounter end={stats.co2Diverted} suffix=" kg" />
            </p>
          </Card>
          
          <Card variant="arch" padding="lg" className="border-t-4 border-t-gold text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-charcoal-light font-semibold uppercase tracking-wider text-sm mb-2">Food Rescued</h3>
            <p className="text-4xl font-heading font-bold text-charcoal">
              <AnimatedCounter end={stats.totalLbsRescued} suffix=" lbs" />
            </p>
          </Card>

          <Card variant="arch" padding="lg" className="text-center bg-white/90 backdrop-blur border-t-4 border-t-transparent hover:border-t-primary transition-all">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="text-charcoal-light font-semibold text-sm">Total Donations</h3>
            <p className="text-2xl font-heading font-bold text-charcoal"><AnimatedCounter end={stats.totalDonations} /></p>
          </Card>

          <Card variant="arch" padding="lg" className="text-center bg-white/90 backdrop-blur border-t-4 border-t-transparent hover:border-t-secondary transition-all">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="text-charcoal-light font-semibold text-sm">Active Shelters</h3>
            <p className="text-2xl font-heading font-bold text-charcoal"><AnimatedCounter end={stats.activeShelters} /></p>
          </Card>

          <Card variant="arch" padding="lg" className="text-center bg-white/90 backdrop-blur border-t-4 border-t-transparent hover:border-t-accent transition-all">
            <div className="text-3xl mb-2">🚗</div>
            <h3 className="text-charcoal-light font-semibold text-sm">Active Drivers</h3>
            <p className="text-2xl font-heading font-bold text-charcoal"><AnimatedCounter end={stats.activeDrivers} /></p>
          </Card>
        </div>
      </section>

      {/* Fun Facts / Equivalencies */}
      <section className="bg-secondary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold">That's equivalent to...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">🌳</div>
              <p className="text-3xl font-bold mb-2"><AnimatedCounter end={treesPlanted} /></p>
              <p className="text-cream-dark">Trees planted and grown for 10 years</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🚙</div>
              <p className="text-3xl font-bold mb-2"><AnimatedCounter end={carTripsSaved} /></p>
              <p className="text-cream-dark">Passenger car trips saved</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🛁</div>
              <p className="text-3xl font-bold mb-2"><AnimatedCounter end={waterBathtubs} /></p>
              <p className="text-cream-dark">Bathtubs of fresh water conserved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity & CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-2">
            <span>✨</span> Live Rescue Feed
          </h2>
          <div className="space-y-4">
            {recentDeliveries.length === 0 ? (
              <p className="text-charcoal-light italic">No recent deliveries to show.</p>
            ) : (
              recentDeliveries.map(match => {
                const donation = getDonationById(match.donationId);
                const donor = getOrganizationById(donation?.donorOrgId || '');
                const shelter = getOrganizationById(match.shelterOrgId);
                
                return (
                  <div key={match.id} className="bg-white p-4 rounded-xl shadow-sm border border-gold-light flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-secondary-light/20 flex items-center justify-center text-secondary shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-charcoal font-medium leading-snug">
                        <span className="font-bold text-primary-dark">{donor?.name}</span> donated{' '}
                        <span className="font-bold">{donation?.estimatedLbs} lbs</span> of {donation?.foodType} to{' '}
                        <span className="font-bold text-secondary-dark">{shelter?.name}</span>
                      </p>
                      <p className="text-xs text-charcoal-light mt-1">{formatRelativeTime(match.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CTA */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-6">Want to make a difference?</h2>
          <div className="grid gap-4">
            <Card variant="glass" padding="md" className="border-primary-light bg-primary-light/10 hover:bg-primary-light/20 transition flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-charcoal mb-1">Become a Donor</h3>
                <p className="text-sm text-charcoal-light">Have excess food? We'll pick it up.</p>
              </div>
              <Link href="/signup">
                <Button variant="primary">Donate</Button>
              </Link>
            </Card>

            <Card variant="glass" padding="md" className="border-secondary-light bg-secondary-light/10 hover:bg-secondary-light/20 transition flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-charcoal mb-1">Volunteer to Drive</h3>
                <p className="text-sm text-charcoal-light">Got a car? Help transport food.</p>
              </div>
              <Link href="/signup">
                <Button variant="secondary">Volunteer</Button>
              </Link>
            </Card>

            <Card variant="glass" padding="md" className="border-accent-light bg-accent-light/10 hover:bg-accent-light/20 transition flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-charcoal mb-1">Partner as Shelter</h3>
                <p className="text-sm text-charcoal-light">Receive fresh food for your community.</p>
              </div>
              <Link href="/signup">
                <Button variant="outline">Partner</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
