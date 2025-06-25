"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { fn, statusFrom } from "@/lib/utils"
import { initiateMFA, resendMFACode, verifyMFA } from "./actions"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/state"
import type { InitiateMFAResponse, ResendMFACodeResponse } from "@/proto/session_pb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2, ShieldCheck } from "lucide-react"
import { Code } from "@connectrpc/connect";

export default function MFA() {
  const [otp, setOtp] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const { user, saveUser, signOut } = useUserStore()

  const initiateMutation = useMutation<InitiateMFAResponse>({
    mutationFn: fn(() => initiateMFA()),
    onSuccess: ({ maskedEmail }) => {
      setMaskedEmail(maskedEmail)
      setCountdown(30)
    },
    onError: (error) => {
      const status = statusFrom(error);
      if (status.code === Code.AlreadyExists) {
        saveUser({ ...user, mfaVerified: true })
      }
    },
  })

  const resendMutation = useMutation<ResendMFACodeResponse>({
    mutationFn: fn(() => resendMFACode()),
    onSuccess: ({ maskedEmail }) => {
      setMaskedEmail(maskedEmail)
      setCountdown(30)
    },
  })

  const verifyMutation = useMutation({
    mutationFn: fn(() => verifyMFA({ mfaCode: otp })),
    onSuccess: () => {
      saveUser({ ...user, mfaVerified: true })
      setTimeout(() => router.replace("/dashboard"), 2000)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) verifyMutation.mutate()
  }

  useEffect(() => {
    if (!user.loggedIn) return;
    if (user.mfaVerified) router.replace("/dashboard")
    else initiateMutation.mutate()
  }, [user.loggedIn])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const onChange = (newValue: string) => {
    if (isNaN(Number(newValue))) return;
    setOtp(newValue);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-8">
        <ShieldCheck className="h-12 w-12 text-primary" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">Enter the 6-digit code sent to {maskedEmail}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4 flex flex-col items-center">
              <InputOTP value={otp} onChange={onChange} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {verifyMutation.isError && (
                <p className="text-red-500 dark:text-mocha-red text-sm">Incorrect code. Please try again.</p>
              )}
              {verifyMutation.isSuccess && (
                <p className="text-green-500 text-sm">Verification successful! Redirecting...</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={otp.length !== 6 || verifyMutation.isPending}>
              {verifyMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending || countdown > 0}
            >
              {resendMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Button variant="link" className="text-xs text-red-500 dark:text-mocha-red font-bold" onClick={() => signOut()}>
        Don't recognize this email? Click here to sign out.
      </Button>
    </div>
  )
}

