"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/Dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/Carousel"

interface PhotoCarouselDialogProps {
    isOpen: boolean
    onClose: () => void
    images: string[]
    studioName: string
}

export function PhotoCarouselDialog({ isOpen, onClose, images, studioName }: PhotoCarouselDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogTitle />
            <DialogContent className="max-w-2xl">
                <Carousel scrollAmount={1}>
                    <CarouselContent className="p-8">
                        {images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-square relative overflow-hidden rounded-lg">
                                    <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`${studioName} - Foto ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </DialogContent>
        </Dialog>
    )
}

