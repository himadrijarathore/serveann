'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import Button from '../ui/Button';

export default function Navbar() {
  const { currentUser, logout, getUserNotifications } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const notifications = currentUser ? getUserNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const NavLinks = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'donor':
        return (
          <>
            <Link href="/donate" className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium px-3 py-2 rounded-md transition-colors">Donate Food</Link>
            <Link href="/dashboard" className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium px-3 py-2 rounded-md transition-colors">My Dashboard</Link>
          </>
        );
      case 'shelter':
        return (
          <>
            <Link href="/incoming" className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium px-3 py-2 rounded-md transition-colors">Incoming Deliveries</Link>
            <Link href="/inventory" className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium px-3 py-2 rounded-md transition-colors">Inventory</Link>
          </>
        );
      case 'driver':
        return (
          <>
            <Link href="/deliveries" className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium px-3 py-2 rounded-md transition-colors">Available Deliveries</Link>
            <Link href="/history" className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium px-3 py-2 rounded-md transition-colors">History</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-cream)] border-b border-[var(--color-cream-dark)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="text-xl font-bold text-[var(--color-charcoal)] tracking-tight">Serve<span className="text-[var(--color-primary)]">Ann</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLinks />
            
            {!currentUser ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-500 hover:text-[var(--color-primary)] focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none gap-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-white font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden lg:block">{currentUser.name}</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)]"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-inner">
            <div className="flex flex-col space-y-2 pb-4">
              <NavLinks />
            </div>
            
            {!currentUser ? (
              <div className="flex flex-col space-y-2 mt-4 border-t border-gray-200 pt-4">
                <Link href="/login" className="block w-full">
                  <Button variant="ghost" fullWidth>Login</Button>
                </Link>
                <Link href="/signup" className="block w-full">
                  <Button variant="primary" fullWidth>Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg">
                      {currentUser.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize">{currentUser.role}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Profile</Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
