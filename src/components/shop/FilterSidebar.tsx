import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1a365d" },
  { name: "Burgundy", hex: "#722F37" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Blush", hex: "#DE5D83" },
  { name: "Grey", hex: "#808080" },
];

export interface FilterState {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice?: number;
}

function FilterContent({ filters, onFiltersChange, maxPrice = 1000 }: FilterSidebarProps) {
  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const toggleColor = (colorName: string) => {
    const newColors = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    onFiltersChange({ sizes: [], colors: [], priceRange: [0, maxPrice] });
  };

  const activeFilterCount = filters.sizes.length + filters.colors.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Header with Clear */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold tracking-wide">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Size Filter */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => toggleSize(size)}
              className={cn(
                "h-10 font-medium transition-all duration-200",
                filters.sizes.includes(size)
                  ? "border-foreground bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                  : "border-border hover:border-foreground"
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Color Filter */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Color
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className="group flex flex-col items-center gap-2"
              title={color.name}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                  filters.colors.includes(color.name)
                    ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "border-border/50 hover:border-foreground/50",
                  color.hex === "#FFFFFF" && "border-border"
                )}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Price Range Filter */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Price Range
          </h4>
          <span className="text-sm font-medium">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <div className="px-1">
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            min={0}
            max={maxPrice}
            step={10}
            onValueChange={handlePriceChange}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>${maxPrice}</span>
        </div>
      </div>
    </div>
  );
}

// Desktop Sidebar
export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 p-6 bg-card rounded-xl border border-border">
        <FilterContent {...props} />
      </div>
    </aside>
  );
}

// Mobile Filter Sheet
export function MobileFilterSheet(props: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  
  const activeFilterCount = props.filters.sizes.length + props.filters.colors.length + 
    (props.filters.priceRange[0] > 0 || props.filters.priceRange[1] < (props.maxPrice || 1000) ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden relative">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-xl">Filter Products</SheetTitle>
        </SheetHeader>
        <FilterContent {...props} />
        <div className="mt-8 pt-6 border-t">
          <Button 
            variant="luxe" 
            className="w-full" 
            onClick={() => setOpen(false)}
          >
            View Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
