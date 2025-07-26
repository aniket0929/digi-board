"use client"

import React, { useState } from 'react'
import Info from './info'
import Participants from './participants'
import Toolbar from './toolbar'
import { CanvasMode, CanvasState } from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory } from '@liveblocks/react'
export { useSelf } from "@liveblocks/react/suspense";
interface CanvasProps{
  boardId:string,
}

const Canvas = ({boardId}:CanvasProps) => {

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode:CanvasMode.None
  })

  //
  const history=useHistory();
  const canUndo=useCanUndo();
  const canRedo=useCanRedo();

  return (
    <main className='h-full w-full relative bg-neutral-200 touch-none'>
            <Info boardId={boardId}/>
            <Participants/>
            <Toolbar
            canvasState={canvasState}
            setCanvasState={setCanvasState}
            canRedo={canRedo}
            canUndo={canUndo}
            undo={history.undo}
            redo={history.redo}/> 
            </main>
  )
}

export default Canvas