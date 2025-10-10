import FormSection from '@/Components/FormSection'
import InputError from '@/Components/InputError'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/shadcn/ui/avatar'
import { Button } from '@/Components/shadcn/ui/button'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'

export default function CreateTeamForm() {
  const { props: { auth: { user } } } = usePage()
  const form = useForm({
    name: '',
  })

  function createTeam() {
    form.post(route('teams.store'), {
      errorBag: 'createTeam',
      preserveScroll: true,
    })
  }

  return (
    <FormSection
      onSubmit={createTeam}
      title="Team Details"
      description="Create a new team to collaborate with others on projects."
      form={(
        <>
          <div className="col-span-6">
            <Label>Team Owner</Label>

            <div className="flex items-center mt-2">
              <Avatar>
                <AvatarImage
                  src={user.profile_photo_path ?? ''}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-full bg-secondary p-2">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="ms-4 leading-tight">
                <div className="text-gray-900 dark:text-white">
                  {user.name}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              type="text"
              value={form.data.name}
              onChange={e => form.setData('name', e.target.value)}
              className="block w-full mt-1"
              autoFocus
            />
            <InputError message={form.errors.name} className="mt-2" />
          </div>
        </>
      )}
      actions={(
        <Button
          disabled={form.processing}
          className={form.processing ? 'opacity-25' : ''}
        >
          Create
        </Button>
      )}
    />
  )
}
