"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, X } from "lucide-react";
import { useNoteStore } from "@/lib/state";
import { HealthAndSafetyStep } from "@/proto/note_pb";
import { step2text } from "@/lib/tools/enum2text";

export function CreateNoteSteps() {
  const { note, setNote } = useNoteStore();
  const [isAdding, setIsAdding] = useState(false);

  const availableSteps = [
    { type: HealthAndSafetyStep.ConstantSupervision, name: 'Constant Supervision', color: 'bg-blue-100 text-blue-800' },
    {
      type: HealthAndSafetyStep.OneOnOneMonitoring,
      name: 'One-on-One Monitoring',
      color: 'bg-green-100 text-green-800'
    },
    {
      type: HealthAndSafetyStep.SafeStreetNavigation,
      name: 'Safe Street Navigation',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: HealthAndSafetyStep.ProperHandHygiene,
      name: 'Proper Hand Hygiene',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      type: HealthAndSafetyStep.VehicleSafetyAwareness,
      name: 'Vehicle Safety Awareness',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      type: HealthAndSafetyStep.SafeEatingAndChokingPrevention,
      name: 'Safe Eating and Choking Prevention',
      color: 'bg-pink-100 text-pink-800'
    },
    {
      type: HealthAndSafetyStep.ProperUseOfEquipment,
      name: 'Proper Use of Equipment',
      color: 'bg-teal-100 text-teal-800'
    },
    { type: HealthAndSafetyStep.MedicationReminders, name: 'Medication Reminders', color: 'bg-red-100 text-red-800' },
    {
      type: HealthAndSafetyStep.ReinforceCommunityEtiquette,
      name: 'Reinforce Community Etiquette',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      type: HealthAndSafetyStep.TeachingSelfAdvocacy,
      name: 'Teaching Self Advocacy',
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      type: HealthAndSafetyStep.MedicalOrDentalAppointmentAssitance,
      name: 'Medical or Dental Appointment Assistance',
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      type: HealthAndSafetyStep.HouseholdChoresAndMaintenance,
      name: 'Household Chores and Maintenance',
      color: 'bg-violet-100 text-violet-800'
    },
    {
      type: HealthAndSafetyStep.ProperShoppingAwareness,
      name: 'Proper Shopping Awareness',
      color: 'bg-rose-100 text-rose-800'
    }
  ].filter(step => !note.steps.includes(step.type));

  const handleAddStep = (stepType: HealthAndSafetyStep) => {
    setNote(n => ({ ...n, steps: [...n.steps, stepType] }));
    setIsAdding(false);
  };

  const handleRemoveStep = (stepType: HealthAndSafetyStep) => {
    setNote(n => ({ ...n, steps: n.steps.filter(s => s !== stepType) }));
  };

  const getStepColor = (stepType: HealthAndSafetyStep) => {
    const colorMap = {
      [HealthAndSafetyStep.ConstantSupervision.toString()]: 'bg-blue-100 text-blue-800 border-blue-200',
      [HealthAndSafetyStep.OneOnOneMonitoring.toString()]: 'bg-green-100 text-green-800 border-green-200',
      [HealthAndSafetyStep.SafeStreetNavigation.toString()]: 'bg-purple-100 text-purple-800 border-purple-200',
      [HealthAndSafetyStep.ProperHandHygiene.toString()]: 'bg-orange-100 text-orange-800 border-orange-200',
      [HealthAndSafetyStep.VehicleSafetyAwareness.toString()]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      [HealthAndSafetyStep.SafeEatingAndChokingPrevention.toString()]: 'bg-pink-100 text-pink-800 border-pink-200',
      [HealthAndSafetyStep.ProperUseOfEquipment.toString()]: 'bg-teal-100 text-teal-800 border-teal-200',
      [HealthAndSafetyStep.MedicationReminders.toString()]: 'bg-red-100 text-red-800 border-red-200',
      [HealthAndSafetyStep.ReinforceCommunityEtiquette.toString()]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [HealthAndSafetyStep.TeachingSelfAdvocacy.toString()]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      [HealthAndSafetyStep.MedicalOrDentalAppointmentAssitance.toString()]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      [HealthAndSafetyStep.HouseholdChoresAndMaintenance.toString()]: 'bg-violet-100 text-violet-800 border-violet-200',
      [HealthAndSafetyStep.ProperShoppingAwareness.toString()]: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colorMap[stepType.toString()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Health and Safety Steps
              </CardTitle>
              <CardDescription className="text-gray-600">
                What steps were taken to ensure the health and safety of the consumer? List at least one step taken.
              </CardDescription>
            </div>
          </div>

          {availableSteps.length > 0 && !isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Add Step Section */}
        {isAdding && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-emerald-900">Add Health and Safety Step</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {availableSteps.map((step) => (
                <button
                  key={step.type}
                  onClick={() => handleAddStep(step.type)}
                  className={`p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 text-left group`}
                >
                  <div className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                    <span className="font-medium text-gray-700 group-hover:text-emerald-800 text-sm">
                      {step.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={() => setIsAdding(false)}
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}

        {/* Steps List */}
        {note.steps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No steps added</h3>
            <p className="text-gray-500 mb-4">
              Add health and safety steps to document the care provided.
            </p>
            {availableSteps.length > 0 && !isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add First Step
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {note.steps.map((step) => (
              <div
                key={step}
                className={`p-4 rounded-lg border ${getStepColor(step)} transition-all duration-200 hover:shadow-md relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">{step2text(step)}</span>
                  </div>
                  <Button
                    onClick={() => handleRemoveStep(step)}
                    size="sm"
                    variant="outline"
                    className="border-white text-gray-600 hover:text-red-600 hover:bg-white hover:border-red-200 bg-white/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {availableSteps.length === 0 && note.steps.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">All available health and safety steps have been added.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}