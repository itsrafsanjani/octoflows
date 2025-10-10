import { Label } from '@/Components/shadcn/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/shadcn/ui/select'

export default function ModelSelector({ models, onModelSelect }) {
  return (
    <div>
      <Label htmlFor="model">Model</Label>
      <Select
        id="model"
        defaultValue={models[0]}
        onValueChange={value => onModelSelect(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={models[0]} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {models.map(model => (
              <SelectItem key={model} value={model}>
                <span className="text-sm">{model}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
