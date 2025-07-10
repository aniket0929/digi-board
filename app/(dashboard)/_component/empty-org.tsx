import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CreateOrganization } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const EmptyOrg = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center'>
        <Image src='/elements.jpg'
        alt='empty'
        height={400}
        width={400}/>
        <h2 className='text-2xl font-semibold mt-6'>
            Welcome to DigibOard
        </h2>
        <p className='text-muted-foreground text-sm mt-2'>
            Create an organization to get started
        </p>
        <div className='mt-6'>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-transparent p-0 border-none max-w-[480px]'>
              <CreateOrganization/>
            </DialogContent>
          </Dialog>
        </div>
    </div>
  )
}

export default EmptyOrg