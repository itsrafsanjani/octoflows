import InputError from '@/Components/InputError'
import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { useForm } from '@inertiajs/react'
import { memo, useRef, useState } from 'react'
import { route } from 'ziggy-js'

export default memo(() => {
  useSeoMetaTags({
    title: 'Two-factor Confirmation',
  })

  const [recovery, setRecovery] = useState(false)

  const form = useForm({
    code: '',
    recovery_code: '',
  })

  const recoveryCodeInput = useRef(null)
  const codeInput = useRef(null)

  const toggleRecovery = () => {
    setRecovery(prev => !prev)
    if (!recovery) {
      form.setData('code', '')
      setTimeout(() => recoveryCodeInput.current?.focus(), 0)
    }
    else {
      form.setData('recovery_code', '')
      setTimeout(() => codeInput.current?.focus(), 0)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    form.post(route('two-factor.login'))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <AuthenticationCardLogo />
          </CardTitle>
          <CardDescription className="text-center text-2xl">
            Two-factor authentication
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 text-sm">
            {!recovery
              ? (
                  'Please confirm access to your account by entering the authentication code provided by your authenticator application.'
                )
              : (
                  'Please confirm access to your account by entering one of your emergency recovery codes.'
                )}
          </div>

          <form onSubmit={submit}>
            {!recovery
              ? (
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      ref={codeInput}
                      type="text"
                      inputMode="numeric"
                      value={form.data.code}
                      onChange={e => form.setData('code', e.target.value)}
                      className="mt-1 block w-full"
                      autoFocus
                      autoComplete="one-time-code"
                    />
                    <InputError className="mt-2" message={form.errors.code} />
                  </div>
                )
              : (
                  <div>
                    <Label htmlFor="recovery_code">Recovery Code</Label>
                    <Input
                      id="recovery_code"
                      ref={recoveryCodeInput}
                      type="text"
                      value={form.data.recovery_code}
                      onChange={e => form.setData('recovery_code', e.target.value)}
                      className="mt-1 block w-full"
                      autoComplete="one-time-code"
                    />
                    <InputError className="mt-2" message={form.errors.recovery_code} />
                  </div>
                )}

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                className="cursor-pointer text-sm"
                onClick={toggleRecovery}
              >
                {!recovery ? 'Use a recovery code' : 'Use an authentication code'}
              </button>

              <Button
                className={`ms-4 ${form.processing ? 'opacity-25' : ''}`}
                disabled={form.processing}
              >
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})
