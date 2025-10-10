import { Avatar, AvatarFallback } from '@/Components/shadcn/ui/avatar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/Components/shadcn/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/Components/shadcn/ui/dropdown-menu'
import { SidebarMenuButton } from '@/Components/shadcn/ui/sidebar'
import { Icon } from '@iconify/react'
import { Link, router, usePage } from '@inertiajs/react'
import { memo, useState } from 'react'
import { route } from 'ziggy-js'

export default memo(() => {
  const [open, setOpen] = useState(false)
  const { auth, jetstream } = usePage().props

  const switchToTeam = (team) => {
    router.put(route('current-team.update'), {
      team_id: team.id,
    }, {
      preserveState: false,
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon icon="lucide:rocket" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{auth.user.current_team.name}</span>
            <span className="truncate text-xs">Manage Team</span>
          </div>
          <Icon icon="lucide:chevrons-up-down" className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg p-0"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup heading="Switch Teams">
              {auth.user.all_teams.map(team => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => {
                    switchToTeam(team)
                    setOpen(false)
                  }}
                >
                  <Avatar className="mr-2 size-5">
                    <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {team.name}
                  {team.id === auth.user.current_team_id && (
                    <Icon
                      icon="lucide:check"
                      className="ml-auto size-4"
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {auth.user.all_teams.length > 1 && <CommandSeparator />}
          <CommandGroup heading="Manage Team">
            <CommandItem value="team-settings">
              <Link href={route('teams.show', auth.user.current_team)}>
                Team Settings
              </Link>
            </CommandItem>
            {jetstream.canCreateTeams && (
              <CommandItem value="create-new-team">
                <Link href={route('teams.create')}>
                  Create New Team
                </Link>
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
