"use client";

import React from "react";
import { useOrganization } from "@clerk/nextjs";
import EmptyOrg from "./_component/empty-org";
import BoardList from "./_component/board-list";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    favourites?: string;
  }>;
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  //here we wrap the searchparams in react.use first for nextjs14
  const resolvedParams = React.use(searchParams); //  unwrap first
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={resolvedParams} />
      )}
    </div>
  );
}
