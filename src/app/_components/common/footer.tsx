"use client"
import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Main Container */}
        <div className="flex flex-row justify-center items-start gap-8 w-304 h-72-5">
          
          {/* Column 1: Company Info */}
          <div className="flex flex-col items-start gap-4 w-[217.59px] h-72.5">
            {/* Logo */}
            <div className="flex flex-row items-center gap-0 w-[217.59px] h-8">
              <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded text-xl font-bold">
                S
              </div>
              <span className="text-lg font-bold text-black ml-3">ShopMart</span>
            </div>

            {/* Description */}
            <div className="flex flex-col items-start w-[217.59px] h-28.5">
              <p className="text-[13.3px] font-normal leading-5.75 text-[#4A5565]">
                Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
              </p>
            </div>

            {/* Contact Info Container */}
            <div className="flex flex-col items-start gap-3 pt-2 w-[217.59px] h-28">
              {/* Address */}
              <div className="flex flex-row items-center gap-0 w-[217.59px] h-10">
                <MapPin className="w-5 h-4 text-[#4A5565] mr-2" />
                <span className="text-[13.1px] font-normal leading-5 text-[#4A5565]">
                  123 Shop Street, October City, DC 12345
                </span>
              </div>

              {/* Phone */}
              <div className="flex flex-row items-center gap-0 w-[217.59px] h-5">
                <Phone className="w-4 h-4 text-[#4A5565] mr-2" />
                <span className="text-[12.7px] font-normal leading-5 text-[#4A5565]">
                  (+20) 01093333333
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-row items-center gap-0 w-[217.59px] h-5">
                <Mail className="w-4 h-4 text-[#4A5565] mr-2" />
                <span className="text-[13.1px] font-normal leading-5 text-[#4A5565]">
                  support@shopmart.com
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="flex flex-col items-start gap-4 w-[217.59px] h-72.5">
            <h3 className="text-[14px] font-bold leading-5 text-black w-[217.59px]">
              SHOP
            </h3>
            <ul className="flex flex-col items-start gap-2 w-[217.59px] h-38">
              <li className="w-[217.59px] h-6">
                <Link href="/products/electronics" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Electronics
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/products/fashion" className="text-[13.3px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Fashion
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/products/home-garden" className="text-[13.6px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Home & Garden
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/products/sports" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Sports
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/products/deals" className="text-[13.6px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col items-start gap-4 w-[217.61px] h-72.5">
            <h3 className="text-[14px] font-bold leading-5 text-black w-[217.61px]">
              CUSTOMER SERVICE
            </h3>
            <ul className="flex flex-col items-start gap-2 w-[217.61px] h-38">
              <li className="w-[217.61px] h-6">
                <Link href="/contact" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Contact Us
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/help" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Help Center
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/track-order" className="text-[13.2px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Track Your Order
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/returns" className="text-[13.5px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Returns & Exchanges
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/size-guide" className="text-[13.5px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div className="flex flex-col items-start gap-4 w-[217.59px] h-72.5">
            <h3 className="text-[13.8px] font-bold leading-5 text-black w-[217.59px]">
              ABOUT
            </h3>
            <ul className="flex flex-col items-start gap-2 w-[217.59px] h-38">
              <li className="w-[217.59px] h-6">
                <Link href="/about" className="text-[13px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  About ShopMart
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/careers" className="text-[13.3px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Careers
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/press" className="text-[13.6px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Press
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/investor" className="text-[13.2px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Investor Relations
                </Link>
              </li>
              <li className="w-[217.59px] h-6">
                <Link href="/sustainability" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Policies */}
          <div className="flex flex-col items-start gap-4 w-[217.61px] h-72.5">
            <h3 className="text-[14px] font-bold leading-5 text-black w-[217.61px]">
              POLICIES
            </h3>
            <ul className="flex flex-col items-start gap-2 w-[217.61px] h-38">
              <li className="w-[217.61px] h-6">
                <Link href="/privacy" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Privacy Policy
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/terms" className="text-[13.1px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Terms of Service
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/cookies" className="text-[13.2px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Cookie Policy
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/shipping" className="text-[13.2px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Shipping Policy
                </Link>
              </li>
              <li className="w-[217.61px] h-6">
                <Link href="/refund" className="text-[13.2px] font-normal leading-5 text-[#4A5565] hover:text-black transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}
