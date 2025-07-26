


export type Color={
    r:number,
    g:number,
    b:number
}
export type Camera={
    x:number,
    y:number,
}

export enum LayerType{
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note
}

//rectangle layer is going to have these 
export type RectangleLayer={
     type:LayerType.Rectangle;
     x:number;
     y:number;
     height:number;
     width:number;
     fill:Color;
     value?:string
}

export type EllipseLayer={
     type:LayerType.Ellipse;
     x:number;
     y:number;
     height:number;
     width:number;
     fill:Color;
     value?:string

}

//pathh
export type PathLayer={
     type:LayerType.Path;
     x:number;
     y:number;
     height:number;
     width:number;
     fill:Color;
     points:number[][];
     value?:string
}

//text layer

export type TextLayer={
     type:LayerType.Text;
     x:number;
     y:number;
     height:number;
     width:number;
     fill:Color;
     value?:string

}

//note layer 

export type NoteLayer={
     type:LayerType.Note;
     x:number;
     y:number;
     height:number;
     width:number;
     fill:Color;
     value?:string

}

//where element is positioned
export type Point={
    x:number;
    y:number
}



//for widht and height of element 
export type XYWH={
    x:number;
    y:number;
    width:number;
    height:number
}


//for when we are resizing
export enum Side{
    Top=1,
    Bottom=2,
    Left=4,
    Right=8

}


export type CanvasState=
| {
    mode:CanvasMode.None
}
| {
    mode:CanvasMode.Pressing,
    origin:Point
}
| {
    mode:CanvasMode.SelectionNet,
    origin:Point,
    current?:Point
}
| {
    mode:CanvasMode.Translating,
    current:Point
}

| {
    mode:CanvasMode.Inserting,
    layerType:LayerType.Ellipse | LayerType.Rectangle | LayerType.Note | LayerType.Text
}
| {
    mode:CanvasMode.Resizing,
    initialBounds:XYWH,
    corner:Side
}
| {
    mode:CanvasMode.Pencil
}

export enum CanvasMode{
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}