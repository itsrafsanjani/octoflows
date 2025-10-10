import InputError from '@/Components/InputError'
import { Alert, AlertDescription, AlertTitle } from '@/Components/shadcn/ui/alert'
import { Button } from '@/Components/shadcn/ui/button'
import { Label } from '@/Components/shadcn/ui/label'
import { Skeleton } from '@/Components/shadcn/ui/skeleton'
import { Textarea } from '@/Components/shadcn/ui/textarea'
import AppLayout from '@/Layouts/AppLayout'
import { Icon } from '@iconify/react'
import { router, usePage } from '@inertiajs/react'
import { memo, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { route } from 'ziggy-js'
import ModelSelector from './Components/ModelSelector'
import TemperatureSelector from './Components/TemperatureSelector'

export default memo(({ systemPrompt, models, subscriptionEnabled }) => {
  const [userInput, setUserInput] = useState('')
  const [modelOutput, setModelOutput] = useState(null)
  const [error, setError] = useState(null)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const page = usePage()

  const onModelSelect = (model) => {
    setSelectedModel(model)
  }

  const submit = async () => {
    if (!userInput.trim()) {
      setError('Please enter a message')
      return
    }

    setError(null)

    try {
      const response = await fetch('/prism/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'user', content: userInput },
          ],
        }),
      })

      const data = await response.json()
      setModelOutput(data.choices[0].message.content)
    }
    catch {
      setError('An error occurred while submitting your message.')
    }
  }

  useEffect(() => {
    if (!subscriptionEnabled) {
      const promise = new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve(route('subscriptions.create'))
        }, 5000)
        return () => clearTimeout(timeoutId)
      })

      toast.promise(promise, {
        loading: 'Pro Subscription Required to use this feature.',
        success: (data) => {
          router.visit(data)
        },
      })
    }
  }, [subscriptionEnabled])

  const title = `${page.props.name} - AI Playground`

  return (
    <AppLayout title={title}>
      <div className="h-full flex-col flex">
        <Alert className="mb-4">
          <Icon icon="lucide:info" className="size-4" />
          <AlertTitle>Demo AI Chat</AlertTitle>
          <AlertDescription>
            This is a demo AI chat. You can use it to test the AI chat. And This is subscrition protected page
            so you can't use it without subscription.
          </AlertDescription>
        </Alert>

        {subscriptionEnabled && (
          <div className="flex-1">
            <div className="h-full">
              <div className="grid h-full items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_180px]">
                <div className="flex-col space-y-4 flex md:order-2">
                  <ModelSelector models={models} onModelSelect={onModelSelect} />
                  <TemperatureSelector />
                </div>

                <div className="order-1">
                  <div className="mt-0 border-0 p-0">
                    <div className="flex flex-col space-y-4">
                      <div className="grid h-full gap-6 lg:grid-cols-2">
                        <div className="flex flex-col space-y-4">
                          <div className="flex flex-1 flex-col space-y-2">
                            <Label htmlFor="input">System Input</Label>
                            <Textarea
                              id="input"
                              disabled
                              defaultValue={systemPrompt}
                              className="flex-1 lg:min-h-[320px]"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="instructions">User Input</Label>
                            <Textarea
                              id="instructions"
                              value={userInput}
                              onChange={e => setUserInput(e.target.value)}
                              className="lg:min-h-[320px]"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="output">Model Output</Label>
                          {!modelOutput
                            ? (
                                <Skeleton className="h-20 sm:h-full min-h-[400px] lg:min-h-[700px] rounded-md" />
                              )
                            : (
                                <Textarea
                                  id="output"
                                  disabled
                                  className="min-h-[400px] rounded-md bg-muted border lg:min-h-[700px]"
                                  defaultValue={modelOutput}
                                />
                              )}
                        </div>
                      </div>
                      {!modelOutput && (
                        <div className="flex items-center space-x-2">
                          <Button onClick={submit}>
                            <span>Submit</span>
                          </Button>
                          {error && <InputError message={error} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
})
