import InputError from '@/Components/InputError'
import { cn } from '@/Components/lib/utils'
import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { useForm } from '@inertiajs/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

export default memo(({ email, token }) => {
  useSeoMetaTags({
    title: 'Reset Password',
  })

  const form = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    form.post(route('password.update'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className={cn('mx-auto max-w-lg', 'w-[380px]')}>
        <CardHeader>
          <CardTitle className="flex justify-center">
            <AuthenticationCardLogo />
          </CardTitle>
          <CardDescription className="text-center text-2xl">
            Set your new password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.data.email}
                onChange={e => form.setData('email', e.target.value)}
                className="mt-1 block w-full"
                required
                autoFocus
                autoComplete="username"
              />
              <InputError className="mt-2" message={form.errors.email} />
            </div>

            <div className="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.data.password}
                onChange={e => form.setData('password', e.target.value)}
                className="mt-1 block w-full"
                required
                autoComplete="new-password"
              />
              <InputError className="mt-2" message={form.errors.password} />
            </div>

            <div className="mt-4">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={form.data.password_confirmation}
                onChange={e => form.setData('password_confirmation', e.target.value)}
                className="mt-1 block w-full"
                required
                autoComplete="new-password"
              />
              <InputError className="mt-2" message={form.errors.password_confirmation} />
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Button
                className={form.processing ? 'opacity-25' : ''}
                disabled={form.processing}
              >
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})
