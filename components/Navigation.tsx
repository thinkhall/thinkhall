"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  LayoutGrid,
  Info,
  Building2,
  BrainCircuit,
} from "lucide-react";

// Updated Navigation Items with Icons
// Ordered to keep "AI Coach" somewhat central
const navItems = [
  {
    label: "Platform",
    href: "/platform",
    icon: LayoutGrid,
  },
  {
    label: "Enterprise Solutions",
    href: "/enterprise",
    icon: Building2,
  },
  {
    label: "AI Coach",
    href: "/ai-coach",
    badge: "New",
    icon: BrainCircuit,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Main Header */}
      <header className="relative z-40 pt-4 sm:pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex-1">
              <Link href="/" className="inline-block">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/logo.png"
                    alt="Thinkhall Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Center Nav - Desktop */}
            <div
              className={`hidden lg:flex items-center ${
                scrolled ? "invisible" : "visible"
              }`}
            >
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1.5 border border-transparent">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setActiveItem(item.label)}
                    onMouseLeave={() => setActiveItem(null)}
                    className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full transition-colors group"
                  >
                    {activeItem === item.label && (
                      <motion.div
                        layoutId="navHover"
                        className="absolute inset-0 bg-white rounded-full shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon
                        className={`w-4 h-4 ${
                          activeItem === item.label
                            ? "text-gray-900"
                            : "text-gray-500 group-hover:text-gray-900"
                        }`}
                      />
                      {item.label}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
              {/* Book a Demo */}
              <Link
                href="/demo"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2.5 transition-colors"
              >
                Book a Demo
              </Link>

              {/* Get Started */}
              <Link
                href="/login"
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-lg shadow-gray-900/10"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Nav - Desktop */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex fixed top-0 left-0 right-0 z-50 py-4 justify-center"
          >
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setActiveItem(item.label)}
                  onMouseLeave={() => setActiveItem(null)}
                  className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full transition-colors group"
                >
                  {activeItem === item.label && (
                    <motion.div
                      layoutId="navHoverSticky"
                      className="absolute inset-0 bg-gray-100 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon
                      className={`w-4 h-4 ${
                        activeItem === item.label
                          ? "text-gray-900"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                    />
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Nav Links */}
                <div className="p-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-gray-100">
                          <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <span className="flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mx-4" />

                {/* Bottom Actions */}
                <div className="p-4 space-y-2">
                  <Link
                    href="/demo"
                    className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium border border-gray-200 hover:border-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book a Demo
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-gray-900/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
