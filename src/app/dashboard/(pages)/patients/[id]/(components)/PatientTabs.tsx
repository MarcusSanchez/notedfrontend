"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Target,
  Heart,
  Stethoscope,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
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
import { DiagnosisType, Goal, Patient, ServiceType } from '@/proto/patient_pb';
import { diagnosis2text, service2text } from "@/lib/tools/enum2text";
import {
  addDiagnosis,
  addGoal,
  addService,
  removeDiagnosis,
  removeGoal,
  removeService,
  updateGoal
} from '../../../nurses/[id]/actions';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { fn } from '@/lib/utils';

export function PatientTabs({ patient }: { patient: Patient }) {
  return (
    <div className="w-full mb-6">
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="goals"
            className="font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Heart className="w-4 h-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger
            value="diagnoses"
            className="font-semibold data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Diagnoses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-0">
          <GoalsTab patient={patient} />
        </TabsContent>

        <TabsContent value="services" className="space-y-0">
          <ServicesTab patient={patient} />
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-0">
          <DiagnosesTab patient={patient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GoalsTab({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [goalDescription, setGoalDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedGoalDescription, setUpdatedGoalDescription] = useState('');

  const addGoalMutation = useMutation({
    mutationKey: ["addGoal", patient.id, goalDescription],
    mutationFn: fn(() => addGoal({ patientId: patient.id, description: goalDescription })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setGoalDescription("");
      setIsAdding(false);
    },
  });

  const updateGoalMutation = useMutation({
    mutationKey: ["updateGoal", patient.id, updatedGoalDescription],
    mutationFn: async (goalId: string) => {
      const response = await updateGoal({ goalId, newDescription: updatedGoalDescription });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setUpdatedGoalDescription("");
      setEditingId(null);
    },
  });

  const removeGoalMutation = useMutation({
    mutationKey: ["removeGoal", patient.id],
    mutationFn: async (goalId: string) => {
      const response = await removeGoal({ goalId });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
    },
  });

  const handleAddGoal = () => {
    if (!goalDescription.trim()) return;
    addGoalMutation.mutate();
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingId(goal.id);
    setUpdatedGoalDescription(goal.description);
  };

  const handleSaveEdit = () => {
    if (!updatedGoalDescription.trim()) return;
    updateGoalMutation.mutate(editingId!);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setUpdatedGoalDescription('');
  };

  const handleDeleteGoal = (goalId: string) => {
    removeGoalMutation.mutate(goalId);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Goals
              </CardTitle>
              <p className="text-sm text-gray-500">
                {patient.goals.length} goal{patient.goals.length !== 1 ? 's' : ''} defined
              </p>
            </div>
          </div>

          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Add New Goal Section */}
        {isAdding && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900">Add New Goal</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="newGoal" className="text-sm font-medium text-green-800">
                  Goal Description
                </Label>
                <Input
                  id="newGoal"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Enter goal description..."
                  className="mt-1 border-green-300 focus:border-green-500 focus:ring-green-500/20"
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddGoal}
                  disabled={!goalDescription.trim()}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setGoalDescription('');
                  }}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        {patient.goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals defined</h3>
            <p className="text-gray-500 mb-4">
              Add goals to help track this patient's progress and care objectives.
            </p>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Goal
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {patient.goals.map((goal, index) => (
              <div
                key={goal.id}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  editingId === goal.id
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {editingId === goal.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`edit-goal-${goal.id}`} className="text-sm font-medium text-green-800">
                        Edit Goal Description
                      </Label>
                      <Input
                        id={`edit-goal-${goal.id}`}
                        value={updatedGoalDescription}
                        onChange={(e) => setUpdatedGoalDescription(e.target.value)}
                        className="mt-1 border-green-300 focus:border-green-500 focus:ring-green-500/20"
                        autoFocus
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={!updatedGoalDescription.trim()}
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-semibold text-green-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium leading-relaxed">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEditGoal(goal)}
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this goal? This action cannot be undone and will also remove all associated notes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Goal
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ServicesTab({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);

  const addServiceMutation = useMutation({
    mutationKey: ["addService", patient.id],
    mutationFn: async (service: ServiceType) => {
      const response = await addService({ patientId: patient.id, service });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setIsAdding(false);
    },
  });

  const removeServiceMutation = useMutation({
    mutationKey: ["removeService", patient.id],
    mutationFn: async (serviceId: string) => {
      const response = await removeService({ serviceId: serviceId });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
    },
  });

  const availableServices = [
    { type: ServiceType.Respite, name: 'Respite', color: 'bg-green-100 text-green-800' },
    { type: ServiceType.PersonalSupport, name: 'Personal Support', color: 'bg-blue-100 text-blue-800' },
    { type: ServiceType.Lifeskills, name: 'Lifeskills', color: 'bg-purple-100 text-purple-800' },
    { type: ServiceType.SupportedLiving, name: 'Supported Living', color: 'bg-orange-100 text-orange-800' },
    { type: ServiceType.SupportedEmployment, name: 'Supported Employment', color: 'bg-indigo-100 text-indigo-800' }
  ].filter(service => !patient.services.some(s => s.service === service.type));

  const handleAddService = (serviceType: ServiceType) => {
    if (patient.services.some(d => d.service === serviceType)) return;
    if (serviceType === ServiceType.UnspecifiedService) return;

    addServiceMutation.mutate(serviceType);
  };

  const handleRemoveService = (serviceId: string) => {
    removeServiceMutation.mutate(serviceId);
  };

  const getServiceColor = (serviceType: ServiceType) => {
    const colorMap = {
      [ServiceType.Respite.toString()]: 'bg-green-100 text-green-800 border-green-200',
      [ServiceType.PersonalSupport.toString()]: 'bg-blue-100 text-blue-800 border-blue-200',
      [ServiceType.Lifeskills.toString()]: 'bg-purple-100 text-purple-800 border-purple-200',
      [ServiceType.SupportedLiving.toString()]: 'bg-orange-100 text-orange-800 border-orange-200',
      [ServiceType.SupportedEmployment.toString()]: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colorMap[serviceType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Services
              </CardTitle>
              <p className="text-sm text-gray-500">
                {patient.services.length} service{patient.services.length !== 1 ? 's' : ''} assigned
              </p>
            </div>
          </div>

          {availableServices.length > 0 && !isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Add Service Section */}
        {isAdding && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Add Service</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {availableServices.map((service) => (
                <button
                  key={service.type}
                  onClick={() => handleAddService(service.type)}
                  className={`p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left group`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    <span className="font-medium text-gray-700 group-hover:text-blue-800">
                      {service.name}
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

        {/* Services List */}
        {patient.services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services assigned</h3>
            <p className="text-gray-500 mb-4">
              Add services to define the type of care this patient receives.
            </p>
            {availableServices.length > 0 && !isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Service
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patient.services.map((service) => (
              <div
                key={service.id}
                className={`p-4 rounded-lg border ${getServiceColor(service.service)} transition-all duration-200 hover:shadow-md relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{service2text(service.service)}</span>
                  </div>
                  <Button
                    onClick={() => handleRemoveService(service.id)}
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

        {availableServices.length === 0 && patient.services.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">All available services have been assigned to this patient.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Diagnoses Tab Component
function DiagnosesTab({ patient }: { patient: Patient }) {
  const qc = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addDiagnosisMutation = useMutation({
    mutationKey: ["addDiagnosis", patient.id],
    mutationFn: async (diagnosis: DiagnosisType) => {
      const response = await addDiagnosis({ patientId: patient.id, diagnosis });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setIsAdding(false);
    },
  });

  const removeDiagnosisMutation = useMutation({
    mutationKey: ["removeDiagnosis", patient.id],
    mutationFn: async (diagnosisId: string) => {
      const response = await removeDiagnosis({ diagnosisId: diagnosisId });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
    },
  });

  const availableDiagnoses = [
    { type: DiagnosisType.Autism, name: 'Autism', color: 'bg-purple-100 text-purple-800' },
    { type: DiagnosisType.DownSyndrome, name: 'Down Syndrome', color: 'bg-blue-100 text-blue-800' },
    { type: DiagnosisType.CerebralPalsy, name: 'Cerebral Palsy', color: 'bg-green-100 text-green-800' },
    {
      type: DiagnosisType.IntellectualDisability,
      name: 'Intellectual Disability',
      color: 'bg-orange-100 text-orange-800'
    },
    { type: DiagnosisType.RettSyndrome, name: 'Rett Syndrome', color: 'bg-pink-100 text-pink-800' },
    { type: DiagnosisType.SpinaBifida, name: 'Spina Bifida', color: 'bg-indigo-100 text-indigo-800' },
    { type: DiagnosisType.PraderWilliSyndrome, name: 'Prader-Willi Syndrome', color: 'bg-teal-100 text-teal-800' },
    { type: DiagnosisType.PhelanMcdermidSyndrome, name: 'Phelan-McDermid Syndrome', color: 'bg-red-100 text-red-800' }
  ].filter(diagnosis => !patient.diagnoses.some(d => d.diagnosis === diagnosis.type));

  const handleAddDiagnosis = (newDiagnosis: DiagnosisType) => {
    if (patient.diagnoses.some(d => d.diagnosis === newDiagnosis)) return;
    if (newDiagnosis === DiagnosisType.UnspecifiedDiagnosis) return;

    addDiagnosisMutation.mutate(newDiagnosis);
  };

  const handleRemoveDiagnosis = (diagnosisId: string) => {
    removeDiagnosisMutation.mutate(diagnosisId);
  };

  const getDiagnosisColor = (diagnosisType: DiagnosisType) => {
    const colorMap = {
      [DiagnosisType.Autism.toString()]: 'bg-purple-100 text-purple-800 border-purple-200',
      [DiagnosisType.DownSyndrome.toString()]: 'bg-blue-100 text-blue-800 border-blue-200',
      [DiagnosisType.CerebralPalsy.toString()]: 'bg-green-100 text-green-800 border-green-200',
      [DiagnosisType.IntellectualDisability.toString()]: 'bg-orange-100 text-orange-800 border-orange-200',
      [DiagnosisType.RettSyndrome.toString()]: 'bg-pink-100 text-pink-800 border-pink-200',
      [DiagnosisType.SpinaBifida.toString()]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      [DiagnosisType.PraderWilliSyndrome.toString()]: 'bg-teal-100 text-teal-800 border-teal-200',
      [DiagnosisType.PhelanMcdermidSyndrome.toString()]: 'bg-red-100 text-red-800 border-red-200'
    };
    return colorMap[diagnosisType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Diagnoses
              </CardTitle>
              <p className="text-sm text-gray-500">
                {patient.diagnoses.length} {patient.diagnoses.length !== 1 ? 'diagnoses' : 'diagnosis'} recorded
              </p>
            </div>
          </div>

          {availableDiagnoses.length > 0 && !isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Diagnosis
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Add Diagnosis Section */}
        {isAdding && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900">Add Diagnosis</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {availableDiagnoses.map((diagnosis) => (
                <button
                  key={diagnosis.type}
                  onClick={() => handleAddDiagnosis(diagnosis.type)}
                  className={`p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-left group`}
                >
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                    <span className="font-medium text-gray-700 group-hover:text-purple-800">
                      {diagnosis.name}
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

        {/* Diagnoses List */}
        {patient.diagnoses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No diagnoses recorded</h3>
            <p className="text-gray-500 mb-4">
              Add diagnoses to document this patient's medical conditions.
            </p>
            {availableDiagnoses.length > 0 && !isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Diagnosis
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patient.diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className={`p-4 rounded-lg border ${getDiagnosisColor(diagnosis.diagnosis)} transition-all duration-200 hover:shadow-md relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4" />
                    <span className="font-medium">{diagnosis2text(diagnosis.diagnosis)}</span>
                  </div>
                  <Button
                    onClick={() => handleRemoveDiagnosis(diagnosis.id)}
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

        {availableDiagnoses.length === 0 && patient.diagnoses.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">All available diagnoses have been recorded for this patient.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
