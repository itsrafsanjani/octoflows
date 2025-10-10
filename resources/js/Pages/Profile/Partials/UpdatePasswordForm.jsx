import FormSection from '@/Components/FormSection'
import InputError from '@/Components/InputError'
import { Button } from '@/Components/shadcn/ui/button'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useForm } from '@inertiajs/react'
import { memo, useRef } from 'react'
import { toast } from 'sonner'
import { route } from 'ziggy-js'

export default memo(() => {
  const passwordRef = useRef(null)
  const currentPasswordRef = useRef(null)

  const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const updatePassword = () => {
    form.put(route('user-password.update'), {
      errorBag: 'updatePassword',
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        toast.success('Password updated')
      },
      onError: () => {
        if (form.errors.password) {
          form.setData('password', '')
          form.setData('password_confirmation', '')
          passwordRef.current?.focus()
        }
        if (form.errors.current_password) {
          form.setData('current_password', '')
          currentPasswordRef.current?.focus()
        }
      },
    })
  }

  return (
    <FormSection
      onSubmit={updatePassword}
      title="Update Password"
      description="Ensure your account is using a long, random password to stay secure."
      form={(
        <>
          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              ref={passwordRef}
              type="password"
              value={form.data.password}
              onChange={e => form.setData('password', e.target.value)}
              className="mt-1 block w-full"
              autoComplete="new-password"
            />
            <InputError message={form.errors.password} className="mt-2" />
          </div>

          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={form.data.password_confirmation}
              onChange={e => form.setData('password_confirmation', e.target.value)}
              className="mt-1 block w-full"
              autoComplete="new-password"
            />
            <InputError message={form.errors.password_confirmation} className="mt-2" />
          </div>
        </>
      )}
      actions={
        <Button disabled={form.processing}>Save</Button>
      }
    />
  )
})
