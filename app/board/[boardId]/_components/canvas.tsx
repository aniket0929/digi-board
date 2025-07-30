"use client"

import React, { useCallback, useMemo, useState } from 'react'
import Info from './info'
import Participants from './participants'
import Toolbar from './toolbar'
import { Camera, CanvasMode, CanvasState, Color, LayerType,Point } from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory, useMutation } from '@liveblocks/react'
import { CursorsPresence } from './cursors-presence'
import { connectionIdColor, pointerEventToCanvaspoint } from '@/lib/utils'
import { useOthersMapped, useStorage } from '@liveblocks/react/suspense'
export { useSelf } from "@liveblocks/react/suspense";
import { nanoid } from 'nanoid'
import { LiveObject } from '@liveblocks/client'
import { LayerPreview } from './layer-preview'
import { SelectionBox } from './selection-box'

//max no of lsyers 
const MAX_LAYERS=1000;

interface CanvasProps{
  boardId:string,
}

const Canvas = ({boardId}:CanvasProps) => {

  //defining our layer ids
  const LayerIds=useStorage((root)=>root.layerIds)

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode:CanvasMode.None
  })

  //
  const [lastUsedColor,setLastUsedColor]=useState<Color>({
    r:0,
    g:0,
    b:0
  })
  const [camera,setCamera]=useState<Camera>({x:0,y:0})
  //
  const history=useHistory();
  const canUndo=useCanUndo();
  const canRedo=useCanRedo();

  const insertLayer=useMutation((
    {storage,setMyPresence},
    layerType:LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note ,
    position:Point,
  )=>{
    const livelayers= storage.get("layers")

    if(livelayers.size>=MAX_LAYERS){
      return;
    }

    const liveLayerIds=storage.get("layerIds")

    const layerId= nanoid();

    //create new layer 
    const layer=new LiveObject({
      type:layerType,
      x:position.x,
      y:position.y,
      height:100,
      //can also do this thing where we go height: layerType=== LayerType.text?200
      width:100,
      fill:lastUsedColor
    });

    liveLayerIds.push(layerId);
    livelayers.set(layerId,layer);

    setMyPresence(
      {
        selection:[layerId]
      },
      {
        addToHistory:true
      }
    )

    setCanvasState({
      mode:CanvasMode.None
    })
  },[lastUsedColor])

  const onWheel=useCallback((e:React.WheelEvent)=>{
    setCamera((camera)=>({
      x:camera.x -e.deltaX,
      y:camera.y - e.deltaY
    }))
  },[])

  //to sow chchanges to ther group

  const onPointerMove=useMutation(({setMyPresence},e:React.PointerEvent)=>{
    e.preventDefault();

    const current =pointerEventToCanvaspoint(e,camera)

    setMyPresence({cursor:current})
  },[])

  //when pointer goees out of bounds 

   const onPointerLeave=useMutation(({setMyPresence},e:React.PointerEvent)=>{
    e.preventDefault();


    setMyPresence({cursor:null})
  },[])

  //when pointer moves 
  const onPointerUp=useMutation((
    {},
    e 
  )=>{
    const point =pointerEventToCanvaspoint(e,camera);
    if(canvasState.mode===CanvasMode.Inserting){
      insertLayer(canvasState.layerType,point)
    }else{
      setCanvasState({
        mode:CanvasMode.None,
      })
    }
    history.resume();
  },[
    camera,
    canvasState,
    history,
    insertLayer
  ])

  //function for distinguising layes based on users

    const onLayerPointerDown=useMutation((
      {self,setMyPresence},
      e:React.PointerEvent,
      layerId:string
    )=>{
      //if we inserting something then no point in selcting a layer
        if(canvasState.mode===CanvasMode.Pencil || canvasState.mode===CanvasMode.Inserting){
          return;
        }

        //
        history.pause();
        e.stopPropagation();

        const point=pointerEventToCanvaspoint(e,camera);

        if(!self.presence.selection.includes(layerId)){
          setMyPresence({
            selection:[layerId]
          },
        {
          addToHistory:true
        })
        }

        ///
        setCanvasState({mode:CanvasMode.Translating,current:point})
    },[
      setCanvasState,
      camera,
      history,
      canvasState.mode
    ])

  //
  const selections =useOthersMapped((other)=>other.presence.selection)

  //
  const layerIdsToColorSelection=useMemo(()=>{
    const layerIdsToColorSelection:Record<string,string> ={};

    for(const user of selections){
      const [connectionId,selection]=user;

       for(const layerId of selection){
      layerIdsToColorSelection[layerId]=connectionIdColor(connectionId)
    }
    }

   return layerIdsToColorSelection;
  },[selections])


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

           
            <svg className='h-[100vh] w-[100vw]'
            onWheel={onWheel}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onPointerUp={onPointerUp}>
             <g transform={`translate(${camera.x}, ${camera.y})`}>

                {LayerIds.map((layerId)=>(
                  <LayerPreview
                  key={layerId}
                  id={layerId}
                  onLayerPointerDown={onLayerPointerDown}
                  selectionColor={layerIdsToColorSelection[layerId]}/>
                ))}
                <SelectionBox
                onResizeHandlePointerDown={()=>{}}/>
              <CursorsPresence/>
              </g>
            </svg>
            </main>
  )
}

export default Canvas