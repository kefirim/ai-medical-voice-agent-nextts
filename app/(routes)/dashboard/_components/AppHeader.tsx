'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const menuOptions = [
  { id: 1, name: 'Home', path: '/' },
  { id: 2, name: 'History', path: '/dashboard/history' },
  { id: 3, name: 'Pricing', path: '/dashboard/billing'},
  { id: 4, name: 'Profile', path: '/profile' },

]

function AppHeader() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between p-4 shadow md:px-20 lg:px-40">
      <Image src="/logo.svg" alt="logo" width={180} height={90} />

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-12 items-center">
        {menuOptions.map((option) => (
          <div key={option.id}>
            <Link href={option.path}>
              <h2
                className={`cursor-pointer transition-all ${
                  pathname === option.path
                    ? 'font-bold text-blue-600'
                    : 'hover:font-bold'
                }`}
              >
                {option.name}
              </h2>
            </Link>
          </div>
        ))}
      </div>

      <UserButton />
    </div>
  )
}

export default AppHeader
