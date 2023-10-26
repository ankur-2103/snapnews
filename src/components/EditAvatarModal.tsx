import { useSelector } from "react-redux";
import { useRef, useState } from 'react';
import { RootState } from "../store";
import { User } from 'react-feather';
import AvatarEditor from "react-avatar-editor";
import { supabase } from "../utils/supabase";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_POSTS, UPDATE_POSTS, UPDATE_USER } from "../utils/queries";

/* This component creates user photo update modal */

interface EditAvatarProps{
    close: () => void; // handle modal close event
}

const fileInputTypes = 'image/png, image/jpeg'; // input types for accepting images in edit avatar modal

const EditAvatar: React.FC<EditAvatarProps> = ({close}) => {
    
    const userPhoto = useSelector((state:RootState)=>state.auth.user?.photo) // get user photo
    const userId = useSelector((state: RootState) => state.auth.user?.id) // get user id
    const [selectedMedia, setSelectedMedia] = useState<File | null>(null); // selected media
    let userPostIds:any[] = []; // user post ids
    const ref = useRef<AvatarEditor | null>(null); // ref for img input element
    const [updateUser] = useMutation(UPDATE_USER); // mutation for update user
    const [updatePosts] = useMutation(UPDATE_POSTS); // mutaion for upadate post
    const { refetch } = useQuery(GET_USER_POSTS, { variables: { "user_id": userId } }); // query for getting user posts
    
    // handle media change for input element 
    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedMedia(file);
        }
    };

    // handle media upload
    const handleUpload = async () => {
        if (ref) {
            const canvas = ref.current?.getImageScaledToCanvas(); // get selected area of media
            const blob:any = await new Promise((resolve) => {
                canvas?.toBlob((b) => resolve(b as Blob))
            }); // generate blob of canvas

            if (userPhoto === null) {
                const { error } = await supabase.storage.from('user').upload(userId + ".png", blob, {
                    cacheControl: '3600',
                    upsert: true,
                }) // upload user photo
                if (error) return
                await updateUser({ variables: { "id": userId, "user": { "photo": userId + ".png" } } }) // update user
            } else {
                const { error } = await supabase.storage.from('user').update(userId + ".png", blob, {
                    cacheControl: '0',
                    upsert: true,
                }) // update user photo
                if (error) return  
            }

            await refetch({ "user_id": userId }).then((res) => {
                if (res.data.postsCollection.edges.length !== 0) {
                    userPostIds = res.data.postsCollection.edges.map((data:any)=>data.node.id)
                }
            }) // get user post ids


            await updatePosts({ variables: { "post": { "user_photo": userId + ".png" }, "id": userPostIds } }); // update user posts
            
            close()
        }
    }

    return (
        <div className="flex flex-col rounded-lg p-2 w-80 max-w-80 md:max-w-96 md:w-96 bg-white gap-4 items-center">
            <span>Update Avatar</span>
            <span className="h-24">
                {
                    userPhoto === null ? <User className='w-24 h-24 bg-white rounded-full stroke-blue' /> : <img src={`${import.meta.env.VITE_BASE_URI}/storage/v1/object/public/user/${userPhoto}?ts=${Date.now()}`} className='w-24 rounded-full' />
                }          
            </span>
            {selectedMedia && 
                <AvatarEditor ref={ref} image={URL.createObjectURL(selectedMedia)} width={250} height={250} border={10} borderRadius={150} scale={1.2} rotate={0}/>
            }
            <input type="file" onChange={handleMediaChange} accept={fileInputTypes} className="block w-fit text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-blue cursor-pointer" ></input>
            <span className="flex w-full justify-end gap-2">
                <button className="py-1 px-4 ring-2 ring-blue text-blue rounded-lg" onClick={close}>Cancel</button>
                <button className={`py-1 px-4 bg-blue text-white rounded-lg ${selectedMedia===null && "hidden"}`} onClick={handleUpload}>Upload</button>
            </span>
        </div>
    )
}

export default EditAvatar;