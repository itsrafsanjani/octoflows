import { Button } from '@/Components/shadcn/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/shadcn/ui/dialog'
import { Input } from '@/Components/shadcn/ui/input'
import axios from 'axios'
import { memo, useRef, useState } from 'react'
import { route } from 'ziggy-js'
import InputError from './InputError'

export default memo(({
  title = 'Confirm Password',
  content = 'For your security, please confirm your password to continue.',
  button = 'Confirm',
  children,
  onConfirmed,
}) => {
  const [confirmingPassword, setConfirmingPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const passwordInput = useRef(null)

  const closeModal = () => {
    setConfirmingPassword(false)
    setPassword('')
    setError('')
  }

  const confirmPassword = () => {
    setProcessing(true)
    axios.post(route('password.confirm'), {
      password,
    }).then(() => {
      setProcessing(false)
      onConfirmed?.(password)
      closeModal()
    }).catch((error) => {
      setProcessing(false)
      setError(error.response?.data?.errors?.password?.[0])
      passwordInput.current?.focus()
    })
  }
  return (
    <span>
      <Dialog open={confirmingPassword} onOpenChange={setConfirmingPassword}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {content}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              ref={passwordInput}
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              className="mt-1 block"
              placeholder="Password"
              autoComplete="current-password"
              onKeyUp={e => e.key === 'Enter' && confirmPassword()}
            />

            <InputError message={error} className="mt-2" />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              className={`ms-3 ${processing ? 'opacity-25' : ''}`}
              disabled={processing}
              onClick={confirmPassword}
            >
              {button}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </span>
  )
})
