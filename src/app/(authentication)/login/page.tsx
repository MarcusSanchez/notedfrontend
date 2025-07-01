"use client";

import { Button } from "@/components/ui/button"
import { FormEvent, useState } from "react";
import { passwordSchema, usernameSchema } from "@/lib/schemas/schemas";
import { useMutation } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { signIn } from "@/app/(authentication)/login/actions";
import { Code } from "@connectrpc/connect";
import { Role, Status, User } from "@/proto/user_pb";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/state";
import { match } from "ts-pattern";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from "next/link";

export default function Login() {
  const { user, saveUser } = useUserStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const signinMutation = useMutation<{ user?: User, mfaVerified?: boolean }>({
    mutationFn: fn(() => signIn({ username, password })),
    onSuccess: ({ user, mfaVerified }) => {
      saveUser({ ...user!, mfaVerified: mfaVerified! });

      if (!mfaVerified) router.replace("/mfa");
      else if (user!.status === Status.Accepted) router.replace("/dashboard");
      else if (user!.status === Status.Pending) router.replace("/status/pending");
      else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = match(status.code)
        .with(Code.NotFound, () => "Unable to signin, please check your credentials and try again.")
        .with(Code.Unauthenticated, () => "Unable to signin, please check your credentials and try again.")
        .with(Code.ResourceExhausted, () => "You have reached the maximum number of login attempts. Please try again later.")
        .otherwise(() => "Failed to signin, please try again later.");
    },
  });

  const signin = (e: FormEvent) => {
    e.preventDefault();

    const results = [usernameSchema.safeParse(username), passwordSchema.safeParse(password)];
    if (results.some(r => !r.success)) return;
    signinMutation.mutate();
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
      title: 'HIPAA Compliant',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless coordination between healthcare professionals'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Reduce documentation time by up to 60%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left side - Login Form */}
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
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your Noted account to continue managing your healthcare documentation
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={signin} className="space-y-6">
                {/* username Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <Link href="/forgot-username" className="text-sm text-primary hover:text-primary/80 font-medium">
                      Forgot username?
                    </Link>
                  </div>
                  <Input
                    id="username"
                    type="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 px-4 border-gray-300 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 font-medium">
                        Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 px-4 pr-12 border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
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
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold group"
                >
                  Sign In to Noted
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">New to Noted?</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Link href="/register">
                    <Button variant="outline" className="w-full h-12 text-base font-semibold">
                      Create Your Account
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
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
            Transform Your Healthcare Documentation
          </h2>
          <p className="text-xl opacity-90 mb-12 leading-relaxed">
            Continue streamlining your workflow and improve your home health care documentation.
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

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold mb-1">Trusted by</div>
              <div className="opacity-90">Healthcare Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">2.5hrs</div>
              <div className="opacity-90">Saved Daily Per Nurse</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}