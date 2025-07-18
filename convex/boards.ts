import {v} from "convex/values"
import { query } from "./_generated/server"

export const get=query({
    args:{
        orgId:v.string(),
        search:v.optional(v.string())
    },
     handler:async(ctx,args)=>{
         const identity=await ctx.auth.getUserIdentity();

         if(!identity){
            throw new Error("Unauthorized");
         }

         //

         
         const boards=await ctx.db
         .query("boards")
         .withIndex("by_org",(q)=>q.eq("orgId",args.orgId))///tf does it evn mean? well u just quesry using the index 
         .order("desc")
         .collect()

         //quesry favouerite too
          const boardsWithFavouriteRelation=boards.map((board)=>{
            return ctx.db
            .query("userFavourites")
            .withIndex("by_user_board",(q)=>
            q
            .eq("userId",identity.subject)
            .eq("boardId",board._id)
            )
            .unique()
            .then((favourite)=>{
                return {
                    ...board,
                    isFavourite :!!favourite,
                }
            })
})
        const boardWithFavouriteBoolean=Promise.all(boardsWithFavouriteRelation)
         return boardWithFavouriteBoolean;
     }
})

