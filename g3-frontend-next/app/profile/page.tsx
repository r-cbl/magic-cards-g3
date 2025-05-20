"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateUserProfile, setProfileField } from "@/lib/userSlice"

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentUser, profileForm, isLoading, error } = useAppSelector((state) => state.user)

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Initialize form with current user data
    dispatch(setProfileField({ field: "name", value: currentUser.name }))
    dispatch(setProfileField({ field: "email", value: currentUser.email }))
    dispatch(setProfileField({ field: "lastName", value: currentUser.lastName || "" }))
    dispatch(setProfileField({ field: "password", value: "" }))
    dispatch(setProfileField({ field: "confirmPassword", value: "" }))
  }, [dispatch, currentUser, router])

  const handleInputChange = (field: string, value: string) => {
    dispatch(setProfileField({ field, value }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!profileForm.name || profileForm.name.length < 2) {
      errors.name = "Name must be at least 2 characters."
    }

    if (!profileForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Please enter a valid email address."
    }

    if (profileForm.password && profileForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters."
    }

    if (profileForm.password !== profileForm.confirmPassword) {
      errors.confirmPassword = "Passwords don't match."
    }

    // Update form errors in Redux
    Object.entries(errors).forEach(([field, message]) => {
      dispatch(setProfileField({ field: `${field}Error`, value: message }))
    })

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    dispatch(setProfileField({ field: "nameError", value: "" }))
    dispatch(setProfileField({ field: "emailError", value: "" }))
    dispatch(setProfileField({ field: "lastNameError", value: "" }))
    dispatch(setProfileField({ field: "passwordError", value: "" }))
    dispatch(setProfileField({ field: "confirmPasswordError", value: "" }))

    if (!validateForm() || !currentUser) {
      return
    }

    const userData = {
      name: profileForm.name,
      lastName: profileForm.lastName,
      email: profileForm.email,
      ...(profileForm.password ? { password: profileForm.password } : {}),
    }

    dispatch(updateUserProfile({ userId: currentUser.id, userData }))
  }

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                First Name
              </label>
              <Input id="name" value={profileForm.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              {profileForm.nameError && <p className="text-sm text-red-500">{profileForm.nameError}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              {profileForm.lastNameError && <p className="text-sm text-red-500">{profileForm.lastNameError}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {profileForm.emailError && <p className="text-sm text-red-500">{profileForm.emailError}</p>}
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-4">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={profileForm.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to keep current password</p>
                  {profileForm.passwordError && <p className="text-sm text-red-500">{profileForm.passwordError}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                  {profileForm.confirmPasswordError && (
                    <p className="text-sm text-red-500">{profileForm.confirmPasswordError}</p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isLoading}>
              {isLoading ? "Saving changes..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
