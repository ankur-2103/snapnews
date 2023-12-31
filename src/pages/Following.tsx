import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FOLLOWING } from "../utils/queries";
import UserCard from "../components/UserCard";

/* This file creates page for displaying user followings */

const Following = () => {

    const followings = useSelector((state: RootState) => state.auth.user?.following); // get user followings from redux
    const [data, setData] = useState<any[]>([]); // data of following users
    const { refetch } = useQuery(GET_FOLLOWING, { variables: { "id": followings } }); // query following users info

    useEffect(() => {
        refetch({ "id": followings }).then((res:any) => {
            if (res.data.usersCollection.edges.length !== 0) {
                setData(res.data.usersCollection.edges.map((res:any)=>res.node));
            }
        });
    },[followings,refetch])

    return (
        <div className="flex flex-col w-full h-full">
            {data?.length === 0 ?
                <div className="flex w-full h-full justify-center items-center">
                    No followings availabel
                </div>
                :
                <div className="flex flex-col gap-2">
                    {data.map((val) =>
                        <UserCard key={val.id} data={val}/>
                    )}
                </div>
            }
        </div>
    )
}

export default Following;