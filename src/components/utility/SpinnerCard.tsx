"use client";

import { Card } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";

export function SpinnerCard() {
  return (
    <div className="min-h-[88vh] flex justify-center items-center">
      <Card className="w-12 h-12 flex justify-center items-center">
        <LoaderCircle className="animate-spin" size={24} />
      </Card>
    </div>
  );
}

