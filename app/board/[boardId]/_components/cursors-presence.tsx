"use client"

import { useOthersConnectionIds } from "@liveblocks/react/suspense"
import { comma } from "postcss/lib/list"
import { memo } from "react"
import { Cursor } from "./cursor"

const Cursors=()=>{
    const ids=useOthersConnectionIds()

    return(
        <>
        {ids.map((connectionId)=>(
            <Cursor
            key={connectionId}
            connectionId={connectionId}/>

        ))}
        </>
    )
}
export const CursorsPresence=memo(()=>{
   return( 
   <>
   {/* todo:pencil work  */}
   <Cursors/>
   </>
)

})

CursorsPresence.displayName=""