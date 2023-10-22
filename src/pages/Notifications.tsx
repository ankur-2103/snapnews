import { useSelector } from "react-redux";
import { RootState } from "../store";
import  {useEffect} from "react"
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../utils/queries";
import NotificationCard from "../components/NotificationCard";

const Notifications = () => {

    const notifications = useSelector((state: RootState) => state.auth.user?.notifications);
    const following = useSelector((state: RootState) => state.auth.user?.following);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const [updateUser] = useMutation(UPDATE_USER);
    const seenNotification = notifications?.map((val:object) => {
        return JSON.stringify({
            ...val,
            "isNew":false
        })
    })
    

    console.log(seenNotification)

    // <!--  -->
    
    useEffect(() => {
        const markAsSeen = async () => {
            await updateUser({ variables: { "id": userId, "user": { "notifications": seenNotification } } }).then((res)=>console.log(res));
        }
        return (() => {
            markAsSeen();
        })
    },[following,updateUser,seenNotification,userId])
    

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