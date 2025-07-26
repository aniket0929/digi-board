
import { Loader } from 'lucide-react'
import React from 'react'
import  { ParticipantsSkeleton } from './participants'
import { ToolbarSkeleton } from './toolbar'
import { InfoSkeleton } from './info'


const CanvasLoading = () => {
  return (
      <main className='h-full w-full relative bg-neutral-200 touch-none flex items-center justify-center'>
           <Loader className='w-6 h-6 text-muted-foreground animate-spin'/>
           <InfoSkeleton/>
           <ParticipantsSkeleton/>
           <ToolbarSkeleton/>
            </main>
  )
}

export default CanvasLoading