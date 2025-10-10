import { memo } from 'react'

export default memo(({
  title,
  description,
  aside,
  content,
  className = '',
}) => {
  return (
    <div className={`md:grid md:grid-cols-3 md:gap-6 ${className}`}>
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
        <div className="border px-4 py-5 shadow-xs rounded-lg sm:p-6">
          {content}
        </div>
      </div>
    </div>
  )
})
