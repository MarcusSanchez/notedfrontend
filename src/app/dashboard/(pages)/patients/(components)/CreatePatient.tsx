"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { SchemaInput } from "@/components/utility/SchemaInput"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, User, VenusAndMars } from "lucide-react"
import { nameSchema, patientAdditionalInformationSchema, patientNameSchema } from "@/lib/schemas/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { createPatient } from "@/app/dashboard/(pages)/patients/actions";
import { CreatePatientResponse, Sex } from "@/proto/patient_pb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { sex2text } from "@/lib/tools/enum2text";

export function CreatePatient() {
  const router = useRouter();
  const qc = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState<Sex | null>(null);
  const [hasMaladaptiveBehaviors, setHasMaladaptiveBehaviors] = useState(false);
  const [additionalInformation, setAdditionalInformation] = useState("");

  const createPatientMutation = useMutation<CreatePatientResponse>({
    mutationKey: ["createPatient", firstName, lastName, hasMaladaptiveBehaviors, additionalInformation],
    mutationFn: fn(() => createPatient({
      firstName, lastName, hasMaladaptiveBehaviors,
      sex: sex!,
      additionalInformation: additionalInformation || undefined,
    })),
    onSuccess: ({ patientId }) => {
      router.push(`/dashboard/patients/${patientId}`)
      qc.invalidateQueries({ queryKey: ["patientsInfinite"] });
    },
  });

  const addPatient = () => {
    const results = [nameSchema.safeParse(firstName), nameSchema.safeParse(lastName)];
    if (!results.every(r => r.success)) return;
    if (sex === null || sex === Sex.UnspecifiedSex) return;
    createPatientMutation.mutate();
  };

  const sexes = [Sex.Male, Sex.Female, Sex.Other];

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" />
          Create New Patient
        </CardTitle>
        <CardDescription>Enter the patient&#39;s information to create a new record.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <SchemaInput value={firstName} setValue={setFirstName} name="first name" schema={patientNameSchema} />
          <SchemaInput value={lastName} setValue={setLastName} name="last name" schema={patientNameSchema} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sex" className="font-bold text-sm flex items-center gap-2">
            <VenusAndMars className="w-4 h-4" />
            Sex
          </Label>
          <Select value={sex !== null ? sex.toString() : ""} onValueChange={(value) => setSex(parseInt(value))}>
            <SelectTrigger className="w-full xl:w-[180px]">
              <SelectValue placeholder="Select a sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sexes</SelectLabel>
                {sexes.map((sex) => (
                  <SelectItem value={sex.toString()} key={sex}>
                    {sex2text(sex)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="maladaptiveBehaviors"
            checked={hasMaladaptiveBehaviors}
            onCheckedChange={(c) => c ? setHasMaladaptiveBehaviors(true) : setHasMaladaptiveBehaviors(false)}
          />
          <Label htmlFor="maladaptiveBehaviors" className="font-bold text-sm cursor-pointer">
            This patient has maladaptive behaviors.
          </Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalInfo" className="font-bold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Additional Information <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="additionalInfo"
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
            maxLength={patientAdditionalInformationSchema.max}
            className="min-h-[100px]"
            placeholder="Enter any additional information here..."
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full font-bold" onClick={addPatient} disabled={createPatientMutation.isPending || sex === null}>
          Create Patient
        </Button>
      </CardFooter>
    </Card>
  );
}