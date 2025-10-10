import AuthenticationCardLogo from '@/Components/LogoRedirect'
import { useSeoMetaTags } from '@/Composables/useSeoMetaTags'

export default function PrivacyPolicy({ policy }) {
  useSeoMetaTags({
    title: 'Privacy Policy',
  })

  return (
    <div className="font-sans antialiased">
      <div className="pt-4">
        <div className="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
          <div>
            <AuthenticationCardLogo />
          </div>

          <div
            className="prose dark:prose-invert mt-6 w-full overflow-hidden p-6 shadow-md sm:max-w-2xl sm:rounded-lg"
            // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
            dangerouslySetInnerHTML={{ __html: policy }}
          />
        </div>
      </div>
    </div>
  )
}
