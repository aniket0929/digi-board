"use client";

import { ReactNode } from "react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  

} from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvas";
interface RoomProps{
  children:ReactNode
  roomId:string
  fallback:NonNullable<ReactNode> | null
}


export function Room({ children ,roomId,fallback}: RoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{
        cursor:null ,
        selection:[]
      }}
      initialStorage={{
        layers: new LiveMap<string,LiveObject<Layer>>(),
        //added empty array becoz of the error 
        layerIds:new LiveList([])
      }}>  
        <ClientSideSuspense fallback={fallback}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
      </LiveblocksProvider>
  );
}