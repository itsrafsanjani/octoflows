import { cn } from '@/Components/lib/utils'
import { Label } from '@/Components/shadcn/ui/label'
import { memo } from 'react'

export default memo(({ message, className }) => {
  if (!message)
    return null

  return (
    <Label className={cn('text-destructive', className)}>
      {message}
    </Label>
  )
})
