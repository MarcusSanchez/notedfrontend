"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building2,
  Search,
  CheckCircle,
  Shield,
  Users,
  Clock,
  Mail,
  User as UserIcon,
  Lock
} from 'lucide-react';
import { companyCodeSchema, emailSchema, nameSchema, passwordSchema, usernameSchema } from "@/lib/schemas/schemas";
import React, { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getCompanyByCode, signUp } from "@/app/(authentication)/register/actions";
import { Code } from "@connectrpc/connect";
import { fn, statusFrom } from "@/lib/utils";
import { match } from "ts-pattern";
import { Role, Status, User } from "@/proto/user_pb";
import { useRouter } from "next/navigation";
import { atom, useAtom } from 'jotai';
import { Company, GetCompanyByCodeResponse } from '@/proto/company_pb';
import { useUserStore } from "@/lib/state";
import Link from "next/link";

const foundCompanyAtom = atom<Company | null>(null);

const Register = () => {
  const { user, saveUser } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);

  const [company, setCompany] = useAtom(foundCompanyAtom);
  const [code, setCode] = useState('');

  const [currentStep, setCurrentStep] = useState(company?.id ? 2 : 1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const router = useRouter();

  const signupMutation = useMutation<{ user?: User, mfaVerified?: boolean }>({
    mutationFn: fn(() => signUp({ companyId: company!.id, name: fullName, email, username, password })),
    onSuccess: ({ user, mfaVerified }) => {
      saveUser({ ...user!, mfaVerified: mfaVerified! });

      if (!mfaVerified) {
        router.replace("/mfa");
        return;
      }
      router.replace("/status/pending");
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = match(status.code)
        .with(Code.AlreadyExists, () => {
          if (status.rawMessage === "email is already taken") return "The email you have entered already exists.";
          else return "The username you have entered already exists.";
        })
        .with(Code.NotFound, () => "The company you have entered no longer exists.")
        .otherwise(() => "The username you have entered already exists.")
    },
  });

  const signup = (e: FormEvent) => {
    e.preventDefault();

    const schemas = [nameSchema.safeParse(fullName), usernameSchema.safeParse(username), passwordSchema.safeParse(password), emailSchema.safeParse(email)];
    if (schemas.some(s => !s.success)) return;
    signupMutation.mutate();
  }

  const findCompanyMutation = useMutation<GetCompanyByCodeResponse>({
    mutationFn: fn(() => getCompanyByCode({ code: code.toUpperCase() })),
    onSuccess: ({ company }) => {
      setCompany(company!);
      setCurrentStep(2);
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = match(status.code)
        .with(Code.NotFound, () => "The company code you have entered doesn't exist.")
        .otherwise(() => "Failed to retrieve company. Please try again later.");
    },
  });

  const findCompany = (e: FormEvent) => {
    e.preventDefault();

    if (!companyCodeSchema.safeParse(code).success) return;
    findCompanyMutation.mutate();
  };

  if (user.loggedIn) {
    if (!user.mfaVerified) router.replace("/mfa");
    else if (user.role === Role.Admin && user!.status === Status.Accepted) router.replace("/dashboard");
    else if (user!.status === Status.Pending) router.replace("/status/pending");
    else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    else if (user!.role === Role.Nurse) router.replace("/status/not-admin");
    else router.replace("/dashboard");
  }

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and HIPAA compliance built-in'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Seamless onboarding and role-based access control'
    },
    {
      icon: Clock,
      title: 'Quick Setup',
      description: 'Get your team up and running in under 5 minutes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Link href="/">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Noted</span>
              </div>
            </Link>
          </div>

          <Card className="shadow-xl border-0">
            {/* Step 1: Company Lookup */}
            {currentStep === 1 && (
              <>
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Find Your Company
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    To get started, we need to locate your healthcare organization.
                    Please enter your company code below.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={findCompany} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyCode" className="text-sm font-medium text-gray-700">
                        Company Code
                      </Label>
                      <div className="relative">
                        <Input
                          id="companyCode"
                          type="text"
                          placeholder="Enter your company code..."
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="h-12 px-4 pl-12 border-gray-300 focus:border-primary focus:ring-primary"
                          required
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-semibold group">
                      Find Company
                      <Search className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <Link href="/login">
                        <Button variant="outline" className="w-full h-12 text-base font-semibold">
                          Sign in here
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </>
            )}

            {/* Step 2: Account Creation */}
            {currentStep === 2 && (
              <>
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Create Your Account
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Great! We found your company{' '}
                    <span className="font-semibold text-primary">({company?.name})</span>.
                    Please complete the form below to create your account.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={signup} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name..."
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-12 px-4 pl-12 border-gray-300 focus:border-primary focus:ring-primary"
                          required
                        />
                        <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                      </Label>
                      <div className="relative">
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username..."
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="h-12 px-4 pl-12 border-gray-300 focus:border-primary focus:ring-primary"
                          required
                        />
                        <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a secure password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 px-4 pl-12 pr-12 border-gray-300 focus:border-primary focus:ring-primary"
                          required
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
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

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{' '}
                        <button type="button" className="text-primary hover:text-primary/80">
                          Terms of Service
                        </button>
                        {' '}
                        and{' '}
                        <button type="button" className="text-primary hover:text-primary/80">
                          Privacy Policy
                        </button>
                        , and acknowledge that my data will be processed in accordance with HIPAA regulations.
                      </Label>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 h-12 text-base font-semibold"
                      >
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={!agreeToTerms || signupMutation.isPending}
                        className="flex-1 h-12 text-base font-semibold group"
                      >
                        Create Account
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      Don't recognize this company?{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-primary hover:text-primary/80"
                      >
                        Search again
                      </button>
                    </div>
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
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-purple-600 p-12 items-center justify-center">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-6">
            Join the Future of Healthcare Documentation
          </h2>
          <p className="text-xl opacity-90 mb-12 leading-relaxed">
            Find out why healthcare professionals trust Noted to streamline
            their workflow and improve patient care documentation.
          </p>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="opacity-90 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-sm opacity-90">Registration Progress</div>
              <div className="flex-1 bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                />
              </div>
              <div className="text-sm opacity-90">{currentStep}/2</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold mb-1">Trusted by</div>
              <div className="opacity-90">Healthcare Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">99.9%</div>
              <div className="opacity-90">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
