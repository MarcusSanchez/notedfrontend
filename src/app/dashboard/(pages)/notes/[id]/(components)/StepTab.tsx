"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, X, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HealthAndSafetyStep, Note } from '@/proto/note_pb';
import { fn } from '@/lib/utils';
import { addStep, removeStep } from '../actions';
import { step2text } from "@/lib/tools/enum2text";

export function StepsTab({ note }: { note: Note }) {
  const qc = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addStepMutation = useMutation({
    mutationKey: ["addStep", note.id],
    mutationFn: async (step: HealthAndSafetyStep) => await fn(() => addStep({ noteId: note.id, step: step }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", note.id] });
      setIsAdding(false);
    },
  });

  const removeStepMutation = useMutation({
    mutationKey: ["removeStep", note.id],
    mutationFn: async (stepId: string) => await fn(() => removeStep({ stepId: stepId }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", note.id] });
    },
  });

  const availableSteps = [
    { type: HealthAndSafetyStep.ConstantSupervision, name: 'Constant Supervision', color: 'bg-blue-100 text-blue-800' },
    { type: HealthAndSafetyStep.OneOnOneMonitoring, name: 'One-on-One Monitoring', color: 'bg-green-100 text-green-800' },
    { type: HealthAndSafetyStep.SafeStreetNavigation, name: 'Safe Street Navigation', color: 'bg-purple-100 text-purple-800' },
    { type: HealthAndSafetyStep.ProperHandHygiene, name: 'Proper Hand Hygiene', color: 'bg-orange-100 text-orange-800' },
    { type: HealthAndSafetyStep.VehicleSafetyAwareness, name: 'Vehicle Safety Awareness', color: 'bg-indigo-100 text-indigo-800' },
    { type: HealthAndSafetyStep.SafeEatingAndChokingPrevention, name: 'Safe Eating and Choking Prevention', color: 'bg-pink-100 text-pink-800' },
    { type: HealthAndSafetyStep.ProperUseOfEquipment, name: 'Proper Use of Equipment', color: 'bg-teal-100 text-teal-800' },
    { type: HealthAndSafetyStep.MedicationReminders, name: 'Medication Reminders', color: 'bg-red-100 text-red-800' },
    { type: HealthAndSafetyStep.ReinforceCommunityEtiquette, name: 'Reinforce Community Etiquette', color: 'bg-yellow-100 text-yellow-800' },
    { type: HealthAndSafetyStep.TeachingSelfAdvocacy, name: 'Teaching Self Advocacy', color: 'bg-cyan-100 text-cyan-800' },
    { type: HealthAndSafetyStep.MedicalOrDentalAppointmentAssitance, name: 'Medical or Dental Appointment Assistance', color: 'bg-emerald-100 text-emerald-800' },
    { type: HealthAndSafetyStep.HouseholdChoresAndMaintenance, name: 'Household Chores and Maintenance', color: 'bg-violet-100 text-violet-800' },
    { type: HealthAndSafetyStep.ProperShoppingAwareness, name: 'Proper Shopping Awareness', color: 'bg-rose-100 text-rose-800' }
  ].filter(step => !note.steps.some(s => s.step === step.type));

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
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Health and Safety Steps
              </CardTitle>
              <CardDescription className="text-gray-600">
                {note.steps.length} step{note.steps.length !== 1 ? 's' : ''} documented
              </CardDescription>
            </div>
          </div>

          {availableSteps.length > 0 && !isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
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
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <PlusCircle className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900">Add Health and Safety Step</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {availableSteps.map((step) => (
                <button
                  key={step.type}
                  onClick={() => addStepMutation.mutate(step.type)}
                  disabled={addStepMutation.isPending}
                  className={`p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-left group ${addStepMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                    <span className="font-medium text-gray-700 group-hover:text-purple-800 text-sm">
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
              disabled={addStepMutation.isPending}
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
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No steps documented</h3>
            <p className="text-gray-500 mb-4">
              Add health and safety steps to document the care provided.
            </p>
            {availableSteps.length > 0 && !isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
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
                key={step.id}
                className={`p-4 rounded-lg border ${getStepColor(step.step)} transition-all duration-200 hover:shadow-md relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium text-sm">{step2text(step.step)}</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-gray-600 hover:text-red-600 hover:bg-white hover:border-red-200 bg-white/80"
                        disabled={removeStepMutation.isPending}
                      >
                        {removeStepMutation.isPending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Step</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this health and safety step? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeStepMutation.mutate(step.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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