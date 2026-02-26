import React from 'react'
import { RootLayoutProps } from '@/app/layout'
import Link from 'next/link'
export default function layout({ children }:RootLayoutProps) {
  return (
    <div className="grid grid-cols-5 min-h-screen bg-gray-100">
        <div className='col-span-1 bg-white p-4 shadow-md'>
            <aside>
                <ul>
                    <li>
                        <Link href="/categories/men" className='text-gray-700 hover:text-blue-600 transition'>Men</Link>
                    </li>
                    <li>
                        <Link href="/categories/women" className='text-gray-700 hover:text-blue-600 transition'>Women</Link>
                    </li>
                    <li>
                        <Link href="/categories/kids" className='text-gray-700 hover:text-blue-600 transition'>Kids</Link>
                    </li>
                </ul>
            </aside>
        </div>
        <div className="col-span-4">
             {children}
        </div>
    </div>
  )
}
