"use client";

import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

export default function DonorDashboard() {
  const currentUser = useStore((state) => state.currentUser);
  const donations = useStore((state) => state.donations);
  const organizations = useStore((state) => state.organizations);

  // Find the donor's organization
  const myOrg = organizations.find(o => o.ownerId === currentUser?.id);
  const myDonations = donations.filter(d => d.donorOrgId === myOrg?.id);

  // Calculate stats
  const deliveredDonations = myDonations.filter(d => d.status === 'delivered');
  const totalWeight = myDonations.reduce((acc, d) => acc + d.estimatedLbs, 0);
  const mealsProvided = Math.round(totalWeight * 1.2);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="warning">Pending</Badge>;
      case "matched": return <Badge variant="info">Matched</Badge>;
      case "claimed": return <Badge variant="default">Claimed</Badge>;
      case "delivered": return <Badge variant="success">Delivered</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Welcome back, {currentUser?.name?.split(' ')[0] || 'Donor'}! 👋</h1>
          <p className="text-charcoal-light mt-1">Ready to rescue some food today?</p>
        </div>
        <Link href="/dashboard/donor/new">
          <Button variant="primary" size="lg" className="shadow-lg shadow-primary/20">
            <span className="mr-2">📸</span> New Donation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="border border-cream-dark">
          <p className="text-sm font-medium text-charcoal-light mb-1">Total Donations</p>
          <p className="text-3xl font-bold text-primary">{myDonations.length}</p>
        </Card>
        <Card padding="md" className="border border-cream-dark">
          <p className="text-sm font-medium text-charcoal-light mb-1">Lbs Rescued</p>
          <p className="text-3xl font-bold text-secondary">{totalWeight.toFixed(1)}</p>
        </Card>
        <Card padding="md" className="border border-cream-dark">
          <p className="text-sm font-medium text-charcoal-light mb-1">Meals Provided</p>
          <p className="text-3xl font-bold text-accent">{mealsProvided}</p>
        </Card>
        <Card padding="md" className="border border-cream-dark">
          <p className="text-sm font-medium text-charcoal-light mb-1">Impact Score</p>
          <p className="text-3xl font-bold text-gold">{(mealsProvided * 1.5).toFixed(0)}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-charcoal mb-4">Recent Donations</h2>

        {myDonations.length === 0 ? (
          <Card padding="lg" className="text-center border-dashed border-2 border-cream-dark bg-cream/50">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-lg font-medium text-charcoal mb-1">No donations yet</h3>
            <p className="text-charcoal-light mb-4">Your rescued food will appear here.</p>
            <Link href="/dashboard/donor/new">
              <Button variant="outline" size="sm">Make your first donation</Button>
            </Link>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-cream-dark shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream/50 border-b border-cream-dark">
                    <th className="p-4 text-sm font-semibold text-charcoal-light">Food Type</th>
                    <th className="p-4 text-sm font-semibold text-charcoal-light">Type</th>
                    <th className="p-4 text-sm font-semibold text-charcoal-light">Weight</th>
                    <th className="p-4 text-sm font-semibold text-charcoal-light">Status</th>
                    <th className="p-4 text-sm font-semibold text-charcoal-light">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {myDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(donation => (
                    <tr key={donation.id} className="hover:bg-cream/20 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-charcoal">{donation.foodType}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${donation.foodCategory === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <span className={`w-2 h-2 rounded-full ${donation.foodCategory === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {donation.foodCategory === 'veg' ? 'Veg' : 'Non-veg'}
                        </span>
                      </td>
                      <td className="p-4 text-charcoal-light">
                        {donation.estimatedLbs} lbs
                      </td>
                      <td className="p-4">
                        {getStatusBadge(donation.status)}
                      </td>
                      <td className="p-4 text-charcoal-light text-sm">
                        {donation.createdAt ? formatRelativeTime(donation.createdAt) : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
