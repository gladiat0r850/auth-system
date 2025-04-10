"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Github } from "lucide-react"
import generateID from "@/components/generateID"

export interface IUser {
  id?: string
  name?: string
  password?: string
  email?: string
}

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState<IUser>({
    name: undefined,
    password: undefined,
    email: undefined,
  })
  const [loginUser, setLoginCredentials] = useState<IUser>({
    email: undefined,
    password: undefined,
  })
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("http://localhost:5000/verify-token", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (res.ok) {
        router.push("/dashboard")
      }
    }
    checkAuth()
  }, [])
  async function SignUp() {
    if (Object.values(user)) {
      await fetch("http://localhost:5000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, id: generateID() }),
      })
    }
  }
  async function LogIn(id: string) {
    const res = await fetch(`http://localhost:5000/log-in/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUser),
      credentials: 'include'
    })
    if (res.ok) {
      const response = await res.json()
      console.log(response.token)
      localStorage.setItem("token", response.token)
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/60 to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-muted/20">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg">
              <TabsTrigger value="login" className="rounded-md py-2">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-md py-2">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => setLoginCredentials({ ...loginUser, email: e.target.value })}
                    id="email-login"
                    placeholder="name@example.com"
                    type="email"
                    className="pl-10 h-10 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-login" className="text-sm font-medium">
                    Password
                  </Label>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => setLoginCredentials({ ...loginUser, password: e.target.value })}
                    id="password-login"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 h-10 rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 my-4">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm">
                  Remember me for 30 days
                </Label>
              </div>
              <Button onClick={() => loginUser?.email && LogIn(loginUser.email)} className="w-full h-9 rounded-md font-medium">
                Sign in
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-9 rounded-md">
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" className="h-9 rounded-md">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 h-10 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    id="email-register"
                    placeholder="name@example.com"
                    type="email"
                    className="pl-10 h-10 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    id="password-register"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 h-10 rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Button variant="link" className="p-0 h-auto text-xs">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-xs">
                      Privacy Policy
                    </Button>
                  </Label>
                </div>
              </div>

              <Button onClick={SignUp} className="w-full h-9 rounded-md font-medium mt-2">
                Create account
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-9 rounded-md">
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" className="h-9 rounded-md">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

