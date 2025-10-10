import { cn } from '@/Components/lib/utils'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardFooter } from '@/Components/shadcn/ui/card'
import { CheckIcon } from 'lucide-react'
import { memo } from 'react'

const defaultFeatures = [
  'Production-ready Docker setup',
  'Advanced authentication system',
  'API endpoints with Sanctum',
  'Comprehensive documentation',
  'Regular updates & improvements',
  'Best In Class IDE support',
]

export default memo(({
  features = defaultFeatures,
  price = 19,
  plan = 'PRO',
  description = 'Perfect for growing businesses',
  billingPeriod = 'Billed Monthly',
  buttonText = 'Get Started',
  buttonVariant = 'default',
  buttonHref = '/login',
  className = '',
  headerSlot,
  featuresSlot,
  pricingSlot,
  actionSlot,
  footerSlot,
}) => {
  return (
    <Card className={cn('w-full', className)}>
      <div className="grid w-full items-start gap-10 rounded-lg border p-8 md:grid-cols-[1fr_200px]">
        <div className="grid gap-4 sm:gap-6">
          {headerSlot || (
            <>
              <h3 className="text-lg sm:text-xl font-bold md:text-2xl">
                {plan}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
              </p>
            </>
          )}
          {featuresSlot || (
            <ul className="grid gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground sm:grid-cols-2">
              {features.map(feature => (
                <li key={feature} className="flex items-center">
                  <CheckIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 text-center justify-around max-w-full h-full mt-4 md:mt-0">
          {pricingSlot || (
            <div>
              <h4 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold">
                $
                {price}
              </h4>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {billingPeriod}
              </p>
            </div>
          )}
          {actionSlot || (
            <Button
              asChild
              variant={buttonVariant}
              className="w-full text-xs sm:text-sm"
            >
              <a href={buttonHref}>{buttonText}</a>
            </Button>
          )}
        </div>
      </div>

      {footerSlot && <CardFooter className="p-4">{footerSlot}</CardFooter>}
    </Card>
  )
})
