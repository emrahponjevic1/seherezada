import { useLanguage } from "../../providers/LanguageProvider"
import { MapPin, Phone, Copy, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const currentDay = new Date().getDay()

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date()
      const hour = now.getHours()
      // Open from 09:00 to 05:00 next day
      if (hour >= 9 || hour < 5) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    checkOpenStatus()
    const interval = setInterval(checkOpenStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText("Trubarjeva cesta 31, 1000 Ljubljana")
    // Note: Would typically trigger a shadcn toast here
    alert(t("Naslov kopiran!", "Address copied!"))
  }

  return (
    <footer className="bg-background/95 backdrop-blur-md text-foreground py-20 relative z-20 overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute -top-[200px] left-1/4 w-[400px] h-[400px] rounded-full bg-shere-red/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative z-10">
        
        {/* Brand & Info */}
        <div className="space-y-6 order-3 lg:order-1 md:col-span-2 lg:col-span-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-shere-red to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl rotate-3 shadow-[0_10px_20px_-10px_rgba(230,57,70,0.5)]">Š</div>
            <h2 className="text-4xl font-poppins font-black tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Šeherezada</h2>
          </div>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed mx-auto">
            {t("Avtentični turški kebab in fast food v srcu Ljubljane. Pridite in okusite razliko.", "Authentic Turkish kebab and fast food in the heart of Ljubljana. Come and taste the difference.")}
          </p>
          <div className="pt-4 flex gap-4 text-sm text-muted-foreground justify-center">
            <span>© {new Date().getFullYear()} Šeherezada d.o.o.</span>
            <span>•</span>
            <span>All rights reserved.</span>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="space-y-6 order-2 lg:order-2 md:col-span-1 lg:col-span-1 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold font-poppins text-shere-red tracking-wide relative pb-2 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-12 before:h-0.5 before:bg-shere-red w-full text-center">
            {t("Kontakt & Lokacija", "Contact & Location")}
          </h3>
          
          <div className="w-full space-y-4">
            {/* Address Row: Pin Icon on left, 2 rows of text on right, centered as a block */}
            <div className="flex items-center gap-4 justify-center">
              <MapPin className="text-shere-red shrink-0" size={28} />
              <div className="text-left">
                <p className="font-bold text-xl text-foreground leading-tight">Trubarjeva cesta 31</p>
                <p className="text-lg text-muted-foreground leading-tight">1000 Ljubljana, Slovenia</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button 
                onClick={copyAddress}
                className="text-sm font-semibold bg-secondary hover:bg-secondary/80 border border-border transition px-5 py-2.5 rounded-xl flex items-center gap-2 text-foreground"
              >
                <Copy size={14} /> {t("Kopiraj", "Copy Address")}
              </button>
              <a 
                href="https://maps.google.com/?q=Trubarjeva+cesta+31,+Ljubljana" 
                target="_blank" 
                rel="noreferrer"
                className="text-sm font-semibold bg-shere-red hover:bg-shere-darkred border border-shere-red/20 transition px-5 py-2.5 rounded-xl flex items-center gap-2 text-white shadow-lg shadow-shere-red/10"
              >
                Google Maps <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Phone Row: Phone icon on left, phone number on right, centered as a block */}
          <div className="flex items-center gap-3 justify-center pt-2">
            <Phone className="text-shere-red shrink-0" size={24} />
            <a href="tel:+38669444812" className="hover:text-shere-red transition text-2xl font-black bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent hover:from-shere-red hover:to-shere-red duration-300">
              +386 69 444 812
            </a>
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-6 order-1 lg:order-3 md:col-span-1 lg:col-span-1 flex flex-col items-center w-full">
          <div className="flex items-center gap-3 justify-center w-full">
            <h3 className="text-2xl font-bold font-poppins text-shere-red tracking-wide relative pb-2 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-12 before:h-0.5 before:bg-shere-red text-center">
              {t("Delovni čas", "Working Hours")}
            </h3>
            <div className="group relative flex items-center justify-center -mt-1 cursor-help">
              <span className="relative flex h-3 w-3">
                {isOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                )}
              </span>
              <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-foreground text-background text-xs px-2 py-1 rounded">
                {isOpen ? t("Odprto zdaj", "Open Now") : t("Zaprto", "Closed")}
              </div>
            </div>
          </div>
          <ul className="space-y-3 w-full max-w-md">
            <li className={`flex items-center justify-between pb-2 transition-colors rounded-xl px-4 py-3 ${[1,2,3,4].includes(currentDay) ? 'bg-secondary border border-border text-foreground' : 'text-muted-foreground border border-transparent'}`}>
              <span className={`text-lg font-medium ${[1,2,3,4].includes(currentDay) ? 'font-bold' : ''}`}>{t("Ponedeljek - Četrtek", "Monday - Thursday")}</span>
              <span className={`text-lg font-bold ${[1,2,3,4].includes(currentDay) ? 'text-foreground' : 'text-foreground/80'}`}>09:00 - 02:00</span>
            </li>
            <li className={`flex items-center justify-between pb-2 transition-colors rounded-xl px-4 py-3 ${[5,6].includes(currentDay) ? 'bg-shere-red/10 border border-shere-red/20 text-foreground' : 'text-muted-foreground border border-transparent'}`}>
              <span className={`text-lg font-medium ${[5,6].includes(currentDay) ? 'font-bold' : ''}`}>{t("Petek - Sobota", "Friday - Saturday")}</span>
              <span className="text-lg font-black text-shere-red drop-shadow-[0_0_10px_rgba(230,57,70,0.3)]">09:00 - 05:00</span>
            </li>
            <li className={`flex items-center justify-between pb-2 transition-colors rounded-xl px-4 py-3 ${currentDay === 0 ? 'bg-shere-red/10 border border-shere-red/20 text-foreground' : 'text-muted-foreground border border-transparent'}`}>
              <span className={`text-lg font-medium ${currentDay === 0 ? 'font-bold' : ''}`}>{t("Nedelja", "Sunday")}</span>
              <span className="text-lg font-black text-shere-red drop-shadow-[0_0_10px_rgba(230,57,70,0.3)]">10:00 - 05:00</span>
            </li>
          </ul>
        </div>
        
      </div>
    </footer>
  )
}
