import React, { useRef, useState, useEffect } from 'react';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();

    // Handle horizontal mouse wheel scrolling
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      // Scroll horizontally when vertical wheel is used over chips
      e.preventDefault();
      el.scrollLeft += e.deltaY;
      checkScroll();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories]);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (cat: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasMovedRef.current) {
      // Prevent click action if user was dragging to scroll
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onSelectCategory(cat);
    // Smoothly scroll the selected chip into central view
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Left Fade Gradient Mask */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-7 bg-gradient-to-r from-[#0b0a13] via-[#0b0a13]/80 to-transparent z-10 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Right Fade Gradient Mask */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0b0a13] via-[#0b0a13]/80 to-transparent z-10 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Horizontal Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-5 py-0.5 select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={(e) => handleClick(cat, e)}
              className={`px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all duration-200 font-medium whitespace-nowrap active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30 ring-1 ring-white/20 font-semibold'
                  : 'bg-white/8 text-white/65 hover:text-white hover:bg-white/12 border border-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
        {/* End padding spacer to guarantee the last chip is never clipped */}
        <div className="w-4 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
};
