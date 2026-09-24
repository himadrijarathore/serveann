"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  // Get the store login function. (Assuming useStore is the default export or named export for Zustand)
  const login = useStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      const success = login(email, password);
      
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Paisley background hint */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l.83.83-5.26 5.26a1 1 0 1 1-1.414-1.414l5.26-5.26-.83-.83A2 2 0 0 1 54.627 0zM27.97 0l.83.83-5.26 5.26a1 1 0 1 1-1.414-1.414l5.26-5.26-.83-.83A2 2 0 0 1 27.97 0zM1.313 0l.83.83-5.26 5.26a1 1 0 0 1-1.414-1.414l5.26-5.26-.83-.83A2 2 0 0 1 1.313 0z\\' fill=\\'%23D4772C\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')" }}></div>

      <Card variant="elevated" padding="lg" className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2 mb-2">
              <span>🍲</span> ServeAnn
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Welcome Back</h1>
          <p className="text-charcoal-light text-sm mt-1">Sign in to continue rescuing food</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email Address"
            type="email" 
            placeholder="donor@serveann.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error || undefined}
          />
          
          <Input 
            label="Password"
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error || undefined}
            helperText={error}
          />

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            loading={loading}
            className="mt-6"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-charcoal-light bg-cream p-3 rounded-lg border border-cream-dark">
          <span className="font-medium text-charcoal">Demo:</span> donor@serveann.com / demo123
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-charcoal-light">Don't have an account? </span>
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
