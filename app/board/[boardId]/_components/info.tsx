"use client"
import { Hint } from '@/app/(dashboard)/_component/hint'
import { Actions } from '@/components/actions'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useRenameModal } from '@/store/use-rename-modal'
import { useQuery } from 'convex/react'
import { Menu } from 'lucide-react'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface InfoProps{
  boardId:string
}

const font= Poppins({
    subsets:["latin"],
    weight:['600']
})

//
const TabSeperator=()=>{
  return (
    <div className='text-neutral-500 px-1.5'>

    </div>
  )
}

const Info = ({boardId}:InfoProps) => {
  //usereanme modal
  const {onOpen}=useRenameModal();
  const data= useQuery(api.board.get,{
    id :boardId as Id<"boards">
  })

  //if no data
  if(!data){
    return <InfoSkeleton/>
  }
  return (
    <div className='absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md'>

      <Hint label='Go back to boards' side='bottom' sideOffset={10} >
      <Button asChild variant="animate" className='px-2 bg-white'>
        <Link href="/">
      <Image src="/logo.svg"
        alt='logo'
        height={45}
        width={45}/>
        <span className= {cn("font-semibold text-xl ml-2 text-black",font.className)}>
          DigiB0ard 
        </span>
        </Link>
      </Button>
            </Hint>

            <TabSeperator/>

            <Hint label='Edit the Title' side='bottom' sideOffset={10} >
            <Button variant="board" className='text-base font-normal' 
            onClick={()=>onOpen(data._id,data.title)}>
              {data.title}
            </Button>
            </Hint>

            <TabSeperator/>

            <Actions id={data._id}
            title={data.title}
            side='bottom'
            sideOffset={10}>
              <div>
                <Hint label='Main Menu' side='bottom' sideOffset={10}>
                  <Button size="icon" variant="board">
                    <Menu/>
                  </Button>
                </Hint>
              </div>

            </Actions>

    </div>
  )
}

export default Info

export const InfoSkeleton=()=>{
  return (
        <div className='top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]'/>

  )
}