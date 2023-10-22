import { useState, useEffect } from 'react'
import { User } from 'react-feather';
import { Trash, Heart, Bookmark } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import Modal from './Modal';
import DeleteModal from './DeleteModal';
import { Post } from '../slice/postsSlice';
import { useMutation } from '@apollo/client';
import {  UPDATE_POST, UPDATE_USER } from '../utils/queries';
import { addFollowing, addSavedPost, removeFollowing, removeSavedPost } from '../slice/authSlice';

interface PostCardProps{
    data: Post;
    isDeletModalOpen: boolean;
    handleDeletModalOpen: (post:boolean) => void
}

const detectAndRenderLinks = (text:string) => {

    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const matches = text.match(urlRegex);
  
    if (!matches) {
        return text;
    }
  
    const parts = text.split(urlRegex);
    return parts.map((part:string, index:number) => {
        if (matches[index]) {
            return (
                <a className='text-[#0324fc] underline' key={index} href={matches[index]} target="_blank" rel="noopener noreferrer">
                    Link
                </a>
            );
        }
      return part;
    });
};

const PostCard: React.FC<PostCardProps> = ({ data,isDeletModalOpen, handleDeletModalOpen}) => {
    const auth = useSelector((state: RootState) => state.auth.user);
    const [post, setPost] = useState<Post>(data);
    const isLike = post.likes.includes(auth!.id);
    const savedPosts = useSelector((state: RootState) => state.auth.user?.saved);
    const following = useSelector((state: RootState) => state.auth.user?.following);
    const isFollowing = post===null ? false : following!.includes(post.user_id);
    const isSaved = post === null ? false : savedPosts!.includes(post.id)
    const filterDescription = detectAndRenderLinks(post===null ? "" : post.description);
    const [updatePost] = useMutation(UPDATE_POST);
    const [updateUser] = useMutation(UPDATE_USER);
    const dispatch = useDispatch();
    console.log(isLike)

    // const getPost = async () => {
    //     await refetch({ "id": id }).then((res) => {
    //         if (res.post.postsCollection.edges.length !== 0) {
    //             const newpost:Post = res.post.postsCollection.edges[0].node
    //             setPost(newpost);
    //             setIsFollowing(following!.includes(newpost.user_id))
    //             setIsLike(newpost.likes.includes(auth!.id));
    //         }
    //     })
    // }
    // getPost();
    
    const handleLike = () => {
        if(post===null)return
        if (isLike) {
            setPost({...post,"likes":post.likes.filter((val)=>val!==auth!.id)})
        } else {
            setPost({ ...post, "likes": [...post.likes, auth!.id] });
        }
        console.log("2")
    } 

    const handleSave = () => {
        if(post===null)return
        if (isSaved) {
            dispatch(removeSavedPost(post.id));
        } else {
            dispatch(addSavedPost(post.id));
        }
    }
    
    const handleFollowing = () => {
        if(post===null)return
        if (isFollowing) {
            dispatch(removeFollowing(post.user_id));
        } else {
            dispatch(addFollowing(post.user_id));
        }
    }
    
    useEffect(() => {
        const updateLikes = async () => {
            await updatePost({ variables: { "id": post.id, "post": { "likes": post.likes } } })
        }
        const updateUserData = async () => {
            await updateUser({ variables: { "id": auth?.id, "user": { "following": following, "saved": savedPosts } } })
        }
        
        if (post.likes !== data.likes) {
            updateLikes();
        }
        updateUserData()

    },[ updatePost, post, savedPosts, auth?.id, following,updateUser,data])
    

    return (
        <div className="flex flex-col gap-2 w-[320px] max-w-[320px] bg-white md:w-500px md:max-w-[500px] lg:w-[600px] lg:max-w-[600px] rounded-lg px-4 pt-2 divide-y-2 divide-[#e0e0e0]" onDoubleClick={handleLike}>
            <span className='flex flex-col gap-2'>
                <span className="flex h-12 items-center gap-2 ">
                    {
                        post.user_photo === null  ? <User className='w-10 h-10 bg-white rounded-full stroke-blue' /> : <img src={`https://qgwjrqfxjnfydbioujcu.supabase.co/storage/v1/object/public/user/${post.user_photo}?ts=${Date.now()}`} className='w-10 rounded-full object-cover' />
                    }
                    <span className='font-bold'>{post.user_name}</span>
                    <button className={`p-1 h-fit font-medium px-2 rounded-md ${auth?.id===post.user_id && "hidden"} ${isFollowing ? "rounded-md bg-[#e0e0e0]" : "bg-blue text-white"}`} onClick={handleFollowing}>{isFollowing ? "Following" : "Follow"}</button>
                </span>
                <p className='overflow-ellipsis'>{filterDescription}</p>
                <span className='text-[#3748b1] font-medium'>{post.tags.join(", ")}</span>
                <span className='flex justify-center items-center'>
                    {post.photo !== null
                        && <img src={`https://qgwjrqfxjnfydbioujcu.supabase.co/storage/v1/object/public/posts/${post.photo}`} className='max-h-96 object-cover max-w-full w-96' />}
                </span> 
            </span>
            <span className={`p-2 ${post.user_id === auth?.id ? "flex" : "hidden"}`}>
                <button className='flex justify-center p-2 hover:bg-[#e0e0e0] bg-white flex-1 rounded-lg' onClick={()=>handleDeletModalOpen(true)}><Trash/></button>
            </span>
            <span className={`p-1 ${post.user_id !== auth?.id ? "flex" : "hidden"}`}>
                <button className='flex gap-2 justify-center p-2 hover:bg-[#e0e0e0] bg-white flex-1 rounded-lg' onClick={handleLike}><Heart className={`${isLike && "fill-pink stroke-pink"}`} /><span>{post===null ? "0" : post.likes.length}</span></button>
                <button className='flex justify-center p-2 hover:bg-[#e0e0e0] bg-white flex-1 rounded-lg' onClick={handleSave}><Bookmark className={`${isSaved && "fill-blue stroke-blue"}`}/></button>
            </span>
            <Modal children={<DeleteModal id={post!.id} close={()=>handleDeletModalOpen(false)} />} isModalOpen={isDeletModalOpen} />
        </div>
    )
}

export default PostCard