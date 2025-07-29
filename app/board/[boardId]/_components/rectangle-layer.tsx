import { RectangleLayer } from "@/types/canvas";

interface RectangleProps{
    id:string;
    layer:RectangleLayer;
    onPointerDown:(e:React.PointerEvent,id:string)=>void;
    selectionColor?:string
}

export const Rectangle=({id,layer,onPointerDown,selectionColor}:RectangleProps)=>{

       const {x,y,width,height,fill}=layer;

        return(
            <rect
            className="drop-shadow-md"
            onPointerDown={(e)=>onPointerDown(e,id)}
            style={{
                transform:`translate(${x}px,${y}py)`
            }}
            ///hardcode kelya values to show  it on those co-ordinates
            x={x}
            y={y}
            width={width}
            height={height}
            strokeWidth={1}
            fill="#000000"
            stroke="transparent"/>
        )
}