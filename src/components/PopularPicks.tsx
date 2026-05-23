import { menuItems, type MenuItem } from "../data"
import { ProductCard } from "./ProductCard"
import { useLanguage } from "../providers/LanguageProvider"

interface PopularPicksProps {
  onItemClick: (item: MenuItem) => void
}

export function PopularPicks({ onItemClick }: PopularPicksProps) {
  const { t } = useLanguage()
  const popularItems = menuItems.filter(item => item.popular)

  return (
    <section id="popular" className="py-20 w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black font-poppins mb-3 tracking-tight">
            {t("Priljubljene izbire", "Popular Picks")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("Najbolje ocenjene jedi naših gostov.", "Best rated dishes of our guests.")}
          </p>
        </div>
        
        {/* Unified Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {popularItems.map(item => (
            <ProductCard key={item.id} item={item} onClick={onItemClick} context="popular" />
          ))}
        </div>
      </div>
    </section>
  )
}
