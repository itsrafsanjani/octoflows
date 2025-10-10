import AppLayout from '@/Layouts/AppLayout'
import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm'

export default function Create() {
  return (
    <AppLayout title="Create Team">
      <div>
        <div className="max-w-7xl">
          <CreateTeamForm />
        </div>
      </div>
    </AppLayout>
  )
}
