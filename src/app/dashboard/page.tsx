import { DashStats } from "@/app/dashboard/(components)/DashStats";
import { PendingNurses } from "@/app/dashboard/(components)/PendingNurses";
import { EstimatedSubscriptionCost } from "@/app/dashboard/(components)/EstimatedSubscriptionCost";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back! Here's what's happening with your healthcare team.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <DashStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PendingNurses />
        <EstimatedSubscriptionCost />
      </div>
    </div>
  );
}