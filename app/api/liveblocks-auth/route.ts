import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";


//init convex instance

const convex=new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
  secret: "sk_dev_-JhrusKBEBoY2YDYyhl8hq-x4u_axO4MfaGZMSMpdeWWqXGviymdEPlE2FTxaMwb",
});

export async function POST(request: Request){
    const authorization=await auth();
    const user =await currentUser();

        //check for auth
    // console.log("AUTH_INFO",{
    //     authorization,
    //     user
    // })

    if(!authorization || !user){
        return new Response("Unauthorized",{status:403})
    }

    const {room}=await request.json();

    //get the board
    const board=await convex.query(api.board.get,{id:room})

        //check for room,bord and 
    // console.log("AUTH_INFO",{
    //     board,
    //     room,
    //     boardOrgId:board?.orgId,
    //     userOrgId:authorization?.orgId
    // })

    if(board?.orgId != authorization.orgId){
        return new Response("Unauthorised",{status:403})
    }

    //
    const userInfo={
        name:user.firstName || "Teammate",
        picture:user.imageUrl || ""
    }
    //check userifno
    // console.log({userInfo})

      // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo} 
  );


  //if we have the room
  if(room){
    session.allow(room,session.FULL_ACCESS)
  }

  const {status,body}=await session.authorize();
  //
//   console.log({status,body},"ALLOWED")
  return new Response(body,{status})

}