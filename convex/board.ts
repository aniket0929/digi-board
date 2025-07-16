import {v} from "convex/values"
import {mutation} from "./_generated/server"

const images=[
    "/placeholders/1.jpg",
     "/placeholders/2.jpg",
      "/placeholders/3.jpg",
       "/placeholders/4.jpg",
        "/placeholders/5.jpg",
         "/placeholders/6.jpg",
          "/placeholders/7.jpg",
           "/placeholders/8.jpg",
            "/placeholders/9.jpg",
             "/placeholders/10.jpg",
]

export const create=mutation({
    args:{
        orgId:v.string(),
        title:v.string(),
    },
    handler:async(ctx, args) =>{
        const identity=await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Unauthorized")
        }

        const randomImage=images[Math.floor(Math.random()*images.length)]

        const boards=await ctx.db.insert("boards",{
                 title:args.title,
                 orgId:args.orgId,
                 authorId:identity.subject,
                 authorName:identity.name!,
                 imageUrl:randomImage,
        })
        return boards;
    },
})

export const remove=mutation({
    args:{
        id:v.id("boards"),},

        handler:  async (ctx,args)=>{
            const identity=await ctx.auth.getUserIdentity()

            
        if(!identity){
            throw new Error("Unauthorized")
        }
        //todo

        await ctx.db.delete(args.id);   

        
    }
})



export const update=mutation({
    args:{
        id:v.id("boards"),
        title:v.string()
    },
    handler:async(ctx ,args)=>{
            const title=await args.title.trim()
            
             const identity=await ctx.auth.getUserIdentity()

            
        if(!identity){
            throw new Error("Unauthorized")
        }

            
        if(!title){
            throw new Error("Title Required Bro")
        }

         if(title.length>60){
            throw new Error("Title cant be more than 60 characters ")
        }

        const board=await ctx.db.patch(args.id,{
            title:args.title,
        })
        return board;
    }
})