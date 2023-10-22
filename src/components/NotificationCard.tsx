import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_USERS, UPDATE_USER } from "../utils/queries";
import { RootState } from "../store";
import { addFollowing, removeFollowing } from "../slice/authSlice";
import { User } from "react-feather";
import { NavLink } from "react-router-dom";

interface NotificationCardProps{
    data: any;
}

const NotificationCard:React.FC<NotificationCardProps> = ({data}) => {

    const following = useSelector((state: RootState) => state.auth.user?.following);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const [authorPhoto, setAuthorPhoto] = useState(null);
    const dispatch = useDispatch();
    const { refetch } = useQuery(GET_USERS, {variables:{"id":[data.authorId]}});
    const [updateUser] = useMutation(UPDATE_USER);

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
                setAuthorPhoto(res.data.usersCollection.edges[0].node.photo);
            }
        })
        if (following !== null) {
            updateUser({variables:{"id":userId,"user":{"following":following}}})
        }
    },[userId,following,updateUser,refetch,data])

    return (
        <span className="flex h-16 md:h-20 items-center gap-2 bg-white rounded-lg p-2">
            <NavLink to={`/post/${data.postId}`} className={"flex items-center flex-1 gap-2"} >
                {authorPhoto === null ? <User className='w-10 h-10 md:w-16 md:h-16 bg-white rounded-full stroke-blue' /> : <img src={`https://qgwjrqfxjnfydbioujcu.supabase.co/storage/v1/object/public/user/${authorPhoto}?ts=${Date.now()}`} className='w-10 md:w-16 rounded-full object-cover' />}
                <span className="">{data.content}</span>
            </NavLink>
            <button className={`p-1 h-fit font-medium px-2 rounded-md ${userId===data.id && "hidden"} ${following?.includes(data.authorId) ? "bg-[#e0e0e0]" : "bg-blue text-white"}`} onClick={()=>handleFollowing(data.authorId)}>{following?.includes(data.authorId) ? "Following" : "Follow"}</button>
        </span>
    )
}

export default NotificationCard