import { Button } from "@/components/ui/button"
import Image from "next/image"


const EmptyBoard = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
        <Image src='/note.jpg' alt="empty board" height={140} width={140}/>
        <h2 className="font-semibold mt-6 text-2xl"> Create your first board</h2>
        <p className="text-muted-foreground text-sm mt-2">Start by creating your firsty board for your organization</p>
        <div className="mt-6">
            <Button size="lg">Create a board</Button>
        </div>
    </div>
  )
}

export default EmptyBoard