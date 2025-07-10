"use client"
import { useOrganization } from "@clerk/nextjs";
import EmptyOrg from "./_component/empty-org";
import BoardList from "./_component/board-list";

interface DashboardPageProps{
  searchParams:{
    search?:string,
    favourites?:string
  }
}

export default function DashboardPage({searchParams,}:DashboardPageProps) {
  const {organization}=useOrganization()
  return (
    <div className=" flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (<EmptyOrg/>) :(<p><BoardList orgId={organization.id} query={searchParams}/></p>)}
    </div>
  );
}
