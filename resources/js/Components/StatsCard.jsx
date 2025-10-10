import { Card, CardContent, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Icon } from '@iconify/react'
import { memo } from 'react'

export default memo(({ value, description = '', link = '', icon = 'info' }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener"
    >
      <Card className="hover:shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Icon
              icon={icon}
              className="size-8"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-primary">
            {value}
          </div>
          <p className="text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </a>
  )
})
