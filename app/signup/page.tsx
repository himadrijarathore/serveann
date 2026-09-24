"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/lib/types";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const signup = useStore((state) => state.signup);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const success = signup(name, email, password, role, phone);
      if (success) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l.83.83-5.26 5.26a1 1 0 1 1-1.414-1.414l5.26-5.26-.83-.83A2 2 0 0 1 54.627 0zM27.97 0l.83.83-5.26 5.26a1 1 0 1 1-1.414-1.414l5.26-5.26-.83-.83A2 2 0 0 1 27.97 0zM1.313 0l.83.83-5.26 5.26a1 1 0 0 1-1.414-1.414l5.26-5.26-.83-.83A2 2 0 0 1 1.313 0z\\' fill=\\'%23D4772C\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')" }}></div>

      <Card variant="elevated" padding="lg" className="w-full max-w-xl relative z-10 bg-white/95 backdrop-blur">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2 mb-2">
              <span>🍲</span> ServeAnn
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Join the Movement</h1>
          <p className="text-charcoal-light text-sm mt-1">Create an account to start making an impact</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">I am joining as a...</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole("donor")}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${role === "donor" ? "border-primary bg-primary-light/10 text-primary" : "border-cream-dark hover:border-primary/50 text-charcoal"}`}
              >
                <span className="text-2xl mb-1">🏪</span>
                <span className="text-sm font-semibold">Donor</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("shelter")}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${role === "shelter" ? "border-secondary bg-secondary-light/10 text-secondary" : "border-cream-dark hover:border-secondary/50 text-charcoal"}`}
              >
                <span className="text-2xl mb-1">🏠</span>
                <span className="text-sm font-semibold">Shelter</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("driver")}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${role === "driver" ? "border-accent bg-accent-light/10 text-accent" : "border-cream-dark hover:border-accent/50 text-charcoal"}`}
              >
                <span className="text-2xl mb-1">🚗</span>
                <span className="text-sm font-semibold">Driver</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Full Name / Organization"
              type="text" 
              placeholder="e.g. Spice Route Cafe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label="Phone Number"
              type="tel" 
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <Input 
            label="Email Address"
            type="email" 
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Password"
            type="password" 
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            loading={loading}
            className="mt-6"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-charcoal-light">Already have an account? </span>
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
