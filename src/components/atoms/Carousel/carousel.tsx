'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/shared/utils/cn'

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

const carouselVariants = cva('relative w-full', {
  variants: {
    orientation: {
      horizontal: 'flex',
      vertical: 'flex flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

type CarouselContextProps = {
  api: CarouselApi
  canScrollPrev: boolean
  canScrollNext: boolean
} & VariantProps<typeof carouselVariants>

export const CarouselCtx = React.createContext<CarouselContextProps | null>(
  null,
)

function useCarousel() {
  const context = React.useContext(CarouselCtx)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

export interface CarouselProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    VariantProps<typeof carouselVariants> {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  setApi?: (api: CarouselApi) => void
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = 'horizontal',
      opts,
      plugins,
      setApi,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    )

    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    React.useEffect(() => {
      if (!emblaApi) return
      setApi?.(emblaApi)
      onSelect()
      emblaApi.on('reInit', onSelect)
      emblaApi.on('select', onSelect)

      return () => {
        emblaApi.off('select', onSelect)
      }
    }, [emblaApi, setApi, onSelect])

    return (
      <CarouselCtx.Provider
        value={{
          api: emblaApi,
          canScrollPrev,
          canScrollNext,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        }}
      >
        <div
          ref={ref}
          className={cn(carouselVariants({ orientation }), className)}
          {...props}
        >
          <div ref={emblaRef} className="overflow-hidden">
            {children}
          </div>
        </div>
      </CarouselCtx.Provider>
    )
  },
)
Carousel.displayName = 'Carousel'

export type CarouselContentProps = React.ComponentProps<'div'>

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()
    return (
      <div
        ref={ref}
        className={cn(
          'flex transition-transform duration-300 ease-in-out',
          className,
        )}
        {...props}
      />
    )
  },
)
CarouselContent.displayName = 'CarouselContent'

export type CarouselItemProps = React.ComponentProps<'div'>

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          className,
        )}
        {...props}
      />
    )
  },
)
CarouselItem.displayName = 'CarouselItem'

export type CarouselPreviousProps = React.ComponentProps<'button'>

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(({ className, onClick, ...props }, ref) => {
  const { api, canScrollPrev } = useCarousel()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    api?.scrollPrev()
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      disabled={!canScrollPrev}
      className={cn(
        'inline-flex items-center justify-center',
        'w-10 h-10 rounded-tl-[6px] rounded-bl-[6px]',
        'bg-white border border-light-color-3',
        'hover:bg-light-color-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors',
        className,
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

export type CarouselNextProps = React.ComponentProps<'button'>

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, onClick, ...props }, ref) => {
    const { api, canScrollNext } = useCarousel()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      api?.scrollNext()
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        disabled={!canScrollNext}
        className={cn(
          'inline-flex items-center justify-center',
          'w-10 h-10 rounded-tr-[6px] rounded-br-[6px]',
          'bg-white border border-light-color-3',
          'hover:bg-light-color-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          className,
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="sr-only">Next slide</span>
      </button>
    )
  },
)
CarouselNext.displayName = 'CarouselNext'

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  carouselVariants,
}
