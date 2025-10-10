import { Separator } from '@/Components/shadcn/ui/separator'
import AppLayout from '@/Layouts/AppLayout'
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm'
import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager'
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm'

export default function Show({ team, availableRoles, permissions }) {
  return (
    <AppLayout title="Team Settings">
      <div>
        <div className="max-w-7xl">
          <UpdateTeamNameForm team={team} permissions={permissions} />

          <TeamMemberManager
            className="mt-10 sm:mt-0"
            team={team}
            availableRoles={availableRoles}
            userPermissions={permissions}
          />

          {permissions.canDeleteTeam && !team.personal_team && (
            <>
              <Separator className="my-8 hidden sm:block" />
              <DeleteTeamForm className="mt-10 sm:mt-0" team={team} />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
