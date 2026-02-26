import React from 'react'
import { RootLayoutProps } from '@/app/layout'

export default function layout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        {children}
      </div>
    </div>
  )
}
