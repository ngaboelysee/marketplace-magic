import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
  seller: string;
  verified?: boolean;
  category?: string;
  colors?: string[];
  slug?: string;
}

export function ProductCard({
  id,
  name,
  price,
  rating = 4.5,
  reviews = 0,
  image,
  seller,
  verified = false,
  colors = [],
  slug,
}: ProductCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-luxe transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={slug ? `/product/${slug}` : `/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
          <Heart className="h-4 w-4 text-foreground" />
        </button>
        {verified && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-luxe-gold text-primary-foreground rounded-full">
            Verified
          </span>
        )}
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="w-full bg-background/90 backdrop-blur-sm hover:bg-background">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{seller}</p>
        <Link to={slug ? `/product/${slug}` : `/product/${id}`}>
          <h3 className="font-medium text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-border/50"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">+{colors.length - 4}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-luxe-gold text-luxe-gold" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">{formatPrice(price)}</span>
        </div>
      </div>
    </div>
  );
}
