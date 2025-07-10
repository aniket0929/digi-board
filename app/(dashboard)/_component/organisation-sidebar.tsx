"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const font= Poppins({
    subsets:["latin"],
    weight:['600']
})
export const OrganisationSidebar=()=>{
    //
    const searchParams=useSearchParams();
    const favourites=searchParams.get("favourites")
    return(
        <div className="hidden lg:flex flex-col space-y-x w-[206px] pl-5 pt-5">
            <Link href='/'>
            <div className="flex items-center gap-x-2 pb-5">
                    <Image
                    src='/logo.svg'
                    alt="logo"
                    height={50}
                    width={50}/>
                    <span className={cn(
                        'font-semibold text-2xl',
                        font.className
                    )}>
                        DigibOard
                    </span>
                </div>
                </Link>
                <OrganizationSwitcher 
                hidePersonal
                appearance={{
                    elements:{
                        rootBox:{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            width:"100%",
                        },
                        organizationSwitcherTrigger:{
                            padding:"6px",
                            width:"100%",
                            borderRadius:"8px",
                            border:"1px solid #E5E7EB",
                            justifyContent:"space-between",
                            backgroundColor:"white",
                            fontSize:"18px"

                        }
                    }
                }}/>
                <div className="space-y-1 w-full ">
                    <Button
                    variant={favourites? "ghost" :"secondary"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full">
                    <Link href="/">
                    <LayoutDashboard className="h-4 w-4 mr-2 "/>
                     Team Boards
                    </Link>
                    </Button>


                     <Button
                    variant={favourites? "secondary" :"ghost"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full">
                    <Link href={
                        {
                            pathname:"/",
                            query:{favourites:true}
                        }

                    }>
                    <Star className="h-4 w-4 mr-2 "/>
                     Favourite Boards
                    </Link>
                    </Button>

                </div>
        </div >
    )
}