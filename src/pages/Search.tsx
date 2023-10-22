import { useQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { GET_USER_USERNAME } from "../utils/queries";
import SearchCard from "../components/SearchCard";

const Search = () => {

    const [search, setSearch] = useState<string>(localStorage.getItem("searchKey") === null ? "" : localStorage.getItem("searchKey")!);
    const { data, refetch } = useQuery(GET_USER_USERNAME);
    const ref = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        refetch({ "user_name": search })
        localStorage.setItem("searchKey", search);
    },[search,refetch])

    return (
        <div className="flex flex-col h-full w-full max-h-fit gap-2">
            <input
                type="name"
                placeholder="Search username"
                className="w-full rounded-md border-0 py-1.5 pl-2 ring-2 ring-inset ring-blue outline-none bg-white font-medium text-xl md:text-lg"
                value={search}
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)}
                autoComplete="text"
            />
            
            <span className="flex flex-col h-full w-full overflow-auto scroll-smooth no-scrollbar">
                {
                    data?.usersCollection?.edges?.length === 0 ?
                        <span className="flex items-center justify-center h-full">{search === "" ? "Enter username" : "Result not found! Tip:Enter full username"}</span>
                        :
                        <span className="flex flex-col gap-2" ref={ref}>
                            {data?.usersCollection?.edges?.map((data: any) =>
                                <SearchCard key={data.node.id} data={data.node}/>
                            )}
                        </span>
                }  
            </span>
        </div>
    )
}

export default Search