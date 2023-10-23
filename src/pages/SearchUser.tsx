import PostCard from "../components/PostCard";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from "@apollo/client";
import { GET_USER_ID, GET_USER_POSTS } from "../utils/queries";
import { useParams } from 'react-router-dom';
import { User } from 'react-feather';

/* This file creates a page for dispalying user info */

const SearchUser = () => {

    const { userId } = useParams() // get user id from route
    const [userPosts, setUserPosts] = useState<any[]>([]); // search user posts
    const [userData, setUserData] = useState<any>(); // serached user data
    const { refetch:getUserPosts } = useQuery(GET_USER_POSTS, {variables:{"userId":userId}}); // get searched user posts
    const { refetch:getUserData } = useQuery(GET_USER_ID, {variables:{"userId":userId}}); // get searched user data
    const dispatch = useDispatch(); // dispatch event for redux

    useEffect(() => {
        getUserPosts({ "user_id": userId }).then((res) => {
            const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
            if (newData) {
                setUserPosts(newData)
            }
        });

        getUserData({ "id": userId }).then((res) => {
            if (res.data.usersCollection.edges.length !== 0) {
                setUserData(res.data.usersCollection.edges[0].node)
            }
        })
        
    }, [dispatch, userId, getUserData, getUserPosts])

    return (
        <div className="flex flex-col w-full gap-4">
            <span className="flex flex-col md:flex-row justify-center gap-2 md:gap-8 items-center">
                <span className='flex gap-4 relative flex-col justify-center items-center'>
                    <span className='relative h-28'>
                        {
                            (userData?.photo === null) ? <User className='w-24 h-24 bg-white rounded-full stroke-blue' /> : <img src={`${import.meta.env.VITE_BASE_URI}/storage/v1/object/public/user/${userData?.photo}?ts=${Date.now()}`} className='w-28 h-28 rounded-full object-cover ring-2 ring-white' />
                        }
                    </span>
                    <span className='text-blue text-2xl font-bold'>{userData?.user_name}</span>
                </span>
                <span className='flex w-40 justify-evenly bg-white rounded-lg'>
                    <span className='flex  flex-col items-center font-bold rounded-md p-2 cursor-pointer'>{userPosts.length}<span className='font-normal'>Posts</span></span>
                    <span className='flex  flex-col items-center font-bold rounded-md p-2 cursor-pointer'>{userData?.following.length}<span className='font-normal'>Following</span></span>
                </span>
            </span>
            <span className='flex justify-center h-full w-full'>
                <div className="flex flex-col h-full max-h-fit ">
                    {userPosts?.length===0 ?
                    <span className="flex flex-col h-full justify-center gap-2">
                        <span>No posts available!</span>
                    </span>
                    :
                    <div className="flex flex-col gap-2 md:w-full">
                        <span className="flex flex-col gap-6">
                            {userPosts.map((val, index) => <PostCard key={index} data={val} isDeletModalOpen={false} handleDeletModalOpen={()=>{}}/>)}
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