'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const bottomPadding = isAuthPage ? 'pb-6' : 'pb-20 md:pb-6'

  return (
    <footer className={`pt-6 ${bottomPadding} surface-section`} aria-label="Footer">
      <div className="container-safe mx-auto px-4 text-center">
        <p className="text-sm text-theme-muted ">
          © {new Date().getFullYear()} Tourongo Travel Marketplace
        </p>
      </div>
    </footer>
  )
}
