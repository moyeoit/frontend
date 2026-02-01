import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  carouselVariants,
} from './carousel'

export type CarouselCompound = typeof CarouselRoot & {
  Content: typeof CarouselContent
  Item: typeof CarouselItem
  Previous: typeof CarouselPrevious
  Next: typeof CarouselNext
}

export const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
}) as CarouselCompound

export type {
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselPreviousProps,
  CarouselNextProps,
} from './carousel'

export {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  carouselVariants,
}
