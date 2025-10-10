import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'
import { Link, useForm } from '@inertiajs/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

export default memo(({ status }) => {
  useSeoMetaTags({
    title: 'Email Verification',
  })

  const form = useForm({})

  const submit = (e) => {
    e.preventDefault()
    form.post(route('verification.send'))
  }

  const verificationLinkSent = status === 'verification-link-sent'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <AuthenticationCardLogo />
          </CardTitle>
          <CardDescription className="text-center text-2xl">
            Verify your email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Before continuing, could you verify your email address by clicking on the link we just emailed to
            you? If you didn't receive the email, we will gladly send you another.
          </div>

          {verificationLinkSent && (
            <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
              A new verification link has been sent to the email address you provided in your profile settings.
            </div>
          )}

          <form onSubmit={submit}>
            <div className="mt-4 flex items-center justify-between">
              <Button
                className={form.processing ? 'opacity-25' : ''}
                disabled={form.processing}
              >
                Resend Verification Email
              </Button>

              <div>
                <Link
                  href={route('profile.show')}
                  className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                  Edit Profile
                </Link>

                <Link
                  type="button"
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="ms-2 rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                  Log Out
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})
