"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, PlusCircle, Trash2 } from 'lucide-react'
import { DiagnosisType, Patient, ServiceType } from "@/proto/patient_pb";
import { diagnosis2text, service2text } from "@/lib/tools/enum2text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDiagnosis,
  addGoal,
  addService,
  removeDiagnosis,
  removeGoal,
  removeService,
  updateGoal
} from "@/app/dashboard/(pages)/nurses/[id]/actions";
import React, { useState } from "react";
import { match } from "ts-pattern";
import { fn } from "@/lib/utils";
import { SchemaInputSm } from "@/components/utility/SchemaInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { goalSchema } from "@/lib/schemas/schemas";

export function PatientTabs({ patient }: { patient: Patient }) {

  return (
    <Tabs defaultValue="goals" className="w-full">
      <TabsList>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
      </TabsList>
      <TabsContent value="goals">
        <GoalTab patient={patient} />
      </TabsContent>
      <TabsContent value="services">
        <ServiceTab patient={patient} />
      </TabsContent>
      <TabsContent value="diagnoses">
        <DiagnosisTab patient={patient} />
      </TabsContent>
    </Tabs>
  )
}

function GoalTab({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const [goalDescription, setGoalDescription] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [updateGoalModalOpen, setUpdateGoalModalOpen] = useState(false);

  const addGoalMutation = useMutation({
    mutationKey: ["addGoal", patient.id, goalDescription],
    mutationFn: fn(() => addGoal({ patientId: patient.id, description: goalDescription })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setGoalDescription("");
      setAddGoalModalOpen(false);
    },
  });

  const updateGoalMutation = useMutation({
    mutationKey: ["updateGoal", patient.id, newGoalDescription],
    mutationFn: async (goalId: string) => {
      const response = await updateGoal({ goalId, newDescription: newGoalDescription });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setNewGoalDescription("");
      setUpdateGoalModalOpen(false);
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
    if (!goalDescription) return;
    addGoalMutation.mutate();
  };

  const handleUpdateGoal = (goalId: string,) => {
    if (!newGoalDescription) return
    updateGoalMutation.mutate(goalId);
  };

  const handleRemoveGoal = (goalId: string) => removeGoalMutation.mutate(goalId);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center text-xl">
          Goals
          <Dialog open={addGoalModalOpen} onOpenChange={o => {
            setAddGoalModalOpen(o);
            if (!o) setGoalDescription("");
          }}>
            <DialogTrigger asChild>
              <Button className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Add Goal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>
                  Enter goal description below.
                </DialogDescription>
              </DialogHeader>
              <SchemaInputSm value={goalDescription} setValue={setGoalDescription} name={"goal description"} schema={goalSchema} />
              <Button onClick={handleAddGoal} className="w-32 font-bold ml-auto">
                Add Goal
              </Button>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!(patient.goals.length > 0)
          ? (
            <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
              This patient does not have any goals, please add one.
            </div>
          )
          : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell>{goal.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog open={updateGoalModalOpen} onOpenChange={o => {
                          setUpdateGoalModalOpen(o);
                          if (o) setNewGoalDescription(goal.description);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Goal</DialogTitle>
                              <DialogDescription>
                                Enter goal description below.
                              </DialogDescription>
                            </DialogHeader>
                            <SchemaInputSm value={newGoalDescription} setValue={setNewGoalDescription} name="new goal description" schema={goalSchema} />
                            <Button onClick={() => handleUpdateGoal(goal.id)} className="font-bold w-32 ml-auto">
                              Update Goal
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Deleting this goal will not only delete it from this patient&#39;s profile,
                                but will also delete all notes that reference it.
                                <br /><br />
                                Maybe you should just update it instead?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveGoal(goal.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
      </CardContent>
    </Card>
  );
}

const serviceTypes = [
  service2text(ServiceType.Respite),
  service2text(ServiceType.PersonalSupport),
  service2text(ServiceType.Lifeskills),
  service2text(ServiceType.SupportedLiving),
  service2text(ServiceType.SupportedEmployment),
];

function ServiceTab({ patient }: { patient: Patient }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const addServiceMutation = useMutation({
    mutationKey: ["addService", patient.id],
    mutationFn: async (service: ServiceType) => {
      const response = await addService({ patientId: patient.id, service });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setOpen(false);
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

  const handleAddService = (service: string) => {
    const newService = match(service)
      .with("Respite", () => ServiceType.Respite)
      .with("Personal Support", () => ServiceType.PersonalSupport)
      .with("Lifeskills", () => ServiceType.Lifeskills)
      .with("Supported Living", () => ServiceType.SupportedLiving)
      .with("Supported Employment", () => ServiceType.SupportedEmployment)
      .with("Unspecified Service", () => ServiceType.UnspecifiedService)
      .otherwise(() => ServiceType.UnspecifiedService);

    if (patient.services.some(d => d.service === newService)) return;
    if (newService === ServiceType.UnspecifiedService) return;

    addServiceMutation.mutate(newService);
  };

  const availableServices = serviceTypes.filter(service => !patient.services.some(s => service2text(s.service) === service));

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center text-xl">
          Services
          <Dialog open={open} onOpenChange={(e) => e ? setOpen(true) : setOpen(false)}>
            <DialogTrigger asChild>
              <Button className="font-bold">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <Label htmlFor="new-service">Service Type</Label>
              <Select onValueChange={(value) => handleAddService(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!(patient.services.length > 0)
          ? (
            <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
              This patient does not have any services, please add one.
            </div>
          )
          : (
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Service Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service2text(service.service)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeServiceMutation.mutate(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
      </CardContent>
    </Card>
  );
}

const diagnosisTypes = [
  diagnosis2text(DiagnosisType.Autism),
  diagnosis2text(DiagnosisType.DownSyndrome),
  diagnosis2text(DiagnosisType.CerebralPalsy),
  diagnosis2text(DiagnosisType.IntellectualDisability),
  diagnosis2text(DiagnosisType.RettSyndrome),
  diagnosis2text(DiagnosisType.SpinaBifida),
  diagnosis2text(DiagnosisType.PraderWilliSyndrome),
  diagnosis2text(DiagnosisType.PhelanMcdermidSyndrome),
];

function DiagnosisTab({ patient }: { patient: Patient }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const addDiagnosisMutation = useMutation({
    mutationKey: ["addDiagnosis", patient.id],
    mutationFn: async (diagnosis: DiagnosisType) => {
      const response = await addDiagnosis({ patientId: patient.id, diagnosis });
      if (!response.success) throw response.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setOpen(false);
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

  const handleAddDiagnosis = (diagnosis: string) => {
    const newDiagnosis = match(diagnosis)
      .with("Autism", () => DiagnosisType.Autism)
      .with("Down Syndrome", () => DiagnosisType.DownSyndrome)
      .with("Cerebral Palsy", () => DiagnosisType.CerebralPalsy)
      .with("Intellectual Disability", () => DiagnosisType.IntellectualDisability)
      .with("Rett Syndrome", () => DiagnosisType.RettSyndrome)
      .with("Spina Bifida", () => DiagnosisType.SpinaBifida)
      .with("Prader-Willi Syndrome", () => DiagnosisType.PraderWilliSyndrome)
      .with("Phelan-McDermid Syndrome", () => DiagnosisType.PhelanMcdermidSyndrome)
      .otherwise(() => DiagnosisType.UnspecifiedDiagnosis);

    if (patient.diagnoses.some(d => d.diagnosis === newDiagnosis)) return;
    if (newDiagnosis === DiagnosisType.UnspecifiedDiagnosis) return;

    addDiagnosisMutation.mutate(newDiagnosis);
  };

  const availableDiagnoses = diagnosisTypes.filter(diagnosis => !patient.diagnoses.some(d => diagnosis2text(d.diagnosis) === diagnosis));

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center text-xl">
          Diagnoses
          <Dialog open={open} onOpenChange={(e) => e ? setOpen(true) : setOpen(false)}>
            <DialogTrigger asChild>
              <Button className="font-bold">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Diagnosis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Diagnosis</DialogTitle>
              </DialogHeader>
              <Label htmlFor="new-diagnosis">Diagnosis Type</Label>
              <Select onValueChange={(value) => handleAddDiagnosis(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a diagnosis" />
                </SelectTrigger>
                <SelectContent>
                  {availableDiagnoses.map((diagnosis) => (
                    <SelectItem key={diagnosis} value={diagnosis}>{diagnosis}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!(patient.diagnoses.length > 0)
          ? (
            <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
              This patient does not have any diagnoses, please add one.
            </div>
          )
          : (
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Diagnosis Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.diagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell>{diagnosis2text(diagnosis.diagnosis)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeDiagnosisMutation.mutate(diagnosis.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
      </CardContent>
    </Card>
  );
}