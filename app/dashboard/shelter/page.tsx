"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRelativeTime, calculateDistance } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function ShelterDashboard() {
  const { currentUser, organizations, matches, getDonationById, getOrganizationById, getUserById } = useStore();
  const [acceptingDonations, setAcceptingDonations] = useState(true);

  if (!currentUser || currentUser.role !== 'shelter') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <p className="text-charcoal">Loading shelter dashboard...</p>
      </div>
    );
  }

  const currentOrg = organizations.find((o) => o.ownerId === currentUser.id);

  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <p className="text-charcoal">No organization found for this user.</p>
      </div>
    );
  }

  const shelterMatches = matches.filter((m) => m.shelterOrgId === currentOrg.id);
  const totalReceived = shelterMatches.filter(m => m.status === 'completed').length;
  
  // Calculate this week's intake (mock logic based on dates)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekMatches = shelterMatches.filter(
    m => m.status === 'completed' && new Date(m.createdAt) >= oneWeekAgo
  );
  
  const thisWeekIntakeLbs = thisWeekMatches.reduce((total, m) => {
    const donation = getDonationById(m.donationId);
    return total + (donation?.estimatedLbs || 0);
  }, 0);

  const capacityPercentage = Math.min((currentOrg.currentCapacityLbs / currentOrg.maxCapacityLbs) * 100, 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'awaiting_driver': return <Badge variant="warning">Awaiting Driver</Badge>;
      case 'in_transit': return <Badge variant="info">In Transit</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-cream p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gold-light">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Welcome, {currentOrg.name}</h1>
            <p className="text-charcoal-light mt-1">Manage your incoming food donations.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-charcoal">Accepting Donations</span>
            <button 
              onClick={() => setAcceptingDonations(!acceptingDonations)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${acceptingDonations ? 'bg-secondary' : 'bg-gray-300'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${acceptingDonations ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Capacity Indicator */}
        <Card variant="default" padding="lg" className="border-gold-light">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Current Capacity</h2>
          <div className="flex justify-between text-sm text-charcoal-light mb-2">
            <span>{currentOrg.currentCapacityLbs} lbs used</span>
            <span>{currentOrg.maxCapacityLbs} lbs total</span>
          </div>
          <div className="w-full bg-cream-dark h-4 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${capacityPercentage > 90 ? 'bg-accent' : 'bg-primary'}`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" padding="md" className="bg-primary-light/20 border-primary-light">
            <h3 className="text-charcoal-light text-sm font-medium">Total Received</h3>
            <p className="text-3xl font-bold text-primary-dark mt-2">{totalReceived}</p>
            <p className="text-xs text-charcoal-light mt-1">All time completed matches</p>
          </Card>
          <Card variant="glass" padding="md" className="bg-secondary-light/20 border-secondary-light">
            <h3 className="text-charcoal-light text-sm font-medium">Meals Provided</h3>
            <p className="text-3xl font-bold text-secondary-dark mt-2">
              {Math.floor(thisWeekIntakeLbs * 0.83)} {/* rough lbs to meals estimate */}
            </p>
            <p className="text-xs text-charcoal-light mt-1">From recent donations</p>
          </Card>
          <Card variant="glass" padding="md" className="bg-gold-light/20 border-gold-light">
            <h3 className="text-charcoal-light text-sm font-medium">This Week's Intake</h3>
            <p className="text-3xl font-bold text-charcoal mt-2">{thisWeekIntakeLbs} lbs</p>
            <p className="text-xs text-charcoal-light mt-1">Past 7 days</p>
          </Card>
        </div>

        {/* Incoming Matches Section */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-4">Incoming Matches</h2>
          {shelterMatches.length === 0 ? (
            <Card variant="default" padding="lg">
              <p className="text-charcoal-light text-center">No active matches at the moment.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {shelterMatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(match => {
                const donation = getDonationById(match.donationId);
                const donorOrg = donation ? getOrganizationById(donation.donorOrgId) : null;
                const driver = match.driverId ? getUserById(match.driverId) : null;
                
                let distance = 0;
                if (donation && donorOrg) {
                  distance = calculateDistance(
                    donation.pickupLocation.lat, 
                    donation.pickupLocation.lng, 
                    currentOrg.location.lat, 
                    currentOrg.location.lng
                  );
                }

                return (
                  <Card key={match.id} variant="elevated" padding="md" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg text-charcoal">
                          {donation?.estimatedLbs} lbs of {donation?.foodType}
                        </h3>
                        {donation && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${(donation as any).foodCategory === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <span className={`w-2 h-2 rounded-full ${(donation as any).foodCategory === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {(donation as any).foodCategory === 'veg' ? 'Veg' : 'Non-veg'}
                          </span>
                        )}
                        {getStatusBadge(match.status)}
                      </div>
                      
                      <p className="text-sm text-charcoal-light">
                        From: <span className="font-medium text-charcoal">{donorOrg?.name || 'Unknown Donor'}</span>
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-light">
                        <span className="flex items-center gap-1">
                          📍 {distance.toFixed(1)} km away
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ Matched {formatRelativeTime(match.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end min-w-[150px]">
                      {match.status === 'in_transit' && (
                        <div className="flex flex-col items-end">
                          <span className="flex items-center gap-2 text-secondary font-medium text-sm">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                            En Route
                          </span>
                          <span className="text-xs text-charcoal-light mt-1">Driver: {driver?.name || 'Unknown'}</span>
                        </div>
                      )}
                      {match.status === 'completed' && (
                        <div className="flex flex-col items-end text-success">
                          <span className="flex items-center gap-1 text-secondary font-medium">
                            ✅ Delivered
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
