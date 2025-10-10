import { Avatar, AvatarFallback, AvatarImage } from '@/Components/shadcn/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/shadcn/ui/dropdown-menu'
import { SidebarMenuButton } from '@/Components/shadcn/ui/sidebar'
import { Icon } from '@iconify/react'
import { Link, router, usePage } from '@inertiajs/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

export default memo(() => {
  const { auth } = usePage().props

  const logout = () => {
    router.post(route('logout'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={auth.user.profile_photo_path ?? ''}
              alt={auth.user.name}
            />
            <AvatarFallback className="rounded-lg">
              {auth.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{auth.user.name}</span>
            <span className="truncate text-xs">{auth.user.email}</span>
          </div>
          <Icon icon="lucide:chevrons-up-down" className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={auth.user.profile_photo_path ?? ''}
                alt={auth.user.name}
              />
              <AvatarFallback className="rounded-lg">
                {auth.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{auth.user.name}</span>
              <span className="truncate text-xs">{auth.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={route('profile.show')}>
              <Icon icon="lucide:settings" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={route('api-tokens.index')}>
              <Icon icon="lucide:key" />
              API Tokens
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={route('subscriptions.create')}>
              <Icon icon="lucide:credit-card" />
              Billing
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <Icon icon="lucide:log-out" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
