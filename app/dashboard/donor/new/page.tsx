"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { analyzeFoodImage } from "@/lib/mock-ai";
import { FoodCategory } from "@/lib/types";

export default function NewDonationPage() {
  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);
  const addDonation = useStore((state) => state.addDonation);
  const organizations = useStore((state) => state.organizations);
  const getOrganizationById = useStore((state) => state.getOrganizationById);

  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Results Form State
  const [foodType, setFoodType] = useState("");
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("veg");
  const [weight, setWeight] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [confidence, setConfidence] = useState(0);

  const [isConfirming, setIsConfirming] = useState(false);
  const [matchResult, setMatchResult] = useState<{ shelterName: string; distance: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const myOrg = organizations.find(o => o.ownerId === currentUser?.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setStep(2);

    try {
      const result = await analyzeFoodImage(imagePreview);
      setFoodType(result.foodType);
      setFoodCategory(result.foodCategory);
      setWeight(result.estimatedWeight.toString());
      setExpiryHours(result.expiryWindowHours.toString());
      setConfidence(result.confidence);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirming(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const pickupLocation = myOrg?.location || { lat: 19.076, lng: 72.8777 };
      const expiryTime = new Date(Date.now() + parseInt(expiryHours) * 3600000).toISOString();

      const donation = addDonation({
        donorOrgId: myOrg?.id || 'o1',
        foodType,
        foodCategory,
        estimatedLbs: parseFloat(weight),
        expiryTime,
        pickupLocation,
        imageUrl: imagePreview || undefined,
      });

      const latestMatches = useStore.getState().matches;
      const thisMatch = latestMatches.find(m => m.donationId === donation.id);
      if (thisMatch) {
        const shelter = getOrganizationById(thisMatch.shelterOrgId);
        setMatchResult({
          shelterName: shelter?.name || 'Nearby Shelter',
          distance: '3.2 km',
        });
      } else {
        setMatchResult({
          shelterName: 'Mumbai Food Bank',
          distance: '2.5 km',
        });
      }

      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-cream-dark -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-10" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= s ? 'bg-primary text-white border-primary-light' : 'bg-cream border-cream-dark text-charcoal-light'}`}>
            {s}
          </div>
        ))}
      </div>

      <Card variant="elevated" padding="lg" className="bg-white">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">Snap & Share</h2>
            <p className="text-charcoal-light mb-6">Upload a photo of the surplus food to get started.</p>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${imagePreview ? 'border-primary bg-primary-light/5' : 'border-cream-dark hover:border-primary/50'}`}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-cream-dark">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Food preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setImagePreview(null)}>Change Photo</Button>
                    <Button variant="primary" onClick={handleAnalyze}>Analyze with AI 🤖</Button>
                  </div>
                </div>
              ) : (
                <div className="py-10">
                  <div className="w-16 h-16 mx-auto bg-cream rounded-full flex items-center justify-center text-3xl mb-4">📸</div>
                  <p className="text-lg font-medium text-charcoal mb-1">Click to take a photo</p>
                  <p className="text-sm text-charcoal-light">or drag and drop an image here</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {isAnalyzing ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-cream-dark rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
                </div>
                <h3 className="text-xl font-bold text-charcoal">AI is analyzing your food...</h3>
                <p className="text-charcoal-light mt-2">Identifying type, estimating weight and shelf life.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirm}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-charcoal">Confirm Details</h2>
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    AI: {confidence}% Confident
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Veg / Non-Veg Selector */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Food Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFoodCategory("veg")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-medium ${foodCategory === "veg"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-cream-dark text-charcoal-light hover:border-green-300"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-600 inline-block"></span>
                        Vegetarian
                      </button>
                      <button
                        type="button"
                        onClick={() => setFoodCategory("nonveg")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-medium ${foodCategory === "nonveg"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-cream-dark text-charcoal-light hover:border-red-300"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-600 inline-block"></span>
                        Non-Vegetarian
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Food Type & Description"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    placeholder="e.g. Mixed Rice and Curry"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Estimated Weight (lbs)"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                    <Input
                      label="Safe Window (Hours)"
                      type="number"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" variant="primary" fullWidth loading={isConfirming}>
                    Confirm & Find Match
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {step === 3 && matchResult && (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 text-green-600">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">Donation Matched!</h2>
            <p className="text-lg text-charcoal-light mb-2">Your food is on its way to making a difference.</p>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full text-sm font-medium" style={{ background: foodCategory === 'veg' ? '#dcfce7' : '#fee2e2', color: foodCategory === 'veg' ? '#166534' : '#991b1b' }}>
              <span className={`w-3 h-3 rounded-full ${foodCategory === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {foodCategory === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} • {weight} lbs
            </div>

            <div className="bg-cream p-6 rounded-xl border border-cream-dark mb-8 text-left max-w-md mx-auto">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Matched With</p>
              <h3 className="text-xl font-bold text-charcoal mb-1">{matchResult.shelterName}</h3>
              <p className="text-charcoal-light flex items-center gap-2 mb-1">
                <span>📍</span> {matchResult.distance} away
              </p>
              <div className="mt-4 pt-4 border-t border-cream-dark">
                <p className="text-sm text-charcoal-light">
                  A volunteer driver has been notified and will arrive shortly to pick up the donation.
                </p>
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={() => router.push("/dashboard/donor")}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
