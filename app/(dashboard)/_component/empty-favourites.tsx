import Image from 'next/image'
import React from 'react'

const EmptyFavourites = () => {
  return (
     <div className="h-full flex flex-col items-center justify-center">
            <Image src='/empty-favs.jpg' alt="empty favourites" height={140} width={140}/>
            <h2 className="font-semibold mt-6 text-2xl"> NO boards your favourite yet</h2>
            <p className="text-muted-foreground text-sm mt-2">Put a board in your favourites</p>
        </div>
  )
}

export default EmptyFavourites