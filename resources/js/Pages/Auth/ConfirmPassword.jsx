import InputError from '@/Components/InputError'
import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { useForm } from '@inertiajs/react'
import { memo, useRef } from 'react'
import { route } from 'ziggy-js'

export default memo(() => {
  useSeoMetaTags({
    title: 'Confirm Password',
  })

  const form = useForm({
    password: '',
  })

  const passwordInput = useRef(null)

  const submit = (e) => {
    e.preventDefault()
    form.post(route('password.confirm'), {
      onFinish: () => {
        form.reset()
        passwordInput.current?.focus()
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <AuthenticationCardLogo />
          </CardTitle>
          <CardDescription className="text-center text-2xl">
            Confirm your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            This is a secure area of the application. Please confirm your password before continuing.
          </div>

          <form onSubmit={submit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  ref={passwordInput}
                  type="password"
                  value={form.data.password}
                  onChange={e => form.setData('password', e.target.value)}
                  required
                  autoComplete="current-password"
                  autoFocus
                />
                <InputError message={form.errors.password} />
              </div>

              <Button
                type="submit"
                className={form.processing ? 'opacity-25' : ''}
                disabled={form.processing}
              >
                Confirm
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})
