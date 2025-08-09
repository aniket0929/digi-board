"use client";

import { UseSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/app/(dashboard)/_component/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);
    const selectionBounds = UseSelectionBounds();

    //move thr layer tto back 
    const moveToBack=useMutation(({
      storage
    })=>{
      const liveLayersIds=storage.get("layerIds");
        const indices: number[]=[];
        const arr=liveLayersIds.toImmutable();

        for(let i=0;i<arr.length;i++){
          if(selection?.includes(arr[i])){
           indices.push(i);
          }
        }

        for(let i=0;i<indices.length;i++){
          liveLayersIds.move(indices[i],i);
        }
    },[selection])

    //move the layer to front

      const moveToFront=useMutation(({
      storage
    })=>{
      const liveLayersIds=storage.get("layerIds");
        const indices: number[]=[];
        const arr=liveLayersIds.toImmutable();

        for(let i=0;i<arr.length;i++){
          if(selection?.includes(arr[i])){
           indices.push(i);
          }
        }

        for(let i=indices.length-1;i>=0;i--){
          liveLayersIds.move(
            indices[i],
            arr.length-1-(indices.length-1-i)
          )
        }
    },[selection])

   


    //fill the layer witth selected color
    const setFill=useMutation((
        {storage},fill:Color)=>{

        //grt the layers
        const liveLayers=storage.get("layers");
        setLastUsedColor(fill);

        selection?.forEach((id)=>{
            liveLayers.get(id)?.set("fill",fill);
        })

        
    },[selection,setLastUsedColor])

    //delete layer
    const deleteLayers=useDeleteLayers();

    if (!selectionBounds || !selection || selection.length === 0) {
      return null;
    }

    const x = selectionBounds.x + selectionBounds.width / 2 + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute z-50 p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
           transform: `translate(-50%, -100%)`, // center horizontally, fully above
          top: `${y-16}px`, // vertical position
          left: `${x}px`, // horizontal position (center of selection)
        }}
      >
        
        <ColorPicker
        onChange={setFill}/>
        {/* //the layer depth button */}
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to Front">
          <Button variant="board"
          onClick={moveToFront}
          size="icon">
            <BringToFront/>
          </Button>
          </Hint>

          <Hint label="Send to Back" side="bottom">
          <Button variant="board"
          size="icon"
          onClick={moveToBack}>
            <SendToBack/>
          </Button>
          </Hint>

        </div>

        {/* //delete buttron */}
        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
            <Hint label="Delete">
                <Button variant="board"
                size="icon"
                onClick={deleteLayers}>
                    <Trash2/>
                </Button>

            </Hint>

        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
