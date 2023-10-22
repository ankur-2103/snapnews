import { useParams } from "react-router-dom"
import PostCard from "../components/PostCard"
import {useState} from 'react'
import { useQuery } from "@apollo/client";
import { GET_POST_ID } from "../utils/queries";
import { useEffect } from "react";

const Post = () => {

    const {postId:id} = useParams();
    const [data, setData] = useState<any>(null);
    const { refetch } = useQuery(GET_POST_ID, { variables: { "id": id } });

    useEffect(() => {
        refetch({ "id": id }).then((res:any) => {
            console.log(res.data.postsCollection.edges)
            if (res.data.postsCollection.edges.length !== 0) {
                setData(res.data.postsCollection.edges[0].node);
            }
        });
    },[id,refetch])

    // console.log({"id":param.postId})
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