import { useParams } from "react-router-dom"
import PostCard from "../components/PostCard"
import {useState} from 'react'
import { useQuery } from "@apollo/client";
import { GET_POST_ID } from "../utils/queries";
import { useEffect } from "react";

/* This page creates single post page */

const Post = () => {

    const {postId:id} = useParams(); // get post id form route
    const [data, setData] = useState<any>(null); // state for post data
    const { refetch } = useQuery(GET_POST_ID, { variables: { "id": id } }); // query post data using id

    useEffect(() => {
        refetch({ "id": id }).then((res:any) => {
            console.log(res.data.postsCollection.edges)
            if (res.data.postsCollection.edges.length !== 0) {
                setData(res.data.postsCollection.edges[0].node);
            }
        });
    },[id,refetch])

    return (
        <div>
            
        {
            data === null ?
            <div>Hii</div>
            : <PostCard data={data} isDeletModalOpen={false} handleDeletModalOpen={() => { }} />}
        
            </div>
    )
}

export default Post