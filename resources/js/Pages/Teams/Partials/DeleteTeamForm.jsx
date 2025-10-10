import ActionSection from '@/Components/ActionSection'
import { Button } from '@/Components/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/shadcn/ui/dialog'
import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import { route } from 'ziggy-js'

export default function DeleteTeamForm({ team }) {
  const [confirmingTeamDeletion, setConfirmingTeamDeletion] = useState(false)
  const form = useForm({})

  function confirmTeamDeletion() {
    setConfirmingTeamDeletion(true)
  }

  function deleteTeam() {
    form.delete(route('teams.destroy', team), {
      errorBag: 'deleteTeam',
    })
  }

  return (
    <ActionSection
      title="Delete Team"
      description="Permanently delete this team."
      content={(
        <>
          <div className="max-w-xl text-sm">
            Once a team is deleted, all of its resources and data will be permanently deleted. Before deleting this team, please download any data or information regarding this team that you wish to retain.
          </div>

          <div className="mt-5">
            <Button
              variant="destructive"
              onClick={confirmTeamDeletion}
            >
              Delete Team
            </Button>
          </div>

          {/* Delete Team Confirmation Modal */}
          <Dialog
            open={confirmingTeamDeletion}
            onOpenChange={setConfirmingTeamDeletion}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Team</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this team? Once a team is deleted,
                  all of its resources and data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setConfirmingTeamDeletion(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  className={`ms-3 ${form.processing ? 'opacity-25' : ''}`}
                  disabled={form.processing}
                  onClick={deleteTeam}
                >
                  Delete Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    />
  )
}
