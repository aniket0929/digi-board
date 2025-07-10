"use client";


import  Image  from "next/image";

import {useOrganizationList, useOrganization} from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Hint } from "../hint";

interface ItemProps{
    id:string;
    name:string;
    imageUrl:string;
}

export const Item =({id, name, imageUrl}:ItemProps)=>{
    //
    const {organization}= useOrganization();
    const {setActive}=useOrganizationList();

    const isActive= organization?.id===id;
    
    const onClick=()=>{
        if(!setActive) return;

        setActive({organization:id})
    }
    return(
        <div className="aspect-square relative">
            <Hint label={name}
            side="right"
            align="start"
            sideOffset={15}>

            <Image
             width={100} 
             height={100} 
            alt={name}
            src={imageUrl}
            onClick={onClick}
            className={cn(
                "rounded-md cursor-pointer opacity-75 hover:opacity-50 transition", isActive && "opacity-100 transition",
                isActive && "opacity-100"
            )}/>
                        </Hint>


        </div>
    )
}