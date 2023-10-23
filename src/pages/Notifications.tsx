import { useSelector } from "react-redux";
import { RootState } from "../store";
import  {useEffect} from "react"
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../utils/queries";
import NotificationCard from "../components/NotificationCard";

/* This file creates notification page */

const Notifications = () => {

    const notifications = useSelector((state: RootState) => state.auth.user?.notifications); // get user notifications from redux
    const userId = useSelector((state: RootState) => state.auth.user?.id); // get user id from redux
    const [updateUser] = useMutation(UPDATE_USER); // mutation for update user
    const seenNotification = notifications?.map((val:object) => {
        return JSON.stringify({
            ...val,
            "isNew":false
        })
    }) // mark notifications as seen
    

    useEffect(() => {
        const markAsSeen = async () => {
            await updateUser({ variables: { "id": userId, "user": { "notifications": seenNotification } } }).then((res)=>console.log(res));
        }
        return (() => {
            markAsSeen();
        })
    },[])
    

    return (
    <div className="flex-1">
            {
                notifications?.length === 0 ?
                    <span className="flex items-center justify-center w-full h-full">
                        No notifications available
                    </span>
                    :
                    <span className="flex flex-col gap-2">
                        {notifications?.map((data: any, index) => 
                            <NotificationCard data={data} key={index}/>
                        )}
                    </span>
            }
        </div>
    )
}

export default Notifications;