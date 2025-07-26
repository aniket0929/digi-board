"use client";

import { Hint } from "@/app/(dashboard)/_component/hint";
import { Button } from "@/components/ui/button";
import {  LucideIcon } from "lucide-react";

interface ToolButtonProps{
    label:string;
    icon:LucideIcon;
    onClick:()=>void;
    isActive?:boolean;
    isDisabled?:boolean;

}

export const ToolButton=({
    //create an alias and capitalizse it then it can be used as Component 
    label,icon:Icon,onClick,isActive,isDisabled
}:ToolButtonProps)=>{
return (
    <Hint label={label} side="right" sideOffset={14}>
        <Button disabled={isDisabled}
        onClick={onClick}
        size="icon"
        variant={isActive ?"boardActive":"board"}
        >
        <Icon/>
        </Button>
        

    </Hint>
)
}