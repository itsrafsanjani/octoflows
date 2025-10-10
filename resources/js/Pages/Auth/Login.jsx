import InputError from '@/Components/InputError'
import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Checkbox } from '@/Components/shadcn/ui/checkbox'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/shadcn/ui/tabs'
import SocialLoginButton from '@/Components/SocialLoginButton'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { Link, useForm, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { route } from 'ziggy-js'

export default function Login({ canResetPassword, status, availableOauthProviders }) {
  const { props } = usePage()
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('login-active-tab') || 'password'
    }
    catch {
      return 'password'
    }
  })

  // Form state
  const passwordForm = useForm({
    email: 'test@example.com',
    password: 'password',
    remember: false,
  })

  const loginLinkForm = useForm({
    email: '',
  })

  // Computed
  const hasOauthProviders = Object.keys(availableOauthProviders || {}).length > 0
  const isProcessing = passwordForm.processing || loginLinkForm.processing

  // Methods
  const handlePasswordLogin = (e) => {
    e.preventDefault()
    passwordForm
      .post(route('login'), {
        onFinish: () => passwordForm.reset('password'),
      })
  }

  const handleLoginLink = (e) => {
    e.preventDefault()
    loginLinkForm.post(route('login-link.store'), {
      onSuccess: () => {
        loginLinkForm.reset()
        if (props.flash.success) {
          toast.success(props.flash.success)
        }
      },
      onError: () => {
        if (props.flash.error) {
          toast.error(props.flash.error)
        }
      },
    })
  }

  // Effects
  useEffect(() => {
    if (props.flash.error) {
      toast.error(props.flash.error)
    }

    if (props.flash.success) {
      toast.success(props.flash.success)
    }
  }, [props.flash])

  useEffect(() => {
    try {
      localStorage.setItem('login-active-tab', activeTab)
    }
    catch {}
  }, [activeTab])

  // SEO
  useSeoMetaTags({
    title: 'Log in',
  })

  return (
    <>
      <Toaster position="top-center" />

      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background/50 to-background">
        <Card className="mx-auto w-[420px] shadow-lg transition-all duration-300 hover:shadow-xl">
          {/* Header */}
          <CardHeader>
            <CardTitle className="flex justify-center">
              <AuthenticationCardLogo />
            </CardTitle>
            <CardDescription className="text-center text-2xl font-light">Welcome Back</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Status Message */}
            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

            {/* Login Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-lg p-1">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="login-link">Login Link</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {/* Password Login */}
                <TabsContent value="password" className="space-y-4">
                  <form onSubmit={handlePasswordLogin}>
                    <div className="grid gap-4">
                      {/* Email */}
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={passwordForm.data.email}
                          onChange={e => passwordForm.setData('email', e.target.value)}
                          placeholder="name@example.com"
                          required
                          autoFocus
                          autoComplete="username"
                        />
                        <InputError message={passwordForm.errors.email} />
                      </div>

                      {/* Password */}
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          {canResetPassword && (
                            <Link
                              href={route('password.request')}
                              className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                            >
                              Forgot password?
                            </Link>
                          )}
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={passwordForm.data.password}
                          onChange={e => passwordForm.setData('password', e.target.value)}
                          required
                          autoComplete="current-password"
                        />
                        <InputError message={passwordForm.errors.password} />
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={passwordForm.data.remember}
                          onCheckedChange={checked => passwordForm.setData('remember', checked)}
                          name="remember"
                        />
                        <label htmlFor="remember" className="text-sm text-muted-foreground">
                          Remember me
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className={`w-full ${passwordForm.processing ? 'opacity-75' : ''}`}
                        disabled={isProcessing}
                      >
                        {passwordForm.processing ? 'Signing in...' : 'Sign in'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Login Link */}
                <TabsContent value="login-link" className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    We'll send you a login link for password-free sign in.
                  </div>
                  <form onSubmit={handleLoginLink}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="login-link-email">Email</Label>
                        <Input
                          id="login-link-email"
                          type="email"
                          value={loginLinkForm.data.email}
                          onChange={e => loginLinkForm.setData('email', e.target.value)}
                          required
                          placeholder="name@example.com"
                        />
                        <InputError message={loginLinkForm.errors.email} />
                      </div>

                      <Button
                        type="submit"
                        className={`w-full ${loginLinkForm.processing ? 'opacity-75' : ''}`}
                        disabled={isProcessing}
                      >
                        {loginLinkForm.processing ? 'Sending...' : 'Send Login Link'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </div>
            </Tabs>

            {/* OAuth Section */}
            {hasOauthProviders && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-2">
                  {Object.entries(availableOauthProviders).map(([key, provider]) => (
                    <SocialLoginButton key={key} provider={provider} disabled={isProcessing} />
                  ))}
                </div>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?
              {' '}
              <Link href={route('register')} className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
