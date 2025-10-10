import InputError from '@/Components/InputError'
import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { useForm } from '@inertiajs/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

export default memo(({ status }) => {
  useSeoMetaTags({
    title: 'Forgot Password',
  })

  const form = useForm({
    email: '',
  })

  const submit = (e) => {
    e.preventDefault()
    form.post(route('password.email'))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <AuthenticationCardLogo />
          </CardTitle>
          <CardDescription className="text-center text-2xl">
            Reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Forgot your password? No problem. Just let us know your email address and we will email you a
            password reset link that will allow you to choose a new one.
          </div>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
              {status}
            </div>
          )}

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

            <div className="mt-4 flex items-center justify-end">
              <Button
                className={form.processing ? 'opacity-25' : ''}
                disabled={form.processing}
              >
                Email Password Reset Link
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})
