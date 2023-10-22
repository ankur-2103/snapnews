import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setNewsPosts } from '../slice/postsSlice';
import PostCard from '../components/PostCard';
import { useQuery } from '@apollo/client';
import { GET_NEWS_POSTS } from '../utils/queries';

const News = () => {
    const following = useSelector((state: RootState) => state.auth.user?.following);
    const newsPosts = useSelector((state: RootState) => state.posts.newsPosts);
    const dispatch = useDispatch()
    
    const { refetch } = useQuery(GET_NEWS_POSTS, { variables: { "user_id": following } });
    
    useEffect(() => {
        refetch({ variables: { "user_id": following } }).then((res) => {
            const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
            if (newData) {
                dispatch(setNewsPosts(newData))
                console.log(newData)
            }
        });
    },[following,dispatch,refetch])

    return (
        <div className="flex flex-col h-full max-h-fit ">
                {newsPosts.length===0 ?
                <span className="flex flex-col h-full justify-center gap-2">
                    <span>No posts available!</span>
                </span>
                :
                <div className="flex flex-col gap-2 md:w-full">
                    <span className="flex flex-col gap-6">
                        {newsPosts.map((val, index) => <PostCard key={index} data={val} isDeletModalOpen={false} handleDeletModalOpen={()=>{}}/>)}
                    </span>
                    <span className=" text-center w-full">End</span>
                </div>
                }                    
        </div>
    )
}

export default News