import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { AppSidebarEnhanced } from '@/components/app-sidebar-enhanced'
import TopBar from '@/components/top-bar'
import { ThemeProvider } from '@/components/theme-provider'
import { localesList, type Locale } from '../i18n'
import { SidebarProvider } from '../../components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return localesList.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'CodeKlay - AI-Powered Development Platform',
  description: 'Build, debug, and deploy applications with AI assistance',
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const { children, params } = props;
  const { locale } = await params;
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="flex h-screen bg-background">
          <AppSidebarEnhanced />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
} 