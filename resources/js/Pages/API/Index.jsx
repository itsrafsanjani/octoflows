import AppLayout from '@/Layouts/AppLayout'
import ApiTokenManager from '@/Pages/API/Partials/ApiTokenManager'

const DEFAULT_TOKENS = []
const DEFAULT_PERMISSIONS = []
const DEFAULT_DEFAULT_PERMISSIONS = []

export default function Index({
  tokens = DEFAULT_TOKENS,
  availablePermissions = DEFAULT_PERMISSIONS,
  defaultPermissions = DEFAULT_DEFAULT_PERMISSIONS,
}) {
  return (
    <AppLayout title="API Tokens">
      <div>
        <div className="max-w-7xl">
          <ApiTokenManager
            tokens={tokens}
            availablePermissions={availablePermissions}
            defaultPermissions={defaultPermissions}
          />
        </div>
      </div>
    </AppLayout>
  )
}
