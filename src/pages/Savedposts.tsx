import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {  GET_SAVED_POSTS } from "../utils/queries";
import PostCard from "../components/PostCard";

/* This file creates saved posts page */

const Savedposts = () => {

    const savedPosts = useSelector((state: RootState) => state.auth.user?.saved); // get user saved post
    const [data, setData] = useState<any[]>([]); // state for saved posts
    const { refetch } = useQuery(GET_SAVED_POSTS, { variables: { "id": savedPosts } }); // query saved posts

    useEffect(() => {
        refetch({ "id": savedPosts }).then((res:any) => {
            if (res.data.postsCollection.edges.length !== 0) {
                setData(res.data.postsCollection.edges.map((res:any)=>res.node));
            }
        });
    },[refetch, savedPosts])

    return (
        <div className="flex flex-col w-full h-full">
            {data?.length === 0 ?
                <div className="flex w-full h-full justify-center items-center">
                    No savedPosts availabel
                </div>
                :
                <div className="flex flex-col items-center">
                    {data.map((val) =>
                        <PostCard handleDeletModalOpen={()=>{}} isDeletModalOpen={false} key={val.id} data={val}/>
                    )}
                </div>
            }
        </div>
    )
}

export default Savedposts;