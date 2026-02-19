//importing array of items (from src -> data -> product.js)
import { products } from "@/app/data/products";
//importing component that displays each item (product)
import ProductCard from "@/app/components/ProductCard";

export default function ShopPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* hero section */}
      <section className="text-center py-20 px-6 border-b border-relic-charcoal bg-gradient-to-b from-relic-dark to-black">
        <h1 className="font-serif text-5xl md:text-7xl text-relic-gold mb-6 tracking-widest">
          RELIC
        </h1>
        <p className="text-relic-paper text-lg max-w-2xl mx-auto italic font-serif opacity-80">
          "Welcome to the inventory of the lost. Browse our curated Items from worlds beyond."
        </p>
      </section>

      {/* filters (placeholder for now) */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center text-sm text-relic-paper border-b border-relic-charcoal mb-8">
        <span>Showing {products.length} Items</span>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-relic-gold">[ All ]</span>
          <span className="cursor-pointer hover:text-relic-gold">[ Rare ]</span>
          <span className="cursor-pointer hover:text-relic-gold">[ Legendary ]</span>
        </div>
      </div>

      {/* Inventory grid (product grid)*/}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* .map() loops through the products array from product.js in src/data. 
        Then rendering of each product card for each item by calling ProductCard each time */}
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}