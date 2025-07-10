import Image from "next/image"


const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
        <Image src='/empty-search.jpg' alt="empty search" height={140} width={140}/>
        <h2 className="font-semibold mt-6 text-2xl"> This shit aint exist tf u smoking</h2>
        <p className="text-muted-foreground text-sm mt-2">Search for something else</p>
    </div>
  )
}

export default EmptySearch