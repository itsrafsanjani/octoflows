import { Button } from '@/Components/shadcn/ui/button'
import { Icon } from '@iconify/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

function toSentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default memo(({ provider, disabled = false }) => {
  return (
    <Button
      disabled={disabled}
      className="bg-background text-foreground hover:bg-secondary disabled:opacity-50 dark:hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground"
      asChild
    >
      <a href={route('oauth.redirect', { provider: provider.slug })}>
        <Icon icon={provider.icon} className="mr-2 h-4 w-4" />
        Sign In With
        {' '}
        {toSentenceCase(provider.slug)}
      </a>
    </Button>
  )
})
