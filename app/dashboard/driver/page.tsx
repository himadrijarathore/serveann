"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRelativeTime, calculateDistance } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function DriverDashboard() {
  const { 
    currentUser, 
    matches, 
    getUserNotifications, 
    markNotificationRead,
    claimMatch,
    completeDelivery,
    getDonationById,
    getOrganizationById
  } = useStore();
  
  const [isAvailable, setIsAvailable] = useState(true);

  if (!currentUser || currentUser.role !== 'driver') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <p className="text-charcoal">Loading driver dashboard...</p>
      </div>
    );
  }

  // Derived state
  const notifications = getUserNotifications(currentUser.id).filter(n => !n.read);
  const availableRoutes = matches.filter(m => m.status === 'awaiting_driver');
  const activeDeliveries = matches.filter(m => m.driverId === currentUser.id && m.status === 'in_transit');
  const completedDeliveries = matches.filter(m => m.driverId === currentUser.id && m.status === 'completed');

  const handleClaim = (matchId: string) => {
    claimMatch(matchId, currentUser.id);
  };

  const handleComplete = (matchId: string) => {
    completeDelivery(matchId);
  };

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-light flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal">Hi, {currentUser.name} 🚗</h1>
            <p className="text-charcoal-light mt-1">Ready to make a difference today?</p>
          </div>
          <div className="flex items-center gap-3 bg-cream p-2 rounded-xl">
            <span className="text-sm font-medium text-charcoal">Available for Deliveries</span>
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${isAvailable ? 'bg-secondary' : 'bg-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white absolute transition-transform ${isAvailable ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card variant="glass" padding="md" className="bg-primary/10 border-primary-light">
            <h3 className="text-charcoal-light text-xs font-semibold uppercase tracking-wider">Total Deliveries</h3>
            <p className="text-2xl font-bold text-primary-dark mt-1">{completedDeliveries.length}</p>
          </Card>
          <Card variant="glass" padding="md" className="bg-secondary/10 border-secondary-light">
            <h3 className="text-charcoal-light text-xs font-semibold uppercase tracking-wider">Active Routes</h3>
            <p className="text-2xl font-bold text-secondary-dark mt-1">{activeDeliveries.length}</p>
          </Card>
          <Card variant="glass" padding="md" className="bg-gold/10 border-gold-light col-span-2 md:col-span-1">
            <h3 className="text-charcoal-light text-xs font-semibold uppercase tracking-wider">Distance Covered</h3>
            <p className="text-2xl font-bold text-charcoal mt-1">
              {/* Mock distance calculation for completed */}
              {Math.floor(completedDeliveries.length * 4.5)} km
            </p>
          </Card>
        </div>

        {/* SMS Notifications Section */}
        {notifications.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              <span>🔔</span> New Alerts
            </h2>
            <div className="flex flex-col gap-3">
              {notifications.map(note => (
                <div key={note.id} className="bg-[#E5E5EA] text-black p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%] md:max-w-[60%] shadow-sm relative group">
                  <p className="text-sm">{note.message}</p>
                  <p className="text-[10px] text-gray-500 mt-2 text-right">{formatRelativeTime(note.createdAt)}</p>
                  <button 
                    onClick={() => markNotificationRead(note.id)}
                    className="absolute -right-2 -top-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 hidden group-hover:block text-xs"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Active Deliveries Section */}
        {activeDeliveries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-charcoal border-b border-gold-light pb-2">My Active Deliveries</h2>
            <div className="grid gap-6">
              {activeDeliveries.map(match => {
                const donation = getDonationById(match.donationId);
                const donorOrg = getOrganizationById(donation?.donorOrgId || '');
                const shelterOrg = getOrganizationById(match.shelterOrgId);
                
                return (
                  <Card key={match.id} variant="elevated" padding="lg" className="border-secondary-light">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge variant="info">In Transit</Badge>
                          <span className="text-sm font-semibold text-charcoal">{donation?.estimatedLbs} lbs {donation?.foodType}</span>
                        </div>
                        
                        <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
                          <div className="relative">
                            <span className="absolute -left-6 top-0 text-xl">🏬</span>
                            <p className="text-xs text-charcoal-light font-semibold uppercase">Pickup</p>
                            <p className="font-medium text-charcoal">{donorOrg?.name}</p>
                            <p className="text-sm text-charcoal-light">{donorOrg?.address}</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-6 top-0 text-xl">🏠</span>
                            <p className="text-xs text-charcoal-light font-semibold uppercase">Dropoff</p>
                            <p className="font-medium text-charcoal">{shelterOrg?.name}</p>
                            <p className="text-sm text-charcoal-light">{shelterOrg?.address}</p>
                          </div>
                        </div>

                        <Button 
                          variant="secondary" 
                          fullWidth 
                          onClick={() => handleComplete(match.id)}
                        >
                          Mark Delivered
                        </Button>
                      </div>
                      
                      {/* Simple Map Placeholder */}
                      <div className="w-full md:w-48 h-40 bg-cream-dark rounded-xl flex items-center justify-center relative overflow-hidden border border-gold-light">
                        <div className="absolute top-4 left-4 text-2xl animate-bounce">📍</div>
                        <div className="absolute bottom-4 right-4 text-2xl">🏁</div>
                        <svg className="absolute w-full h-full p-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M10,10 Q50,90 90,90" fill="none" stroke="#2D6A4F" strokeWidth="3" strokeDasharray="5,5" />
                        </svg>
                        <span className="bg-white/80 px-2 py-1 rounded text-xs font-semibold text-secondary z-10">Live Route</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Routes Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-charcoal border-b border-gold-light pb-2">Available Routes</h2>
          {availableRoutes.length === 0 ? (
            <p className="text-charcoal-light italic">No available routes at the moment. Check back soon!</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availableRoutes.map(match => {
                const donation = getDonationById(match.donationId);
                const donorOrg = getOrganizationById(donation?.donorOrgId || '');
                const shelterOrg = getOrganizationById(match.shelterOrgId);
                
                let distance = 0;
                if (donation && shelterOrg) {
                  distance = calculateDistance(
                    donation.pickupLocation.lat, donation.pickupLocation.lng,
                    shelterOrg.location.lat, shelterOrg.location.lng
                  );
                }
                const estMinutes = Math.round((distance / 30) * 60);

                return (
                  <Card key={match.id} variant="default" padding="md" className="hover:border-primary transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="warning">New Route</Badge>
                        <span className="text-xs font-bold text-accent">{distance.toFixed(1)} km</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm"><span className="text-charcoal-light">From:</span> <span className="font-medium text-charcoal">{donorOrg?.name}</span></p>
                        <p className="text-sm"><span className="text-charcoal-light">To:</span> <span className="font-medium text-charcoal">{shelterOrg?.name}</span></p>
                        <p className="text-sm"><span className="text-charcoal-light">Cargo:</span> <span className="font-medium text-charcoal">{donation?.estimatedLbs} lbs {donation?.foodType}</span></p>
                        {donation && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${(donation as any).foodCategory === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <span className={`w-2 h-2 rounded-full ${(donation as any).foodCategory === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {(donation as any).foodCategory === 'veg' ? 'Veg' : 'Non-veg'}
                          </span>
                        )}
                        <p className="text-xs text-charcoal-light mt-2 flex items-center gap-1">
                          ⏱️ ~{estMinutes || 15} mins est. driving time
                        </p>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth onClick={() => handleClaim(match.id)}>
                      Claim Route
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Deliveries Section */}
        {completedDeliveries.length > 0 && (
          <div className="space-y-4 pt-4">
            <details className="group bg-white rounded-xl border border-gold-light [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 font-semibold text-charcoal cursor-pointer">
                <span>Completed Deliveries ({completedDeliveries.length})</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="p-4 border-t border-cream-dark space-y-3">
                {completedDeliveries.slice(0, 5).map(match => {
                  const donation = getDonationById(match.donationId);
                  const shelterOrg = getOrganizationById(match.shelterOrgId);
                  return (
                    <div key={match.id} className="flex justify-between items-center text-sm p-2 hover:bg-cream rounded">
                      <div>
                        <p className="font-medium text-charcoal">To {shelterOrg?.name}</p>
                        <p className="text-xs text-charcoal-light">{donation?.estimatedLbs} lbs of {donation?.foodType}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-success font-bold text-lg">✓</span>
                        <p className="text-xs text-charcoal-light">{formatRelativeTime(match.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                {completedDeliveries.length > 5 && (
                  <p className="text-center text-xs text-charcoal-light pt-2">+ {completedDeliveries.length - 5} more</p>
                )}
              </div>
            </details>
          </div>
        )}

      </div>
    </div>
  );
}
