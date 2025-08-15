import { Building2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-forest-night dark:bg-slate-900 text-ivory-mist py-12 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-br from-antique-gold to-olive-slate rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-ivory-mist" />
            </div>
            <span className="text-2xl font-bold">ProptyChain</span>
          </div>
          <div className="text-ivory-mist/70">© 2024 ProptyChain. Revolutionizing real estate on blockchain.</div>
        </div>
      </div>
    </footer>
  )
}
