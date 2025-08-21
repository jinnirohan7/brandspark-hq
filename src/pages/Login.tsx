import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const { signIn, user, resetPassword } = useAuth()
  const { toast } = useToast()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password: password.length > 0 ? '***' : 'empty' })
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        console.error('Login error:', error)
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        console.log('Login successful')
        toast({
          title: 'Success',
          description: 'Welcome back!',
        })
      }
    } catch (error) {
      console.error('Unexpected login error:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    console.log('Demo login attempt')
    setEmail('demo@sellsphere.com')
    setPassword('demo123456')
    setLoading(true)

    try {
      const { error } = await signIn('demo@sellsphere.com', 'demo123456')
      
      if (error) {
        console.error('Demo login error:', error)
        toast({
          title: 'Demo Login Info',
          description: 'Demo account not set up. Please register or use your own credentials.',
          variant: 'default',
        })
      } else {
        console.log('Demo login successful')
        toast({
          title: 'Success',
          description: 'Welcome to the demo!',
        })
      }
    } catch (error) {
      console.error('Demo login error:', error)
      toast({
        title: 'Demo Login Info',
        description: 'Demo account not set up. Please register or use your own credentials.',
        variant: 'default',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)

    try {
      const { error } = await resetPassword(resetEmail)
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Password reset email sent! Check your inbox.',
        })
        setResetDialogOpen(false)
        setResetEmail('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your SellSphere account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={handleDemoLogin}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Try Demo Dashboard
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm">
                  Forgot your password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={resetLoading}>
                    {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login