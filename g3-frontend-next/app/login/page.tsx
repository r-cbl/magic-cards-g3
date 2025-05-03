"use client"
import React, { useState } from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginUser } from "@/lib/userSlice"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error, currentUser } = useAppSelector((state) => state.user)

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formErrors, setFormErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validateForm = () => {
    const errors: {
      email?: string
      password?: string
    } = {}

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address."
    }

    if (!password) {
      errors.password = "Password is required."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    dispatch(loginUser({ email, password }))
  }

  // Redirect on login
  React.useEffect(() => {
    if (currentUser) {
      router.push("/")
    }
  }, [currentUser, router])

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>Welcome back to DeckTrade</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
