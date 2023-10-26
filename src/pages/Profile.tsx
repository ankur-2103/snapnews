import PostCard from "../components/PostCard";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Modal from "../components/Modal";
import PostModal from '../components/PostModal'
import { useQuery } from "@apollo/client";
import { GET_USER_POSTS } from "../utils/queries";
import { setMyPosts } from "../slice/postsSlice";
import { LogOut, User, Edit2 } from 'react-feather';
import { supabase } from '../utils/supabase';
import EditAvatar from '../components/EditAvatarModal';
import { NavLink } from "react-router-dom";

/* This file creates profile page */

const Profile = () => {

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false); // state for  create post modal
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState<boolean>(false); // state for delete post modal
    const [isEditAvatarOpen, setIsEditAvatarOpen] = useState<boolean>(false); // state for edit avatar modal
    const myPosts = useSelector((state: RootState) => state.posts.myPosts); // get user posts from redux
    const user_id = useSelector((state: RootState) => state.auth.user?.id); // get user id from redux
    const user_name = useSelector((state: RootState) => state.auth.user?.user_name); // get user name from redux
    const user_photo = useSelector((state: RootState) => state.auth.user?.photo); // get user photo from redux
    const following = useSelector((state: RootState) => state.auth.user?.following); // get user following from redux
    const saved = useSelector((state: RootState) => state.auth.user?.saved); // get user saved post from redux
    const { refetch } = useQuery(GET_USER_POSTS, {variables:{"user_id":user_id}}); // query for user posts
    const dispatch = useDispatch(); // dispacth event for redux

    useEffect(() => {
        refetch({ variables: { "user_id": user_id } }).then((res) => {
            const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
            if (newData) {
                dispatch(setMyPosts(newData))
            }
        });
    }, [isCreatePostModalOpen, dispatch, user_id, refetch, isDeletePostModalOpen, isEditAvatarOpen])

    return (
        <div className="flex flex-col w-full gap-4">
            <span className="flex flex-col md:flex-row justify-center gap-2 md:gap-8 items-center">
                <button className='md:hidden fixed bottom-5 right-5 p-4 px-4 bg-blue text-white rounded-full' onClick={()=>supabase.auth.signOut()}><LogOut/></button>
                <span className='flex gap-4 relative flex-col justify-center items-center'>
                    <span className='relative h-28'>
                        {
                            user_photo === null ? <User className='w-28 h-28 bg-white rounded-full stroke-blue' /> : <img src={`${import.meta.env.VITE_BASE_URI}/storage/v1/object/public/user/${user_photo}?ts=${Date.now()}`} className='w-28 h-28 rounded-full object-cover ring-2 ring-white' />
                        }
                        <button className='absolute rounded-full bg-[#e0e0e0] ring-2 ring-white p-2 right-0 bottom-0 cursor-pointer' onClick={()=>setIsEditAvatarOpen(true)}>
                            <Edit2 className='stroke-pink w-5 h-5'/>
                        </button>
                    </span>
                    <span className='text-blue text-2xl font-bold'>{user_name}</span>
                </span>
                <span className='flex w-80 justify-evenly bg-white rounded-lg'>
                    <span className='flex flex-col items-center font-bold rounded-md p-2 cursor-pointer'>{myPosts.length}<span className='font-normal'>Posts</span></span>
                    <NavLink to={"/following"} className='flex flex-col items-center font-bold rounded-md p-2 cursor-pointer'>{following===null ? "0":following?.length}<span className='font-normal'>Following</span></NavLink>
                    <NavLink to={"/saved"} className='flex flex-col items-center font-bold rounded-md p-2 cursor-pointer'>{saved===null ? "0":saved?.length}<span className='font-normal'>Saved Posts</span></NavLink>
                </span>
            </span>
            <span className='flex justify-center h-full w-full'>
                <div className="flex flex-col h-full max-h-fit ">
                    {myPosts.length===0 ?
                    <span className="flex flex-col h-full justify-center gap-2">
                        <span>No posts available!</span>
                        <button className="bg-blue text-white p-2 rounded-lg" onClick={()=>setIsCreatePostModalOpen(true)}>Create Post</button>
                    </span>
                    :
                    <div className="flex flex-col gap-2 md:w-full">
                        <button className="bg-blue text-white p-2 rounded-lg" onClick={() => setIsCreatePostModalOpen(true)}>Create Post</button>
                        <span className="flex flex-col gap-6">
                            {myPosts.map((val, index) => <PostCard key={index} data={val} isDeletModalOpen={isDeletePostModalOpen} handleDeletModalOpen={(data)=>setIsDeletePostModalOpen(data)}/>)}
                        </span>
                        <span className=" text-center w-full">End</span>
                    </div>
                    }        
                </div>
            </span>
            <Modal children={<PostModal close={() => setIsCreatePostModalOpen(false)} />} isModalOpen={isCreatePostModalOpen} />
            <Modal children={<EditAvatar close={() => setIsEditAvatarOpen(false)} />} isModalOpen={isEditAvatarOpen} />
        </div>
    )
}

export default Profile