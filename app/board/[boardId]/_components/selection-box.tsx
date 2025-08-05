"use client";

import { UseSelectionBounds } from "@/hooks/use-selection-bounds";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf } from "@liveblocks/react";
import { useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";

interface SelectionBoxProps{
    onResizeHandlePointerDown:(corner:Side,initialBounds:XYWH)=>void;
}

//
const HANDLE_WIDTH=6;


export const SelectionBox=memo(({onResizeHandlePointerDown}:SelectionBoxProps)=>{
    const soleLayerId=useSelf((me)=>
    me.presence.selection.length===1 ? me.presence.selection[0] : null)

    //
    const isShowingHandles=useStorage((root)=>
    soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path)


    const bounds=UseSelectionBounds();

    if(!bounds){
        return null;
    }

    return (
       <>
       <rect
        className="fill-transparent stroke-blue-500 stroke-2 pointer-events-none"
         style={{
                transform:`translate(${bounds.x}px,${bounds.y}px)`
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}/>

            {isShowingHandles && (
                <>
                {/* //for left corner */}
                <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"nwse-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x - HANDLE_WIDTH/2}px,${bounds.y - HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    // add resize handler
                    onResizeHandlePointerDown(Side.Top + Side.Left,bounds)
                }}
                />

                {/* //for topmid  */}
                  <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ns-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x +bounds.width / 2 - HANDLE_WIDTH/2}px,${bounds.y - HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    // add resize handler
                    onResizeHandlePointerDown(Side.Top ,bounds)

                }}
                />
                {/* //toprrigghtcorner */}
                 <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"nesw-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x - HANDLE_WIDTH/2+bounds.width}px,${bounds.y - HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    //add resize handler
                onResizeHandlePointerDown(Side.Top + Side.Right,bounds)

                }}
                />

                {/* //rght mid */}
                <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ew-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px,${bounds.y + bounds.height/2- HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    // add resize handler
                onResizeHandlePointerDown(Side.Right,bounds)

                }}
                />

                {/* //bottomright croner*/}

                 <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"se-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px,${bounds.y + bounds.height- HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    // add resize handler
                onResizeHandlePointerDown(Side.Bottom + Side.Right,bounds)

                }}
                />
                {/* bottom mid */}
                <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ns-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x +bounds.width / 2 - HANDLE_WIDTH/2}px,${bounds.y + bounds.height- HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    // add resize handler
                onResizeHandlePointerDown(Side.Bottom,bounds)

                }}
                />

                    {/* //bottomleft cornee */}
                    <rect
                    className="fill-white stroke-2 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor:"sw-resize",
                        width:`${HANDLE_WIDTH}px`,
                        height:`${HANDLE_WIDTH}px`,
                        transform:`translate(${bounds.x - HANDLE_WIDTH/2}px,${bounds.y + bounds.height- HANDLE_WIDTH/2}px)`
                    }}
                    onPointerDown={(e)=>{
                        e.stopPropagation();
                        // add resize handler
                    onResizeHandlePointerDown(Side.Bottom + Side.Left,bounds)

                    }}
                    />

                {/* left mid */}

                <rect
                 className="fill-white stroke-2 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ew-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform:`translate(${bounds.x - HANDLE_WIDTH/2}px,${bounds.y + bounds.height/2- HANDLE_WIDTH/2}px)`
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation();
                    //: add resize handler
                    onResizeHandlePointerDown(Side.Left,bounds)

                }}
                />

                </>
            )}
            
            </>
    )
})

SelectionBox.displayName="Selection Box";

