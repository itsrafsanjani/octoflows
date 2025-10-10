import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/Components/shadcn/ui/sidebar'
import { Icon } from '@iconify/react'
import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { route } from 'ziggy-js'

const navigationConfig = [
  {
    label: 'Platform',
    items: [
      { name: 'Dashboard', icon: 'lucide:layout-dashboard', route: 'dashboard', isActive: true },
      { name: 'Settings', icon: 'lucide:settings', route: 'profile.show' },
      { name: 'Chat', icon: 'lucide:message-circle', route: 'chat.index' },
    ],
  },
  {
    label: 'API',
    items: [
      { name: 'API Tokens', icon: 'lucide:key', route: 'api-tokens.index' },
      { name: 'API Documentation', icon: 'lucide:book-heart', route: 'scribe', external: true },
    ],
  },
  {
    label: null,
    class: 'mt-auto',
    items: [
      {
        name: 'Support',
        icon: 'lucide:life-buoy',
        href: 'https://github.com/shipfastlabs/larasonic-react/issues',
        external: true,
      },
      {
        name: 'Documentation',
        icon: 'lucide:book-marked',
        href: 'https://docs.larasonic.com',
        external: true,
      },
    ],
  },
]

export default function AppSidebarContent() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    document.documentElement.setAttribute('class', newMode ? 'dark' : '')
  }

  const renderLink = (item) => {
    if (item.external) {
      return {
        Component: 'a',
        props: {
          href: item.href || route(item.route),
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }
    }
    return {
      Component: Link,
      props: {
        href: route(item.route),
      },
    }
  }

  return (
    <SidebarContent>
      {navigationConfig.map((group, index) => (
        <SidebarGroup key={group.label} className={group.class}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => {
              const { Component, props } = renderLink(item)
              return (
                <SidebarMenuItem
                  key={item.name}
                  active={!item.external && route().current(item.route)}
                >
                  <SidebarMenuButton asChild isActive={!item.external && route().current(item.route)}>
                    <Component {...props}>
                      <Icon icon={item.icon} className="h-4 w-4" />
                      {item.name}
                    </Component>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
            {index === navigationConfig.length - 1 && (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleDarkMode}>
                  <Icon icon={isDarkMode ? 'lucide:moon' : 'lucide:sun'} className="mr-2" />
                  {isDarkMode ? 'Dark' : 'Light'}
                  {' '}
                  Mode
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}
