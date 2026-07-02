import { redirect } from 'next/navigation'
import Image from 'next/image'

import { getAccessState } from '@/lib/access'
import TopbarSessionActions from '@/components/dashboard/TopbarSessionActions'
import Sidebar from '@/components/sidebar/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const access = await getAccessState()

  if (!access.authUser) {
    redirect('/login')
  }

  if (!access.membership || !access.organization || !access.branch) {
    redirect('/onboarding/organization')
  }

  const initials = `${access.profile?.name?.[0] ?? 'Q'}${access.profile?.last_name?.[0] ?? 'Y'}`.toUpperCase()

  return (
    <div
      data-app-shell="dashboard"
      className="grid min-h-screen grid-rows-[auto_auto_1fr] bg-[#f7fbfa] text-[#061d33] lg:grid-cols-[220px_1fr] lg:grid-rows-[64px_1fr]"
    >
      <header className="sticky top-0 z-20 col-span-full flex items-center gap-4 border-b border-[#dcefeb] bg-white/95 px-4 py-3 backdrop-blur sm:px-5 lg:py-0">
        <Image src="/images/logo.png" alt="Qypu" width={118} height={46} className="h-10 w-auto" priority />

        <div className="ml-auto">
          <TopbarSessionActions initials={initials} />
        </div>
      </header>

      <Sidebar />

      <main className="flex min-w-0 flex-col gap-5 overflow-x-auto px-4 py-5 sm:px-6 lg:px-7">
        {children}
      </main>
    </div>
  )
}
