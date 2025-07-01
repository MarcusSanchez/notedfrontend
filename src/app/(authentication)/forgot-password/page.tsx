"use client";

import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { Role, Status } from "@/proto/user_pb";
import { emailSchema, passwordSchema } from "@/lib/schemas/schemas";
import { useMutation } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import {
  changePasswordWResetToken,
  initiateResetPassword,
  verifyResetPassword
} from "@/app/(authentication)/forgot-password/actions";
import { InitiateResetPasswordResponse, VerifyResetPasswordResponse } from "@/proto/session_pb";
import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Stethoscope,
  ArrowLeft,
  Mail,
  CheckCircle,
  AlertCircle,
  Send,
  Shield,
  Eye,
  EyeOff,
  Lock,
  KeyRound
} from 'lucide-react';
import Link from "next/link";

export default function ForgotPassword() {
  const { user } = useUserStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: verify, 3: change password

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const [resetToken, setResetToken] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const initiateRPMu = useMutation<InitiateResetPasswordResponse>({
    mutationFn: fn(() => initiateResetPassword({ email: email })),
    mutationKey: ["initiateResetPassword", email],
    onSuccess: ({ maskedEmail, challengeId }) => {
      setMaskedEmail(maskedEmail);
      setChallengeId(challengeId);
      setCurrentStep(2);
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = status.rawMessage.slice(0, 1).toUpperCase() + status.rawMessage.slice(1) + ".";
    }
  });

  const initiateRP = (e: FormEvent) => {
    e.preventDefault();

    if (!(emailSchema.schema.safeParse(email).success)) return;
    initiateRPMu.mutate();
  };

  const verifyRPMu = useMutation<VerifyResetPasswordResponse>({
    mutationFn: fn(() => verifyResetPassword({ code: code.join(''), challengeId: challengeId! })),
    mutationKey: ["verifyResetPassword", code, challengeId],
    onSuccess: ({ resetToken }) => {
      setTimeout(() => {
        setMaskedEmail(null);
        setChallengeId(null);
      }, 5000); // to avoid race condition in replacing url
      setResetToken(resetToken);
      setCurrentStep(3);
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = status.rawMessage.slice(0, 1).toUpperCase() + status.rawMessage.slice(1) + ".";
    }
  });

  const verifyRP = (e: React.FormEvent) => {
    e.preventDefault()
    verifyRPMu.mutate()
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // autofocus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const changePasswordMu = useMutation({
    mutationFn: fn(() => changePasswordWResetToken({ newPassword, resetToken: resetToken!, })),
    mutationKey: ["changeUserPasswordWResetToken", resetToken, newPassword],
    onSuccess: () => {
      setTimeout(() => router.replace("/login"), 2000);
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = status.rawMessage.slice(0, 1).toUpperCase() + status.rawMessage.slice(1) + ".";
    }
  });

  const changePassword = (e: FormEvent) => {
    e.preventDefault();

    if ([newPassword, confirmPassword].some((v) => !passwordSchema.schema.safeParse(v).success)) return;
    changePasswordMu.mutate();
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
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  No worries! Enter your email address and we'll send you a secure verification code to reset your password.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={initiateRP} className="space-y-6">
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
                      We'll send a 6-digit verification code to this email address
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={initiateRPMu.isPending}
                    className="w-full h-12 text-base font-semibold group"
                  >
                    {initiateRPMu.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Send Verification Code
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

          {/* Step 2: Email Verification */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Verify Your Email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the 6-digit code sent to <span className="font-semibold">{email}</span> to reset your password.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={verifyRP} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Verification Code
                    </Label>
                    <div className="flex space-x-2 justify-center">
                      {code.map((digit, index) => (
                        <Input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-primary focus:ring-primary"
                          required
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Didn't receive the code? Check your spam folder or{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-primary hover:text-primary/80"
                      >
                        try again
                      </button>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={verifyRPMu.isPending || code.some(digit => !digit)}
                    className="w-full h-12 text-base font-semibold group"
                  >
                    {verifyRPMu.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <KeyRound className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                    >
                      <ArrowLeft className="inline w-4 h-4 mr-1" />
                      Back to email entry
                    </button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 3: Change Password */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Great! Your email has been verified. Please enter your new password below.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={changePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter your new password..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-12 px-4 pl-12 pr-12 border-gray-300 focus:border-primary focus:ring-primary"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 px-4 pl-12 pr-12 border-gray-300 focus:border-primary focus:ring-primary"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={changePasswordMu.isPending || !newPassword || !confirmPassword}
                    className="w-full h-12 text-base font-semibold group"
                  >
                    {changePasswordMu.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        Change Password
                        <CheckCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Secure Reset</span>
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

