import { useState, useRef } from "react";
import { Post } from "../slice/postsSlice"
import { supabase } from "../utils/supabase";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST, GET_USERS_ID, UPDATE_USER } from "../utils/queries";
import { generateUniqueId } from "../utils/utils";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PostModalProps{
    post: Post | null
    close: () => void
} 

const fileInputTypes = 'image/png, image/jpeg';

const PostModal:React.FC<PostModalProps> = ({ post = null, close }) => {
    const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
    const [description, setDescription] = useState<string>(post?.description===null || post===null ? '' : post.description);
    const [tags, setTags] = useState<string>(post?.tags?.length===0 || post===null? '' : post.tags.toString());
    const [upLoading, setUpLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const auth = useSelector((state: RootState) => state.auth.user);
    const [createPost] = useMutation(CREATE_POST);
    const [updateUser] = useMutation(UPDATE_USER);
    const {refetch} = useQuery(GET_USERS_ID)

    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedMedia(event.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedMedia(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleUpload = async () => {
        setUpLoading(true);
        const postId = generateUniqueId();
        try {
            if (selectedMedia!==null) {
                const { data, error } = await supabase.storage.from('posts').upload(`media/${postId}.${selectedMedia.type.split('/').pop()}`, selectedMedia);
                if (error) {
                    console.error('Error uploading media:', error);
                } else {
                    await createPost({ variables: { "id": postId, "user_id": auth?.id, "user_name":auth?.user_name, "description": description, "tags": tags.split(",").map((val) => val.trim()), "photo": data.path } }).then().catch((err) => console.log(err))
                }
            } else {
                await createPost({variables:{"id": postId, "user_id": auth?.id, "user_name":auth?.user_name,"description":description, "tags":tags.split(",").map((val) => val.trim())}}).then().catch((err)=>console.log(err))
            } 
            sendNotifications(postId);
        } catch (error) {
            console.log(error)
        }
        
        setUpLoading(false);
        close()
    }

    const sendNotifications = async (postId:string) => {
        const tagsUsername = tags.split(",").map((val) => val.trim());
        let users:any[] = [];
        const notification = { "isNew": true, "postId": postId, "content": `${auth?.user_name} tagged you in his new post!`, "authorId": auth?.id };
        

        await refetch({ "user_name": tagsUsername }).then((res) => {
            res.data.usersCollection.edges?.map?.((data:any) => {
                users = [...users, data.node]
                console.log(data.node)
            })
        })

        users?.map((user) => {
            const notifications = user.notifications.map((val:any)=>JSON.stringify(val))
            updateUser({variables:{"user":{"notifications":[...notifications,JSON.stringify(notification)]}, "id":user.id}})
        })

    }

    return (
        <div className="flex relative flex-col bg-white rounded-lg max-w-[500px] lg:w-1/3 h-fit max-h-[600px] overflow-auto p-2 gap-2">
            <span className={`absolute hidden top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-xl text-blue font-bold animate-pulse ${upLoading && "block"}`}>Processing...</span>
            <span className="text-center">{post===null ? "Create Post" : "Edit Post"}</span>
            <span >Description :
                <textarea className="w-full rounded-md border-0 py-1.5 pl-2 ring-2 ring-inset ring-[#e0e0e0] sm:text-sm sm:leading-6 outline-none bg-[transparent] font-medium" rows={8} disabled={upLoading} value={description} onChange={(e:any)=>setDescription(e.target.value)}></textarea>
            </span>
            <span >Tags ( , sperated eg: username, username) :
                <input className="w-full rounded-md border-0 py-1.5 pl-2 ring-2 ring-inset ring-[#e0e0e0] sm:text-sm sm:leading-6 outline-none bg-[transparent] font-medium" disabled={upLoading} value={tags} onChange={(e:any)=>setTags(e.target.value)}></input>
            </span>
            <span className="flex flex-col gap-2">Add Photo/Video :
                <input type="file" onChange={handleMediaChange} accept={fileInputTypes} className="block w-full text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-blue" ref={fileInputRef} disabled={upLoading}></input>
                {selectedMedia && (
                    <div className="flex flex-col gap-2">
                        <img src={URL.createObjectURL(selectedMedia)} alt="Selected Image" />
                        <button className="ring-2 ring-blue p-1 rounded-md w-fit" onClick={handleRemoveFile} disabled={upLoading}>Remove file</button>
                    </div>
                )}
            </span>
            <span className="flex justify-end gap-4">
                <button className="ring-2 ring-blue p-2 rounded-md" onClick={close} disabled={upLoading}>Cancel</button>
                <button className="p-2 bg-blue text-white rounded-md" onClick={handleUpload} disabled={upLoading}>{post === null ? "Create" : "Edit"}</button>
            </span>
        </div>
    )
}

export default PostModal