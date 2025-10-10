import StatsCard from '@/Components/StatsCard'
import AppLayout from '@/Layouts/AppLayout'

const features = [
  {
    title: 'Larasonic Documentation',
    description: 'Check out our comprehensive documentation',
    icon: 'lucide:book-open',
    href: 'https://docs.larasonic.com',
  },
  {
    title: 'Roadmap',
    description: 'See what\'s coming next',
    icon: 'lucide:map',
    href: 'https://github.com/shipfastlabs/larasonic-react/discussions/categories/roadmap',
  },
  {
    title: 'GitHub Repository',
    description: 'Star us on GitHub',
    icon: 'lucide:github',
    href: 'https://github.com/shipfastlabs/larasonic-react',
  },
  {
    title: 'Join Us',
    description: 'Be part of our growing community',
    icon: 'lucide:users',
    href: 'https://github.com/shipfastlabs/larasonic-react/discussions',
  },
]

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {features.map(feature => (
          <StatsCard
            key={feature.title}
            value={feature.title}
            description={feature.description}
            icon={feature.icon}
            link={feature.href}
          />
        ))}
      </div>
    </AppLayout>
  )
}
