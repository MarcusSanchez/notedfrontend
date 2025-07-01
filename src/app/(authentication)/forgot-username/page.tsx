"use client";

import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { Role, Status } from "@/proto/user_pb";
import { emailSchema } from "@/lib/schemas/schemas";
import { useMutation } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { forgotUsername } from "@/app/(authentication)/forgot-username/actions";
import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Stethoscope,
  ArrowLeft,
  Mail,
  User,
  CheckCircle,
  Send
} from 'lucide-react';
import Link from "next/link";

export default function ForgotUsername() {
  const { user } = useUserStore();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: success
  const [email, setEmail] = useState("");

  const forgotUsernameMu = useMutation({
    mutationFn: fn(() => forgotUsername({ email })),
    mutationKey: ["forgotUsername", email],
    onSuccess: () => setCurrentStep(2),
  });

  const initiateFU = (e: FormEvent) => {
    e.preventDefault();

    if (!(emailSchema.schema.safeParse(email).success)) return;
    forgotUsernameMu.mutate();
  };

  const resetForm = () => {
    setEmail("");
    setCurrentStep(1);
    forgotUsernameMu.reset();
  };

  if (user.loggedIn) {
    if (!user.mfaVerified) router.replace("/mfa");
    else if (user.role === Role.Admin && user!.status === Status.Accepted) router.replace("/dashboard");
    else if (user!.status === Status.Pending) router.replace("/status/pending");
    else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    else if (user!.role === Role.Nurse) router.replace("/status/not-admin");
    else router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Noted</span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          {/* Step 1: Email Input */}
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Forgot Username?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your email address and we'll help you recover your username for your Noted account.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={initiateFU} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-4 pl-12 border-gray-300 focus:border-primary focus:ring-primary"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll send your username to this email address if an account exists
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={forgotUsernameMu.isPending}
                    className="w-full h-12 text-base font-semibold group"
                  >
                    {forgotUsernameMu.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Finding Username...
                      </>
                    ) : (
                      <>
                        Find Username
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link href="/login">
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                      >
                        <ArrowLeft className="inline w-4 h-4 mr-1" />
                        Back to login
                      </button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 2: Username Recovery Success */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  We have sent your username to the email you provided.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Didn't receive the email?</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Check your spam or junk folder</li>
                        <li>• Make sure you entered the correct email address</li>
                        <li>• Wait a few minutes for delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold"
                >
                  Return to Login Screen
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Try different email
                  </button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Secure Recovery</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

