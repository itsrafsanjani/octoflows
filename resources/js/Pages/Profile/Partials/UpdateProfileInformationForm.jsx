import FormSection from '@/Components/FormSection'
import InputError from '@/Components/InputError'
import { Button } from '@/Components/shadcn/ui/button'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import { memo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { route } from 'ziggy-js'

export default memo(({ user }) => {
  const { props: { jetstream } } = usePage()
  const [verificationLinkSent, setVerificationLinkSent] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const photoRef = useRef(null)

  const form = useForm({
    _method: 'PUT',
    name: user.name,
    email: user.email,
    photo: null,
  })

  const clearPhotoFileInput = () => {
    if (photoRef.current?.value) {
      photoRef.current.value = null
    }
  }

  const updateProfileInformation = (e) => {
    e.preventDefault()
    if (photoRef.current?.files[0]) {
      form.setData('photo', photoRef.current.files[0])
    }

    form.post(route('user-profile-information.update'), {
      errorBag: 'updateProfileInformation',
      preserveScroll: true,
      onSuccess: () => {
        clearPhotoFileInput()
        toast.success('Profile information updated')
      },
    })
  }

  const sendEmailVerification = () => {
    setVerificationLinkSent(true)
  }

  const selectNewPhoto = () => {
    photoRef.current?.click()
  }

  const updatePhotoPreview = () => {
    const photo = photoRef.current?.files[0]
    if (!photo)
      return

    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target.result)
    }
    reader.readAsDataURL(photo)
  }

  const deletePhoto = () => {
    router.delete(route('current-user-photo.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        setPhotoPreview(null)
        clearPhotoFileInput()
        toast.success('Photo deleted')
      },
    })
  }

  return (
    <FormSection
      onSubmit={updateProfileInformation}
      title="Profile Information"
      description="Update your account's profile information and email address."
      form={(
        <>
          {/* Profile Photo */}
          {jetstream.managesProfilePhotos && (
            <div className="col-span-6 sm:col-span-4">
              <input
                ref={photoRef}
                type="file"
                className="hidden"
                onChange={updatePhotoPreview}
              />

              <Label htmlFor="photo">Photo</Label>

              {!photoPreview && user.profile_photo_url && (
                <div className="mt-2">
                  <img
                    src={user.profile_photo_url}
                    alt={user.name}
                    className="size-20 rounded-full object-cover"
                  />
                </div>
              )}

              {photoPreview && (
                <div className="mt-2">
                  <span
                    className="block size-20 rounded-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${photoPreview}')` }}
                  />
                </div>
              )}

              <Button
                type="button"
                variant="secondary"
                className="me-2 mt-2"
                onClick={selectNewPhoto}
              >
                Select A New Photo
              </Button>

              {user.profile_photo_path && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={deletePhoto}
                >
                  Remove Photo
                </Button>
              )}

              <InputError message={form.errors.photo} className="mt-2" />
            </div>
          )}

          {/* Name */}
          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={form.data.name}
              onChange={e => form.setData('name', e.target.value)}
              className="mt-1 block w-full"
              required
              autoComplete="name"
            />
            <InputError message={form.errors.name} className="mt-2" />
          </div>

          {/* Email */}
          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.data.email}
              disabled
              className="mt-1 block w-full"
              required
              autoComplete="username"
            />
            <InputError message={form.errors.email} className="mt-2" />

            {jetstream.hasEmailVerification && !user.email_verified_at && (
              <div>
                <p className="mt-2 text-sm">
                  Your email address is unverified.
                  <Link
                    href={route('verification.send')}
                    method="post"
                    type="button"
                    as="button"
                    onClick={sendEmailVerification}
                    className="rounded-md text-sm underline focus:outline-hidden focus:ring-2 focus:ring-offset-2"
                  >
                    Click here to re-send the verification email.
                  </Link>
                </p>

                {verificationLinkSent && (
                  <div className="mt-2 text-sm font-medium">
                    A new verification link has been sent to your email address.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      actions={
        <Button disabled={form.processing}>Save</Button>
      }
    />
  )
})
