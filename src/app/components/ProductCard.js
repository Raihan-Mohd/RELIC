import Image from "next/image";
import { getRarityColor } from "@/app/lib/rarity";

export default function ProductCard({ product }) {
  // 1. Get the color based on the item's rarity
  const rarityColor = getRarityColor(product.stats.rarity);

  return (
    <div className={`group relative bg-relic-dark border ${rarityColor} border-opacity-50 hover:border-opacity-100 transition-all duration-300 flex flex-col h-full`}>
      
      {/* Image slot (image always stays Square) */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/50 border-b border-relic-charcoal">
        {/* The Badge (Rarity) */}
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-bold border bg-black/80 z-10 ${rarityColor}`}>
          {product.stats.rarity}
        </span>

        {/* The Image */}
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          unoptimized
          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
      </div>

      {/* Item details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="font-serif text-lg text-relic-bone tracking-wide group-hover:text-relic-gold transition-colors">
          {product.name}
        </h3>
        
        {/* Source Game (Subtitle) */}
        <p className="text-xs text-relic-paper opacity-60 mb-3 italic">
          from {product.stats.source}
        </p>

        {/* Description (Lore) - Truncated */}
        <p className="text-xs text-relic-paper opacity-80 mb-4 line-clamp-2 flex-grow font-serif">
          "{product.lore}"
        </p>

        {/* Footer: Price & Add Button */}
        <div className="flex justify-between items-center mt-auto border-t border-relic-charcoal pt-3">
          <span className="text-relic-gold font-bold">
            R {product.price}
          </span>
          <button className="text-xs uppercase tracking-widest hover:text-relic-bone transition-colors">
            [ Equip ]
          </button>
        </div>
      </div>
    </div>
  );
}