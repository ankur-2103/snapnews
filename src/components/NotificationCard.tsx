import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_USERS, UPDATE_USER } from "../utils/queries";
import { RootState } from "../store";
import { addFollowing, removeFollowing } from "../slice/authSlice";
import { User } from "react-feather";
import { NavLink } from "react-router-dom";

/* This component creates a card for notifications page */

/* Anuthor = Person from which the user got the notification */ 

interface NotificationCardProps{
    data: any; // Notification data
}

const NotificationCard:React.FC<NotificationCardProps> = ({data}) => {

    const following = useSelector((state: RootState) => state.auth.user?.following); // Get user followings from redux
    const userId = useSelector((state: RootState) => state.auth.user?.id); // Get user id
    const [authorPhoto, setAuthorPhoto] = useState(null); // State for author photo
    const dispatch = useDispatch(); // Dispatch event for redux
    const { refetch } = useQuery(GET_USERS, {variables:{"id":[data.authorId]}}); // Query for getting author info using author id
    const [updateUser] = useMutation(UPDATE_USER); // Mutation for updating user

    // handle user followings
    const handleFollowing = (id: string) => {
        if (following?.includes(id)) {
            dispatch(removeFollowing(id));
        } else {
            dispatch(addFollowing(id));
        }
    }

    useEffect(() => {
        refetch({ "id": [data.authorId] }).then((res) => {
            if (res.data.usersCollection.edges[0]) {
                setAuthorPhoto(res.data.usersCollection.edges[0].node.photo); // set author photo
            }
        })
        if (following !== null) {
            updateUser({variables:{"id":userId,"user":{"following":following}}}) // update user followings
        }
    },[userId,following,updateUser,refetch,data])

    return (
        <span className="flex h-16 md:h-20 items-center gap-2 bg-white rounded-lg p-2">
            <NavLink to={`/post/${data.postId}`} className={"flex items-center flex-1 gap-2"} >
                {authorPhoto === null ? <User className='w-10 h-10 md:w-16 md:h-16 bg-white rounded-full stroke-blue' /> : <img src={`${import.meta.env.VITE_BASE_URI}/storage/v1/object/public/user/${authorPhoto}?ts=${Date.now()}`} className='w-10 md:w-16 rounded-full object-cover' />}
                <span className="">{data.content}</span>
            </NavLink>
            <button className={`p-1 h-fit font-medium px-2 rounded-md ${userId===data.id && "hidden"} ${following?.includes(data.authorId) ? "bg-[#e0e0e0]" : "bg-blue text-white"}`} onClick={()=>handleFollowing(data.authorId)}>{following?.includes(data.authorId) ? "Following" : "Follow"}</button>
        </span>
    )
}

export default NotificationCard