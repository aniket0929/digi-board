import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs"
import Image from "next/image"
import { toast } from "sonner";


const EmptyBoard = () => {
  const {organization}=useOrganization();
  const {mutate,pending}=useApiMutation(api.board.create)

  const onClick=()=>{
    if(!organization) return;

    mutate({
      orgId:organization.id,
      title:"Untitled",
    })
    .then((id)=>{
      toast.success("Boards created succcesfully")
      //redireft to board/[id]
    }).catch(()=>{toast.error("Failed to create Board")})
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
        <Image src='/note.jpg' alt="empty board" height={140} width={140}/>
        <h2 className="font-semibold mt-6 text-2xl"> Create your first board</h2>
        <p className="text-muted-foreground text-sm mt-2">Start by creating your firsty board for your organization</p>
        <div className="mt-6">
            <Button disabled={pending} onClick={onClick} size="lg">Create a board</Button>
        </div>
    </div>
  )
}

export default EmptyBoard