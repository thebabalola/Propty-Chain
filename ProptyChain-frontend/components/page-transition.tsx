"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-night via-forest-night/95 to-olive-slate/20 flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="w-16 h-16 border-4 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ivory-mist/70">Loading ProptyChain...</p>
        </div>
      </div>
    )
  }

  return <div className="animate-fade-in">{children}</div>
}
