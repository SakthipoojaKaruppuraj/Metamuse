import Link from 'next/link'
import { MetaMuseLogo } from '@/components/brand/metamuse-logo'

const LINKS = [
  { href: '/analyze', label: 'Analyze' },
  { href: '/history', label: 'History' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: 'https://github.com/SakthipoojaKaruppuraj/Metamuse', label: 'GitHub', external: true },
  { href: '/how-it-works', label: 'Documentation' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="max-w-sm">
          <MetaMuseLogo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Know what you own. Understand why it exists.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              {...(link.external
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} MetaMuse. All rights reserved.</p>
          <p>Turn NFT metadata into meaning.</p>
        </div>
      </div>
    </footer>
  )
}
