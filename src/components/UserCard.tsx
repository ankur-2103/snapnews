import { NavLink } from "react-router-dom"
import { User } from "react-feather";
import {useEffect} from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../utils/queries";
import { addFollowing, removeFollowing } from "../slice/authSlice";

/* This component creates user card */

interface UserCard{
    data:any // data for user card
}

const UserCard: React.FC<UserCard> = ({ data }) => {
    
    const following = useSelector((state: RootState) => state.auth.user?.following); // get user followings from redux
    const userId = useSelector((state: RootState) => state.auth.user?.id); // get user id from redux
    const isFollowing = following?.includes(data.id); // check user is following the searched user
    const dispatch = useDispatch(); // dispatch event for redux
    const [updateUser] = useMutation(UPDATE_USER); // mutation for update user

    // handle user followings
    const handleFollowing = () => {
        if (isFollowing) {
            dispatch(removeFollowing(data.id));
        } else {
            dispatch(addFollowing(data.id));
        }
    }
    
    useEffect(() => {
        if (following !== null) {
            updateUser({variables:{"id":userId,"user":{"following":following}}}) // update user followings
        }
    },[following,updateUser, userId])

    return (
        <span className="flex p-2 h-20 items-center bg-white rounded-lg">
            <NavLink to={userId===data.id ? `/profile` : `/user/${data.id}`} className="flex flex-1 gap-4 justify-center items-center">
            {
                data.photo === null ? <User className='w-16 h-16 bg-white rounded-full stroke-blue' /> : <img src={`${import.meta.env.VITE_BASE_URI}/storage/v1/object/public/user/${data.photo}?ts=${Date.now()}`} className='w-16 rounded-full object-cover' loading="lazy" />
            }
                <span className="flex-1">{data.user_name}</span>
            </NavLink>
            <button className={`p-1 h-fit font-medium px-2 rounded-md ${userId===data.id && "hidden"} ${isFollowing ? "bg-[#e0e0e0]" : "bg-blue text-white"}`} onClick={handleFollowing}>{isFollowing ? "Following" : "Follow"}</button>
        </span>
    )
}

export default UserCard