import InputError from '@/Components/InputError'
import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Checkbox } from '@/Components/shadcn/ui/checkbox'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { Link, useForm, usePage } from '@inertiajs/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

export default memo(() => {
  const { props: { jetstream } } = usePage()

  useSeoMetaTags({
    title: 'Register',
  })

  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  })

  const submit = (e) => {
    e.preventDefault()
    form.post(route('register'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
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
            Create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={form.data.name}
                  onChange={e => form.setData('name', e.target.value)}
                  required
                  autoFocus
                  autoComplete="name"
                />
                <InputError message={form.errors.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.data.email}
                  onChange={e => form.setData('email', e.target.value)}
                  required
                  autoComplete="username"
                />
                <InputError message={form.errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.data.password}
                  onChange={e => form.setData('password', e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <InputError message={form.errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={form.data.password_confirmation}
                  onChange={e => form.setData('password_confirmation', e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <InputError message={form.errors.password_confirmation} />
              </div>

              {jetstream?.hasTermsAndPrivacyPolicyFeature && (
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={form.data.terms}
                      onCheckedChange={checked => form.setData('terms', checked)}
                      name="terms"
                      required
                    />
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the
                      {' '}
                      <a target="_blank" href={route('terms.show')} className="rounded-md text-sm underline">
                        Terms of Service
                      </a>
                      {' '}
                      and
                      {' '}
                      <a target="_blank" href={route('policy.show')} className="rounded-md text-sm underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  <InputError message={form.errors.terms} />
                </div>
              )}

              <div className="flex items-center justify-end gap-4">
                <Link href={route('login')} className="text-sm underline">
                  Already registered?
                </Link>

                <Button
                  className={form.processing ? 'opacity-25' : ''}
                  disabled={form.processing}
                >
                  Register
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})
