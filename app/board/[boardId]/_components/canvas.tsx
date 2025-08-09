"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Info from './info'
import Participants from './participants'
import Toolbar from './toolbar'
import { Camera, CanvasMode, CanvasState, Color, LayerType,Point, Side, XYWH } from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory, useMutation } from '@liveblocks/react'
import { CursorsPresence } from './cursors-presence'
import { colorToCss, connectionIdColor, findIntersectingLayersWithRectangle, penPointstoPathLayer, pointerEventToCanvaspoint, resizeBounds } from '@/lib/utils'
import { useOthersMapped, useSelf, useStorage } from '@liveblocks/react/suspense'
export { useSelf } from "@liveblocks/react/suspense";
import { nanoid } from 'nanoid'
import { LiveObject } from '@liveblocks/client'
import { LayerPreview } from './layer-preview'
import { SelectionBox } from './selection-box'
import { SelectionTools } from './selection-tools'
import { Path } from './path-layer'
import { useDisableScrollBounce } from '@/hooks/use-disable-scroll-bounce'
import { useDeleteLayers } from '@/hooks/use-delete-layers'

//max no of lsyers 
const MAX_LAYERS=1000;

interface CanvasProps{
  boardId:string,
}

const Canvas = ({boardId}:CanvasProps) => {

  //defining our layer ids
  const LayerIds=useStorage((root)=>root.layerIds)

  //
  const pencilDraft=useSelf((me)=>me.presence.pencilDraft)

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



  useDisableScrollBounce()
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


    //function for moving /translating the selected layer 
    const translateSelectedlayer=useMutation((
      {storage,self},point:Point
    )=>{
      if (canvasState.mode !== CanvasMode.Translating) {
      return;
    }

    const offset={
      x:point.x-canvasState.current.x,
      y:point.y-canvasState.current.y,
    }

      const liveLayers=storage.get("layers");
      
      for(const id of self.presence.selection){
        const layer=liveLayers.get(id);

        if(layer){
          layer.update({
            x:layer.get("x")+offset.x,
            y:layer.get("y")+offset.y,
          })
        }
      }

      setCanvasState({mode:CanvasMode.Translating,current:point})
    },[canvasState]
    )
    
    //unselect theselected layer
    const unselectLayer=useMutation(({
      self,setMyPresence
    })=>{
      if(self.presence.selection.length>0){
        setMyPresence({selection:[]},{addToHistory:true})
      }

    },[])

    //select multiple layers 
    const startMultiSelection=useCallback((current:Point,origin:Point)=>{
      //
      if(Math.abs(current.x - origin.x)+Math.abs(current.y-origin.y)>5){
          setCanvasState({
            mode:CanvasMode.SelectionNet,
            origin,
            current

          })
      }
    },[])

    //update selecrion net
    const updateSelectionNet=useMutation(({
      storage,setMyPresence
    },
   current:Point,
  origin:Point)=>{
      const layers=storage.get("layers").toImmutable();
      
      setCanvasState({
        mode:CanvasMode.SelectionNet,
        origin,
        current
      })

      const ids=findIntersectingLayersWithRectangle(
        LayerIds,
        layers,
        origin,
        current
      )

      setMyPresence({selection:ids})

    },[LayerIds])

    //start drawing on pressing down the cursor

    const startDrawing=useMutation((
      {setMyPresence},point:Point,pressure:number
    )=>{

      setMyPresence({
        pencilDraft:[[point.x,point.y,pressure]],
        penColor:lastUsedColor,
      })
    },[lastUsedColor])


    //continue drawing 
    const continueDrawing=useMutation((
      {self,setMyPresence},point:Point,e:React.PointerEvent
    )=>{
      const {pencilDraft}=self.presence;

      if(canvasState.mode!==CanvasMode.Pencil || e.buttons!==1 || pencilDraft ==null){
        return;
      }

      setMyPresence({
        cursor:point,
        pencilDraft:
        pencilDraft.length===1 &&
        pencilDraft[0][0]===point.x && 
        pencilDraft[0][1]===point.y 
        ?pencilDraft
        :[...pencilDraft,[point.x, point.y,e.pressure]]
      })
    },[canvasState.mode])

    //insert path whn the user puts the pointyer doen 
    const insertPath=useMutation((
      {storage,self,setMyPresence}
    )=>{
      const liveLayers=storage.get("layers");
      const {pencilDraft}=self.presence;
      
      if(pencilDraft==null ||
        pencilDraft.length <2 || 
        liveLayers.size>=MAX_LAYERS
      ){
        setMyPresence({pencilDraft:null});
        return;
      }

      const id=nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointstoPathLayer(pencilDraft,lastUsedColor))
      )

      const liveLayerIds=storage.get("layerIds");
      liveLayerIds.push(id);
      setMyPresence({pencilDraft:null});
      setCanvasState({mode:CanvasMode.Pencil})
    },[lastUsedColor])




  //function for resizing the selected layer
 const resizeSelectedLayer = useMutation(
  ({ storage, self }, point: Point) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }
    const bounds=resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point
    )

    const liveLayers=storage.get("layers");

    const layer=liveLayers.get(self.presence.selection[0]);

    if(layer){
      layer.update(bounds);
    }
  },
  [canvasState]
);


  //handle the resizing of layer 
  const onResizeHandlePointerDown=useCallback((
    corner:Side,
    initialBounds:XYWH
  )=>{
    history.pause();

    //
    setCanvasState({
      mode:CanvasMode.Resizing,
      initialBounds,
      corner
    })
  },[history])

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

    if(canvasState.mode===CanvasMode.Pressing){
      startMultiSelection(current,canvasState.origin)
    }else if(canvasState.mode===CanvasMode.SelectionNet){
      updateSelectionNet(current,canvasState.origin);
    }//translate or move the current layer
    else if(canvasState.mode===CanvasMode.Translating){
      translateSelectedlayer(current)
    } //resize the selected lyer 
    else if(canvasState.mode===CanvasMode.Resizing){
      resizeSelectedLayer(current)
    }else if(canvasState.mode===CanvasMode.Pencil){
      continueDrawing(current,e);
    }

    setMyPresence({cursor:current})
  },[canvasState,resizeSelectedLayer,camera,translateSelectedlayer,continueDrawing,startMultiSelection,updateSelectionNet])

  //when pointer goees out of bounds 

   const onPointerLeave=useMutation(({setMyPresence},e:React.PointerEvent)=>{
    e.preventDefault();
    setMyPresence({cursor:null})
  },[])

  //when i put the pointer down 
  const onPointerDown=useCallback((e:React.PointerEvent)=>{
    const point = pointerEventToCanvaspoint(e,camera);

    if(canvasState.mode=== CanvasMode.Inserting){
      return;
    }

    // for drawing
    if(canvasState.mode===CanvasMode.Pencil){
      startDrawing(point,e.pressure);
      return;
    }

    setCanvasState({origin:point,mode:CanvasMode.Pressing})
  },[camera,canvasState.mode,setCanvasState]

  )

  //when pointer moves 
  const onPointerUp=useMutation((
    {},
    e 
  )=>{
    const point =pointerEventToCanvaspoint(e,camera);

    if(canvasState.mode===CanvasMode.None || canvasState.mode===CanvasMode.Pressing){
    unselectLayer();
      setCanvasState({
        mode:CanvasMode.None,
      })
    }else if(canvasState.mode===CanvasMode.Pencil){
      insertPath();
    }else if(canvasState.mode===CanvasMode.Inserting){
      insertLayer(canvasState.layerType,point)
    }else{
      setCanvasState({
        mode:CanvasMode.None,
      })
    }
    history.resume();
  },[
    insertPath,
    setCanvasState,
    camera,
    canvasState,
    history,
    insertLayer,
    unselectLayer
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

  //
  const deleteLayers=useDeleteLayers();

  // TODO:ADD KEYLISTENERS

    //use keys to undo : ctrl+z to undo and ctrl+shift+z to redo 
    // useEffect(()=>{
  //     function onKeyDown(e:KeyboardEvent){
  //       switch(e.key){
  //         case "z":{
  //           if(e.ctrlKey || e.metaKey ){
  //             if(e.shiftKey){
  //               history.redo();
  //             }else{
  //               history.undo();
  //             }
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     document.addEventListener("keydown",onKeyDown)

  //     return()=>{
  //       document.removeEventListener("keydown",onKeyDown)
  //     }

  // },[deleteLayers,history])


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

            <SelectionTools
            camera={camera}
            setLastUsedColor={setLastUsedColor}/>

           
            <svg className='h-[100vh] w-[100vw]'
            onWheel={onWheel}
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
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
                onResizeHandlePointerDown={onResizeHandlePointerDown}/>
                {/* //if we are selecting multiple elements */}
                {canvasState.mode===CanvasMode.SelectionNet && canvasState.current!=null && (
                  <rect className='fill-blue-500/5 stroke-blue-500 stroke-2'
                  x={Math.min(canvasState.origin.x,canvasState.current.x)}
                  y={Math.min(canvasState.origin.y,canvasState.current.y)}
                  width={Math.abs(canvasState.origin.x-canvasState.current.x)}
                  height={Math.abs(canvasState.origin.y-canvasState.current.y)}/>
                )}
              <CursorsPresence/>
              {pencilDraft!=null && pencilDraft.length>0 &&(
                <Path
                points={pencilDraft}
                fill={colorToCss(lastUsedColor)}
                x={0}
                y={0}

              />
              )
              
              }
              </g>
            </svg>
            </main>
  )
}

export default Canvas