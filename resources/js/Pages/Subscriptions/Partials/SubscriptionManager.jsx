import PricingCard from '@/Components/PricingCard'
import { Alert, AlertTitle } from '@/Components/shadcn/ui/alert'
import { Button } from '@/Components/shadcn/ui/button'
import { Icon } from '@iconify/react'
import { route } from 'ziggy-js'

const DEFAULT_ACTIVE = []
const DEFAULT_AVAILABLE = []

export default function SubscriptionManager({
  activeSubscriptions = DEFAULT_ACTIVE,
  availableSubscriptions = DEFAULT_AVAILABLE,
}) {
  return (
    <div className="mt-5 md:col-span-2 md:mt-0">
      <header className="pb-4">
        <h3 className="text-lg font-medium">Manage Subscriptions</h3>
      </header>

      {activeSubscriptions.length === 0
        ? (
            <div className="flex flex-col space-y-4">
              <Alert className="text-md">
                <Icon icon="lucide:triangle-alert" className="size-4" />
                <AlertTitle>
                  You are not subscribed to any plan. Subscribe to a plan to continue.
                </AlertTitle>
              </Alert>

              {availableSubscriptions.map(subscription => (
                <PricingCard
                  key={subscription.price_id}
                  plan={subscription.plan}
                  price={subscription.price}
                  description={subscription.description}
                  features={subscription.features}
                  buttonText="Subscribe"
                  buttonHref={route('subscriptions.show', {
                    subscription: subscription.price_id,
                  })}
                />
              ))}
            </div>
          )
        : (
            <div>
              <Alert>
                <AlertTitle className="flex items-center justify-between">
                  You are currently on the
                  {' '}
                  {activeSubscriptions[0].type}
                  {' '}
                  Plan.
                  <Button asChild>
                    <a href={route('subscriptions.index')}>
                      Manage Subscription
                    </a>
                  </Button>
                </AlertTitle>
              </Alert>
            </div>
          )}

      <footer className="mt-2">
        <p className="text-sm text-muted-foreground">
          🔒 Subscriptions are managed by Stripe securely.
        </p>
      </footer>
    </div>
  )
}
