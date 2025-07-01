"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { User, Calendar, FileText, CalendarMinus as VenusAndMars } from 'lucide-react';
import { UpdatePatientDialog } from './UpdatePatientDialog';
import { DeletePatientDialog } from './DeletePatientDialog';
import { sex2text } from '@/lib/tools/enum2text';
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { Patient } from '@/proto/patient_pb';

export function PatientInformation({ patient }: { patient: Patient }) {
  return (
    <Card className="w-full mx-auto mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                First Name
              </Label>
              <Input
                id="firstName"
                value={patient.firstName}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                Last Name
              </Label>
              <Input
                id="lastName"
                value={patient.lastName}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>

          {/* Additional Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lastMonthlyTalk" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-green-50 rounded-md flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                Last Monthly Talk
              </Label>
              <Input
                id="lastMonthlyTalk"
                value={
                  patient.lastMonthlyTalk
                    ? timestamp2date(patient.lastMonthlyTalk).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : "No monthly talk date provided."
                }
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-50 rounded-md flex items-center justify-center">
                  <VenusAndMars className="w-4 h-4 text-orange-600" />
                </div>
                Sex
              </Label>
              <Input
                id="sex"
                value={sex2text(patient.sex)}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>

          {/* Maladaptive Behaviors */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Checkbox
              id="maladaptiveBehaviors"
              checked={patient.hasMaladaptiveBehaviors}
              disabled
            />
            <Label htmlFor="maladaptiveBehaviors" className="text-sm font-semibold text-gray-700">
              This patient exhibits maladaptive behaviors
            </Label>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-50 rounded-md flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              Additional Information
            </Label>
            <Textarea
              id="additionalInfo"
              value={patient.additionalInformation || "No additional information provided."}
              rows={4}
              readOnly
              className={`bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 ${!patient.additionalInformation && 'text-gray-500'}`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end mt-8 gap-3">
          <UpdatePatientDialog patient={patient} />
          <DeletePatientDialog patient={patient} />
        </div>
      </CardContent>
    </Card>
  );
}