"use client"

import EmptyBoard from "./empty-boards"
import EmptyFavourites from "./empty-favourites"
import EmptySearch from "./empty-search"

interface BoardListProps{
    orgId:string,
    query:{
        search?:string,
        favourites?:string
    }
}

const BoardList = ({orgId,query}:BoardListProps) => {
    const data=[] //todo
    //no data ength bt user serch for something that doesnt exist
    if(!data.length && query.search){
        return(
            <EmptySearch/>
        )
    }
    //no data lenght bt also have query for favourited
    if(!data.length && query.favourites){
        return (<EmptyFavourites/>)
        
    }

     //no boards
         if(!data.length){
        return (
            <EmptyBoard/>
        )
    }
  return (
    <div></div>
  )
}

export default BoardList