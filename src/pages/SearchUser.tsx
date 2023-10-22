import Google from '../assets/google-icon.svg'
import PostCard from "../components/PostCard";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from "@apollo/client";
import { GET_USER_POSTS } from "../utils/queries";
import { setMyPosts } from "../slice/postsSlice";
import { useParams } from 'react-router-dom';

const SearchUser = () => {

    const myPosts = useSelector((state: RootState) => state.posts.myPosts);
    const { userId } = useParams()
    const [data, setData] = useState<any[]>([]);
    const { refetch } = useQuery(GET_USER_POSTS, {variables:{"userId":userId}});
    const dispatch = useDispatch();

    useEffect(() => {
        refetch({ "user_id": userId }).then((res) => {
            const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
            if (newData) {
                setData(newData)
            }
            console.log(newData)
        });
        
    }, [dispatch, userId, refetch])

    return (
        <div className="flex flex-col w-full gap-4">
            <span className="flex flex-col md:flex-row justify-center gap-2 md:gap-8 items-center">
                <img src={Google} className='w-28'/>
                <span className='flex justify-evenly gap-8'>
                    <span className='flex  flex-col items-center font-bold rounded-md p-2 cursor-pointer'>{data?.length}<span className='font-normal'>Posts</span></span>
                    <span className='flex  flex-col items-center font-bold rounded-md p-2 cursor-pointer'>1000<span className='font-normal'>Followers</span></span>
                    <span className='flex  flex-col items-center font-bold rounded-md p-2 cursor-pointer'>1000<span className='font-normal'>Following</span></span>
                </span>
            </span>
            <span className='flex justify-center h-full w-full'>
                <div className="flex flex-col h-full max-h-fit ">
                    {data?.length===0 ?
                    <span className="flex flex-col h-full justify-center gap-2">
                        <span>No posts available!</span>
                    </span>
                    :
                    <div className="flex flex-col gap-2 md:w-full">
                        <span className="flex flex-col gap-6">
                            {data.map((val, index) => <PostCard key={index} data={val} isDeletModalOpen={false} handleDeletModalOpen={()=>{}}/>)}
                        </span>
                        <span className=" text-center w-full">End</span>
                    </div>
                    }        
                </div>
            </span>
        </div>
    )
}

export default SearchUser