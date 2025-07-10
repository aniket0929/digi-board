import { Tooltip, TooltipContent, TooltipProvider,TooltipTrigger } from "@/components/ui/tooltip";

export interface HintProps{
    label:string,
    children:React.ReactNode;
    side?:"top" | "bottom" | "left" |"right";
    align? :"start" | "center" |"end";
    sideOffset?:number;
    alignoffset?:number;
}

export const Hint =({
    label,
    children,
    side,
    align,
    sideOffset,
    alignoffset
}:HintProps)=>{
    return(
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent className="text-white bg-black border-black opacity-80"
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignoffset}>
                 <p className="font-semibold capitalize">
                    {label}
                 </p>
            </TooltipContent>
        </Tooltip>

    </TooltipProvider>)
}