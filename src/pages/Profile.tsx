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
import EditAvatar from './EditAvatar';
import { NavLink } from "react-router-dom";

const Profile = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); 
    const [isEditAvatarOpen, setIsEditAvatarOpen] = useState<boolean>(false); 
    const myPosts = useSelector((state: RootState) => state.posts.myPosts);
    const user_id = useSelector((state: RootState) => state.auth.user?.id);
    const user_name = useSelector((state: RootState) => state.auth.user?.user_name);
    const user_photo = useSelector((state: RootState) => state.auth.user?.photo);
    const following = useSelector((state: RootState) => state.auth.user?.following);
    const saved = useSelector((state: RootState) => state.auth.user?.saved);
    const { refetch } = useQuery(GET_USER_POSTS, {variables:{"user_id":user_id}});
    const dispatch = useDispatch();

    useEffect(() => {
        refetch({ variables: { "user_id": user_id } }).then((res) => {
            const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
            if (newData) {
                dispatch(setMyPosts(newData))
            }
            console.log(newData)
        });
    }, [isModalOpen, dispatch, user_id, refetch, isDeletModalOpen, isEditAvatarOpen])

    return (
        <div className="flex flex-col w-full gap-4">
            <span className="flex flex-col md:flex-row justify-center gap-2 md:gap-8 items-center">
                <button className='md:hidden fixed bottom-5 right-5 p-4 px-4 bg-blue text-white rounded-full' onClick={()=>supabase.auth.signOut()}><LogOut/></button>
                <span className='flex gap-4 relative flex-col justify-center items-center'>
                    <span className='relative h-28'>
                        {
                            user_photo === null ? <User className='w-24 h-24 bg-white rounded-full stroke-blue' /> : <img src={`https://qgwjrqfxjnfydbioujcu.supabase.co/storage/v1/object/public/user/${user_photo}?ts=${Date.now()}`} className='w-28 h-28 rounded-full object-cover ring-2 ring-white' />
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
                        <button className="bg-blue text-white p-2 rounded-lg" onClick={()=>setIsModalOpen(true)}>Create Post</button>
                    </span>
                    :
                    <div className="flex flex-col gap-2 md:w-full">
                        <button className="bg-blue text-white p-2 rounded-lg" onClick={() => setIsModalOpen(true)}>Create Post</button>
                        <span className="flex flex-col gap-6">
                            {myPosts.map((val, index) => <PostCard key={index} data={val} isDeletModalOpen={isDeletModalOpen} handleDeletModalOpen={(data)=>setIsDeleteModalOpen(data)}/>)}
                        </span>
                        <span className=" text-center w-full">End</span>
                    </div>
                    }        
                </div>
            </span>
            <Modal children={<PostModal post={null} close={() => setIsModalOpen(false)} />} isModalOpen={isModalOpen} />
            <Modal children={<EditAvatar close={() => setIsEditAvatarOpen(false)} />} isModalOpen={isEditAvatarOpen} />
        </div>
    )
}

export default Profile