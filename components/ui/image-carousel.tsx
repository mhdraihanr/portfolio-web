"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageCarouselProps {
  images: Array<string | { url: string; fileId: string }>;
  alt: string;
  className?: string;
}

export function ImageCarousel({
  images,
  alt,
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const getImageUrl = (image: string | { url: string; fileId: string }) => {
    return typeof image === "string" ? image : image.url;
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? images.length - 1 : prevIndex - 1,
        );
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  // Single image - no carousel needed
  if (images.length === 1) {
    return (
      <div
        className={`relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
      >
        <Image
          src={getImageUrl(images[0])}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  // Multiple images - show carousel
  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image */}
      <div
        className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={getImageUrl(images[currentIndex])}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300 select-none"
          priority={currentIndex === 0}
          draggable={false}
        />

        {/* Navigation Buttons - visible on mobile, hover on desktop */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Indicators */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              index === currentIndex
                ? "border-primary scale-105"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            aria-label={`Go to image ${index + 1}`}
          >
            <Image
              src={getImageUrl(image)}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
