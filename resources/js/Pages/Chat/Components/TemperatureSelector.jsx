import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/Components/shadcn/ui/hover-card'
import { Label } from '@/Components/shadcn/ui/label'
import { Slider } from '@/Components/shadcn/ui/slider'
import { useState } from 'react'

const DEFAULT_TEMP = [0.5]

export default function TemperatureSelector({ defaultValue = DEFAULT_TEMP }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value[0]}
              </span>
            </div>
            <Slider
              id="temperature"
              value={value}
              onValueChange={setValue}
              min={0}
              max={1}
              step={0.1}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Temperature"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Controls randomness: lowering results in less random completions. As the
          temperature approaches zero, the model will become deterministic and
          repetitive.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
