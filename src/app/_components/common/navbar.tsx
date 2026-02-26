// Navbar component - top navigation for the site
// Contains links to main pages and auth actions.
"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NavigationMenu, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User } from 'lucide-react'
import { ShoppingCart, LogOut, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCartV2 } from '@/lib/api'
export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter()
    const [cartCount, setCartCount] = useState<number>(0)

    useEffect(() => {
      async function loadCart() {
        try {
          // Prefer localStorage cart when available so badge updates instantly
          const rawLocal = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
          if (rawLocal) {
            try {
              const parsed = JSON.parse(rawLocal)
              const localCount = Array.isArray(parsed) ? parsed.reduce((s: number, it: any) => s + (it.quantity || it.qty || 1), 0) : 0
              if (localCount > 0) {
                setCartCount(localCount)
                return
              }
            } catch (e) {
              // fallthrough to server/fallback
            }
          }

          const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined
          if (token) {
            const res: any = await getCartV2(token)
            const items = res?.data?.items || res?.items || []
            const count = Array.isArray(items) ? items.reduce((s: number, it: any) => s + (it.quantity || it.qty || 1), 0) : 0
            setCartCount(count)
          } else {
            setCartCount(0)
          }
        } catch (e) {
          setCartCount(0)
        }
      }
      loadCart()
      // also listen for storage events from other tabs
      function onStorage(e: StorageEvent) {
        if (e.key === 'cart' || e.key === 'token') loadCart()
      }
      window.addEventListener('storage', onStorage)
      function onCartUpdated() { loadCart() }
      window.addEventListener('cart-updated', onCartUpdated as EventListener)
      return () => {
        window.removeEventListener('storage', onStorage)
        window.removeEventListener('cart-updated', onCartUpdated as EventListener)
      }
    }, [])

    const isActive = (href: string) => {
      return pathname === href;
    };

  return (
    <nav className="bg-[#f5f5f5e5] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left - Logo */}
        <div className="nav-logo text-2xl font-bold text-black flex items-center gap-3">
          <Avatar className='rounded-lg'>
      <AvatarFallback className='rounded-lg bg-black text-white'>S</AvatarFallback>
    </Avatar>
          <Link href="/">ShopMart</Link>
        </div>

        {/* Navigation Links - main site pages */}
        <div className="nav-links flex gap-8">
          <NavigationMenu className='gap-3'>
            <NavigationMenuItem>
              <Link href="/products" className={`px-3 py-2 rounded transition ${isActive('/products') ? 'bg-black text-white font-semibold' : 'text-gray-700' } cursor-pointer`}>
                Products
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/brands" className={`px-3 py-2 rounded transition ${isActive('/brands') ? 'bg-black text-white font-semibold' : 'text-gray-700' } cursor-pointer`}>
                Brands
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/categories" className={`px-3 py-2 rounded transition ${isActive('/categories') ? 'bg-black text-white font-semibold' : 'text-gray-700' } cursor-pointer`}>
                Categories
              </Link>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>
      
        {/* Right - Navigation actions */}
      <div className="nav-action flex items-center gap-4">
        {/* Person dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2 text-xl">
              <User size={22} />
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="cursor-pointer">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishList" className="cursor-pointer">Wishlist</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => { localStorage.removeItem('token'); router.push('/auth/sign-in') }}>
              <div className='flex items-center gap-2'><LogOut size={16} /> Sign out</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart icon with badge */}
        <div>
          <Link href="/cart" className="relative inline-flex p-2 text-gray-700 hover:text-black" aria-label={`Cart with ${cartCount} items`}>
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-semibold z-10 pointer-events-none" aria-hidden="false">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
      </div>
    </nav>
  )
}
