import { Loader } from 'lucide-react'
import React from 'react'
import Info from './info'
import { Skeleton } from '@/components/ui/skeleton'
import Participants from './participants'
import Toolbar from './toolbar'


const CavnasLoading = () => {
  return (
      <main className='h-full w-full relative bg-neutral-200 touch-none flex items-center justify-center'>
           <Loader className='w-6 h-6 text-muted-foreground animate-spin'/>
           <Info.Skeleton/>
           <Participants.Skeleton/>
           <Toolbar.Skeleton/>
            </main>
  )
}

export default CavnasLoading