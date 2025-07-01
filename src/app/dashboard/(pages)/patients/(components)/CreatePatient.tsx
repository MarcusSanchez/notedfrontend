"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, FileText, CalendarMinus as VenusAndMars, UserPlus, Heart } from 'lucide-react';
import { CreatePatientResponse, Sex } from '@/proto/patient_pb';
import { sex2text } from "@/lib/tools/enum2text";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nameSchema } from "@/lib/schemas/schemas";
import { fn } from '@/lib/utils';
import { createPatient } from "@/app/dashboard/(pages)/patients/actions";

export function CreatePatient() {
  const router = useRouter();
  const qc = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const [hasMaladaptiveBehaviors, setHasMaladaptiveBehaviors] = useState(false);
  const [additionalInformation, setAdditionalInformation] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const firstNameResult = nameSchema.safeParse(firstName);
    if (!firstNameResult.success) {
      setErrors(prev => ({ ...prev, firstName: firstNameResult.error.errors[0].message }));
      return;
    } else {
      setErrors(prev => ({ ...prev, firstName: '' }));
    }

    const lastNameResult = nameSchema.safeParse(lastName);
    if (!lastNameResult.success) {
      setErrors(prev => ({ ...prev, lastName: lastNameResult.error.errors[0].message }));
      return;
    } else {
      setErrors(prev => ({ ...prev, lastName: '' }));
    }

    if (sex === null || sex === Sex.UnspecifiedSex) return;
    createPatientMutation.mutate();
  };

  const sexes = [Sex.Male, Sex.Female, Sex.Other];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create New Patient
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the patient's information to create a new record in the system.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`border-gray-300 focus:border-green-400 focus:ring-green-400/20 bg-white/80 ${
                  errors.firstName ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`border-gray-300 focus:border-green-400 focus:ring-green-400/20 bg-white/80 ${
                  errors.lastName ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Sex Selection */}
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-50 rounded-md flex items-center justify-center">
                <VenusAndMars className="w-4 h-4 text-orange-600" />
              </div>
              Sex
            </Label>
            <Select
              value={sex !== null ? sex.toString() : ""}
              onValueChange={(value) => setSex(parseInt(value))}
            >
              <SelectTrigger className={`w-full xl:w-[200px] border-gray-300 focus:border-green-400 focus:ring-green-400/20 bg-white/80 ${
                errors.sex ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : ''
              }`}>
                <SelectValue placeholder="Select a sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sex</SelectLabel>
                  {sexes.map((sexOption) => (
                    <SelectItem value={sexOption.toString()} key={sexOption}>
                      {sex2text(sexOption)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.sex && (
              <p className="text-sm text-red-600">{errors.sex}</p>
            )}
          </div>

          {/* Maladaptive Behaviors Checkbox */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="maladaptiveBehaviors"
                    checked={hasMaladaptiveBehaviors}
                    onCheckedChange={(checked) => setHasMaladaptiveBehaviors(checked as boolean)}
                    className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-400/20 data-[state=checked]:bg-green-600"
                  />
                  <Label htmlFor="maladaptiveBehaviors" className="text-sm font-medium text-green-800 cursor-pointer">
                    This patient exhibits maladaptive behaviors
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-50 rounded-md flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              Additional Information
              <span className="text-gray-500 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="additionalInfo"
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
              maxLength={500}
              className="min-h-[120px] border-gray-300 focus:border-green-400 focus:ring-green-400/20 bg-white/80"
              placeholder="Enter any additional information about the patient..."
            />
            <p className="text-xs text-gray-500">
              {additionalInformation.length}/500 characters
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-6">
        <Button
          onClick={addPatient}
          disabled={createPatientMutation.isPending || !firstName || !lastName || sex === null || sex === Sex.UnspecifiedSex}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          {createPatientMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Creating Patient...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Create Patient
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}