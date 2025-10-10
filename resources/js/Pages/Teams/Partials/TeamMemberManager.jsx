import ActionSection from '@/Components/ActionSection'
import FormSection from '@/Components/FormSection'
import InputError from '@/Components/InputError'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/shadcn/ui/avatar'
import { Button } from '@/Components/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/shadcn/ui/dialog'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { Separator } from '@/Components/shadcn/ui/separator'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { route } from 'ziggy-js'

export default function TeamMemberManager({ team, availableRoles, userPermissions }) {
  const page = usePage()
  const [currentlyManagingRole, setCurrentlyManagingRole] = useState(false)
  const [managingRoleFor, setManagingRoleFor] = useState(null)
  const [confirmingLeavingTeam, setConfirmingLeavingTeam] = useState(false)
  const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] = useState(null)

  const addTeamMemberForm = useForm({
    email: '',
    role: null,
  })

  const updateRoleForm = useForm({
    role: null,
  })

  const leaveTeamForm = useForm({})
  const removeTeamMemberForm = useForm({})

  function addTeamMember() {
    addTeamMemberForm.post(route('team-members.store', team), {
      errorBag: 'addTeamMember',
      preserveScroll: true,
      onSuccess: () => {
        addTeamMemberForm.reset()
        toast.success('Team member added')
      },
    })
  }

  function cancelTeamInvitation(invitation) {
    router.delete(route('team-invitations.destroy', invitation), {
      preserveScroll: true,
      onSuccess: () => toast.success('Team invitation canceled'),
    })
  }

  function manageRole(teamMember) {
    setManagingRoleFor(teamMember)
    updateRoleForm.setData('role', teamMember.membership.role)
    setCurrentlyManagingRole(true)
  }

  function updateRole() {
    updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
      preserveScroll: true,
      onSuccess: () => {
        setCurrentlyManagingRole(false)
        toast.success('Team member role updated')
      },
    })
  }

  function confirmLeavingTeam() {
    setConfirmingLeavingTeam(true)
  }

  function leaveTeam() {
    leaveTeamForm.delete(route('team-members.destroy', [team, page.props.auth.user]), {
      onSuccess: () => {
        setConfirmingLeavingTeam(false)
        toast.success('Team left successfully')
      },
    })
  }

  function confirmTeamMemberRemoval(teamMember) {
    setTeamMemberBeingRemoved(teamMember)
  }

  function removeTeamMember() {
    removeTeamMemberForm.delete(route('team-members.destroy', [team, teamMemberBeingRemoved]), {
      errorBag: 'removeTeamMember',
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setTeamMemberBeingRemoved(null)
        toast.success('Team member removed successfully')
      },
    })
  }

  function displayableRole(role) {
    return availableRoles.find(r => r.key === role).name
  }

  return (
    <div>
      {userPermissions.canAddTeamMembers && (
        <div>
          <Separator className="my-8 hidden sm:block" />

          {/* Add Team Member */}
          <FormSection
            onSubmit={addTeamMember}
            title="Add Team Member"
            description="Add a new team member to your team, allowing them to collaborate with you."
            form={(
              <>
                <div className="col-span-6">
                  <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                    Please provide the email address of the person you would like to add to this team.
                  </div>
                </div>

                {/* Member Email */}
                <div className="col-span-6 sm:col-span-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={addTeamMemberForm.data.email}
                    onChange={e => addTeamMemberForm.setData('email', e.target.value)}
                    className="mt-1 block w-full"
                  />
                  <InputError message={addTeamMemberForm.errors.email} className="mt-2" />
                </div>

                {/* Role */}
                {availableRoles.length > 0 && (
                  <div className="col-span-6 lg:col-span-4">
                    <Label htmlFor="roles">Role</Label>

                    <div className="relative z-0 mt-1 cursor-pointer rounded-lg border">
                      {availableRoles.map((role, i) => (
                        <button
                          key={role.key}
                          type="button"
                          className={`relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary dark:focus:border-primary dark:focus:ring-primary ${i > 0 ? 'rounded-t-none border-t focus:border-none' : ''
                          } ${i !== Object.keys(availableRoles).length - 1
                            ? 'rounded-b-none'
                            : ''
                          }`}
                          onClick={() => addTeamMemberForm.setData('role', role.key)}
                        >
                          <div
                            className={
                              addTeamMemberForm.data.role
                              && addTeamMemberForm.data.role !== role.key
                                ? 'opacity-50'
                                : ''
                            }
                          >
                            {/* Role Name */}
                            <div className="flex items-center">
                              <div
                                className={`text-sm text-primary ${addTeamMemberForm.data.role === role.key
                                  ? 'font-semibold'
                                  : ''
                                }`}
                              >
                                {role.name}
                              </div>

                              {addTeamMemberForm.data.role === role.key && (
                                <svg
                                  className="ms-2 size-5 text-green-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              )}
                            </div>

                            {/* Role Description */}
                            <div className="mt-2 text-start text-xs">
                              {role.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <InputError
                      message={addTeamMemberForm.errors.role}
                      className="mt-2"
                    />
                  </div>
                )}
              </>
            )}
            actions={(
              <Button
                disabled={addTeamMemberForm.processing}
                className={addTeamMemberForm.processing ? 'opacity-25' : ''}
              >
                Add
              </Button>
            )}
          />
        </div>
      )}

      {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers && (
        <div>
          <Separator className="my-8 hidden sm:block" />

          {/* Team Member Invitations */}
          <ActionSection
            className="mt-10 sm:mt-0"
            title="Pending Team Invitations"
            description="These people have been invited to your team and have been sent an invitation email. They may join
  the team by accepting the email invitation."
            content={(
              <div className="space-y-6">
                {team.team_invitations.map(invitation => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between"
                  >
                    <div className="text-gray-600 dark:text-gray-400">
                      {invitation.email}
                    </div>

                    <div className="flex items-center">
                      {/* Cancel Team Invitation */}
                      {userPermissions.canRemoveTeamMembers && (
                        <button
                          type="button"
                          className="ms-6 cursor-pointer text-sm text-red-500 focus:outline-hidden"
                          onClick={() => cancelTeamInvitation(invitation)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      )}

      {team.users.length > 0 && (
        <div>
          <Separator className="my-8 hidden sm:block" />

          {/* Manage Team Members */}
          <ActionSection
            className="mt-10 sm:mt-0"
            title="Team Members"
            description="All of the people that are part of this team."
            content={(
              <div className="space-y-6">
                {team.users.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar size="sm" shape="circle">
                        <AvatarImage
                          src={user.profile_photo_url ?? ''}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ms-4">
                        {user.name}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {/* Manage Team Member Role */}
                      {userPermissions.canUpdateTeamMembers && availableRoles.length > 0
                        ? (
                            <button
                              type="button"
                              className="ms-2 text-sm underline"
                              onClick={() => manageRole(user)}
                            >
                              {displayableRole(user.membership.role)}
                            </button>
                          )
                        : availableRoles.length > 0
                          ? (
                              <div className="ms-2 text-sm">
                                {displayableRole(user.membership.role)}
                              </div>
                            )
                          : null}

                      {/* Leave Team */}
                      {page.props.auth.user.id === user.id && (
                        <button
                          type="button"
                          className="ms-6 cursor-pointer text-sm text-red-500"
                          onClick={confirmLeavingTeam}
                        >
                          Leave
                        </button>
                      )}

                      {/* Remove Team Member */}
                      {userPermissions.canRemoveTeamMembers && page.props.auth.user.id !== user.id && (
                        <button
                          type="button"
                          className="ms-6 cursor-pointer text-sm text-red-500"
                          onClick={() => confirmTeamMemberRemoval(user)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      )}

      {/* Role Management Modal */}
      <Dialog open={currentlyManagingRole} onOpenChange={setCurrentlyManagingRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Role</DialogTitle>
            <DialogDescription>
              Manage the role of this team member.
            </DialogDescription>
          </DialogHeader>

          {managingRoleFor && (
            <div className="relative z-0 mt-1 cursor-pointer rounded-lg border border-primary">
              {availableRoles.map((role, i) => (
                <button
                  key={role.key}
                  type="button"
                  className={`relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary ${i > 0 ? 'rounded-t-none border-t focus:border-none' : ''
                  } ${i !== Object.keys(availableRoles).length - 1
                    ? 'rounded-b-none'
                    : ''
                  }`}
                  onClick={() => updateRoleForm.setData('role', role.key)}
                >
                  <div
                    className={
                      updateRoleForm.data.role
                      && updateRoleForm.data.role !== role.key
                        ? 'opacity-50'
                        : ''
                    }
                  >
                    {/* Role Name */}
                    <div className="flex items-center">
                      <div
                        className={`text-sm ${updateRoleForm.data.role === role.key
                          ? 'font-semibold'
                          : ''
                        }`}
                      >
                        {role.name}
                      </div>

                      {updateRoleForm.data.role === role.key && (
                        <svg
                          className="ms-2 size-5 text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Role Description */}
                    <div className="mt-2 text-xs">
                      {role.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setCurrentlyManagingRole(false)}>
              Cancel
            </Button>

            <Button
              className={`ms-3 ${updateRoleForm.processing ? 'opacity-25' : ''}`}
              disabled={updateRoleForm.processing}
              onClick={updateRole}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Team Confirmation Modal */}
      <Dialog open={confirmingLeavingTeam} onOpenChange={setConfirmingLeavingTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Team</DialogTitle>
            <DialogDescription>
              Are you sure you would like to leave this team?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmingLeavingTeam(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              className={`ms-3 ${leaveTeamForm.processing ? 'opacity-25' : ''}`}
              disabled={leaveTeamForm.processing}
              onClick={leaveTeam}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Team Member Confirmation Modal */}
      <Dialog
        open={teamMemberBeingRemoved !== null}
        onOpenChange={value => !value && setTeamMemberBeingRemoved(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you would like to remove this person from the team?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setTeamMemberBeingRemoved(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              className={`ms-3 ${removeTeamMemberForm.processing ? 'opacity-25' : ''}`}
              disabled={removeTeamMemberForm.processing}
              onClick={removeTeamMember}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
