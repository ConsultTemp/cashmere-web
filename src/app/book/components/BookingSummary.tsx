'use client'

import { Button } from "@/components/Button"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/Dialog"
import { services, studios } from "@/lib/types"
import { useBookingStore } from "@/store/booking-store"

export function SummaryContent() {
    const { selectedServices, selectedPackage, selectedEngineer, selectedStudio, selectedDate, timeFrom, timeTo } = useBookingStore()
    return (

        <div className="flex flex-row flex-wrap gap-4">
            <div className="flex flex-row justify-between flex-nowrap bg-gray-100 py-2 px-4 rounded-sm">
                <span className="mr-1">Servizi: </span>
                <span className='font-semibold'>
                    {selectedServices.map(ser => services.find(s => s.id === ser)?.name).filter(Boolean).join(', ')}
                    {selectedPackage && `, ${services.find(s => s.id === selectedPackage)?.name || selectedPackage}`}
                </span>

            </div>
            <div className="flex flex-row justify-between flex-nowrap bg-gray-100 py-2 px-4 rounded-sm">
                <span className="mr-1">Data:</span>
                <span className='font-semibold'>
                {selectedDate && `${selectedDate.getDate()} ${selectedDate.toLocaleString('it-IT', { month: 'long' })}`}
                </span>
            </div>
            <div className="flex flex-row justify-between flex-nowrap bg-gray-100 py-2 px-4 rounded-sm">
                <span className="mr-1">Orario:</span>
                <span className='font-semibold'>{timeFrom} - {timeTo}</span>
            </div>

            <div className="flex flex-row justify-between flex-nowrap bg-gray-100 py-2 px-4 rounded-sm">
                <span className="mr-1">Studio:</span>
                <span className='font-semibold'>{studios.find(s => s.id == selectedStudio)?.name}</span>
            </div>

            <div className="flex flex-row justify-between flex-nowrap bg-gray-100 py-2 px-4 rounded-sm">
                <span className="mr-1">Fonico:</span>
                <span className='font-semibold'>{selectedEngineer}</span>
            </div>
        </div>

    )
}

export function BookingSummary() {

    /* if (!selectedDate || !timeFrom || !timeTo) return null */

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Apri Riepilogo Prenotazione</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Riepilogo prenotazione</DialogTitle>
                    <div className="border-y border-y-[1px] border-y gray-400 py-8">
                        <SummaryContent />
                    </div>
                    <DialogFooter>
                        <DialogClose> <div className="bg-black rounded-lg text-white text-lg px-8 py-2">Ok</div></DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    )
}
