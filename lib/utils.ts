import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS=[
  "#FF0000",
  "#00E6FF",
  "#FF00D0",
  "#00FF3C",
  "#0080FF"

]

export  function connectionIdColor(connectionId:number):string{
  return COLORS[connectionId % COLORS.length]
}