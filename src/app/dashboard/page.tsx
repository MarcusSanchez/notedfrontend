import { DashStats } from "@/app/dashboard/(components)/DashStats";
import { PendingNurses } from "@/app/dashboard/(components)/PendingNurses";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";
import { EstimatedSubscriptionCost } from "@/app/dashboard/(components)/EstimatedSubscriptionCost";
import { Viewport } from "next";

export const viewport: Viewport = {
  initialScale: 0.68,
};

export default function Dashboard() {
  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Dashboard</h1>
      <DashStats />
      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-2">
        <PendingNurses />
        <EstimatedSubscriptionCost />
      </div>
    </DashboardContainer>
  );
}