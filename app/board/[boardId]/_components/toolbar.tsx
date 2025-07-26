import React from 'react'
import { ToolButton } from './tool-button'
import { Circle, MousePointer2, Pencil, Redo, Square, StickyNote, Type, Undo } from 'lucide-react'
import { CanvasMode, CanvasState, LayerType } from '@/types/canvas';





interface ToolBarProps{
  canvasState:CanvasState;
  setCanvasState:(newState:CanvasState)=>void;
  undo:()=>void;
  redo:()=>void;
  canUndo:boolean;
  canRedo:boolean
}

const Toolbar = ({canvasState,setCanvasState,undo,redo,canRedo,canUndo}:ToolBarProps) => {
  return (
    <div  className='absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-y-4'>
        <div className='bg-white rounded-md p-1.5 flex gap-y-1  flex-col items-center shadow-md'>
          {/* //forr the select button */}
           <ToolButton 
           label='Select'
           icon={MousePointer2}
           onClick={()=>setCanvasState({mode:CanvasMode.None })}
           isActive={
            canvasState.mode===CanvasMode.None ||
            canvasState.mode===CanvasMode.Translating ||
            canvasState.mode===CanvasMode.SelectionNet ||
            canvasState.mode===CanvasMode.Pressing ||
            canvasState.mode===CanvasMode.Resizing 
           }/>

          {/* //forr the text button */}

            <ToolButton 
           label='Text'
           icon={Type}
           onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Text

           })}
           isActive={
            canvasState.mode===CanvasMode.Inserting &&
            canvasState.layerType===LayerType.Text
            }/>


             {/* //forr the stickty note button */}

            <ToolButton 
           label='Sticky Note'
           icon={StickyNote}
           onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Note
           })}
           isActive={
            canvasState.mode===CanvasMode.Inserting &&
            canvasState.layerType===LayerType.Note
           }/>


             {/* //forr the Rectangle button */}

            <ToolButton 
           label='Rectangle'
           icon={Square}
           onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Rectangle
           })}
           isActive={
            canvasState.mode===CanvasMode.Inserting &&
            canvasState.layerType===LayerType.Rectangle
           }/>


            {/* //forr the Circle button */}

            <ToolButton 
           label='Ellipse'
           icon={Circle}
           onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Ellipse
           })}
           isActive={
            canvasState.mode===CanvasMode.Inserting &&
            canvasState.layerType===LayerType.Ellipse
           }/>

            {/* //forr the Pen button */}

            <ToolButton 
           label='Pen'
           icon={Pencil}
           onClick={()=>setCanvasState({
            mode:CanvasMode.Pencil
           })}
           isActive={
            canvasState.mode===CanvasMode.Pencil
           }/>  
        </div>

        {/* //for thr undo  and redo */}
        <div className='bg-white rounded-md p-1.5 flex gap-y-1  flex-col items-center shadow-md'>

           {/* //forr the Undo button */}

            <ToolButton 
           label='Undo'
           icon={Undo}
           onClick={undo}
           isDisabled={!canUndo}/>  

            {/* //forr the Redo button */}

            <ToolButton 
           label='Redo'
           icon={Redo}
           onClick={redo}
           isDisabled={!canRedo}/>  
        </div>
    </div>
  )
}

export default Toolbar



  export const ToolbarSkeleton=()=>{
    return (
            <div className='absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md'/>

       

    )
  }