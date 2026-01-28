import Link from 'next/link'
import { AppShell, Card, Button } from '@/ui'

export default function Home() {
  return (
    <AppShell
      header={<h1 className="text-2xl font-bold text-text">Reservations System</h1>}
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <h1 className="text-4xl font-bold mb-8 text-text">Reservations System</h1>
          <div className="space-y-4">
            <Link href="/reservations">
              <Button variant="primary" className="w-full">
                View All Reservations →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
