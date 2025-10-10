import { cn } from '@/Components/lib/utils'
import { memo } from 'react'

export default memo(({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-left text-left rounded-lg border bg-card p-6 shadow-2xs',
        className,
      )}
    >
      <div className="size-12 text-primary text-3xl">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>
      <p className="mt-2 text-muted-foreground">
        {description}
      </p>
    </div>
  )
})
