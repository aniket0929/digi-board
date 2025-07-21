"use client";

import { ReactNode } from "react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  

} from "@liveblocks/react/suspense";

interface RoomProps{
  children:ReactNode
  roomId:string
  fallback:NonNullable<ReactNode> | null
}


export function Room({ children ,roomId,fallback}: RoomProps) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_5oqm00PVZ-etxeYwXxDNefQhgJ1wnj7iTOK25EEQSgglHkAtFdArG4NZ0kbS8pG3"}>
      <RoomProvider id={roomId} initialPresence={{}}>  
        <ClientSideSuspense fallback={fallback}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
      </LiveblocksProvider>
  );
}