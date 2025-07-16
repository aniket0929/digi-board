"use client"

import { useRenameModal } from "@/store/use-rename-modal"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";

export const RenameModal=()=>{

    const {mutate,pending}=useApiMutation(api.board.update)

    const {
        isOpen,onClose,initialValues
    }=useRenameModal();

        const [title,setTitle]=useState(initialValues.title)

        useEffect(() => {
         setTitle(initialValues.title);
        }, [initialValues.title])
        

        const onSubmit:FormEventHandler<HTMLFormElement>=(e,)=>{
                e.preventDefault() 

                mutate({
                    id:initialValues.id,
                    title,

                })
                .then(()=>{
                    toast.success("Board renamed Succesfully")
                    onClose();
                })
                .catch(()=>toast.error("Failed to rename the board"))
        }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Board Title
                    </DialogTitle>
                                    </DialogHeader>

                    <DialogDescription>
                        Enter a new Title for this Board
                    </DialogDescription>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input disabled={pending}
                        required
                        maxLength={60}
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder="Board Title"/>

                   
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button disabled={pending} type="submit">
                                Save 
                        </Button>
                    </DialogFooter>
                     </form >
            </DialogContent>

        </Dialog>
    )
}