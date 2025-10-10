import { memo } from 'react'

export default memo(({
  onSubmit,
  title,
  description,
  aside,
  form,
  actions,
}) => {
  const hasActions = !!actions

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="flex justify-between md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium">
            {title}
          </h3>

          <p className="mt-1 text-sm">
            {description}
          </p>
        </div>

        <div className="px-4 sm:px-0">
          {aside}
        </div>
      </div>

      <div className="mt-5 md:col-span-2 md:mt-0">
        <form onSubmit={handleSubmit}>
          <div className="rounded-lg border bg-background px-4 py-5 shadow-xs sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              {form}
            </div>
          </div>

          {hasActions && (
            <div className="flex items-center justify-end bg-background py-3 text-end sm:rounded-b-md">
              {actions}
            </div>
          )}
        </form>
      </div>
    </div>
  )
})
