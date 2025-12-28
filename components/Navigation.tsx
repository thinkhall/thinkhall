"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Programs", href: "#programs" },
  { label: "AI Coach", href: "#ai-coach", badge: "New" },
  { label: "For Organizations", href: "#organizations" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
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
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3" : "py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className={`relative flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-300 ${
              scrolled
                ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border border-gray-200/80"
                : "bg-white/0"
            }`}
          >
            {/* Left Section - Logo */}
            <div className="flex-1 flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-10 h-10 sm:w-15 sm:h-15"
                >
                  <Image
                    src="/logo.png"
                    alt="Thinkhall Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-full p-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setActiveItem(item.label)}
                    onMouseLeave={() => setActiveItem(null)}
                    className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full transition-all duration-200"
                  >
                    {/* Active/Hover Background */}
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
                    <span className="relative z-10 flex items-center gap-1.5">
                      {item.label}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100"
              >
                Sign In
              </Link>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-300"
              >
                {/* Shine animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative hidden sm:inline">Get Started</span>
                <span className="relative sm:hidden">Start</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-200/80 overflow-hidden">
                {/* Mobile Menu Header with Logo */}
                <div className="px-4 pt-4 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-15 h-15">
                      <Image
                        src="/logo.png"
                        alt="Thinkhall Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {/* <span className="font-display font-bold text-gray-900">
                      Thinkhall
                    </span> */}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="p-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3.5 text-gray-700 hover:bg-gray-50 rounded-2xl transition-all font-medium group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />

                {/* Bottom Actions */}
                <div className="p-4 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-2xl transition-all font-medium border border-gray-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white px-4 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Footer Note */}
                <div className="px-4 pb-4">
                  <p className="text-center text-xs text-gray-400">
                    No credit card required
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
