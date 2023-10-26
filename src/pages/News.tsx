import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PostCard from '../components/PostCard';
import { useQuery } from '@apollo/client';
import { GET_NEWS_POSTS } from '../utils/queries';
import InfiniteScroll from 'react-infinite-scroll-component';

/* This file creates page for news feed */

const News = () => {

    const following = useSelector((state: RootState) => state.auth.user?.following); // get user followings from redux
    const [newsPosts, setNewsPosts] = useState([]); // state for newsposts;
    const { refetch, data } = useQuery(GET_NEWS_POSTS, { variables: { "user_id": following, "cursor": null } }); // query news posts

    if (newsPosts.length === 0) {
        refetch({ variables: { "user_id": following } }).then((res) => {
            const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
            if (newData) {
                setNewsPosts(newData)
            }
        });
    }
    
    useEffect(() => {
        
    }, [following, refetch])
    
    // Gets next posts 20 posts
    const fetchNext  = () => {
        if (data.postsCollection.pageInfo.hasNextPage) {
            refetch({ "user_id": following, "cursor": data.postsCollection.pageInfo.endCursor}).then((res) => {
                const newData = res.data?.postsCollection?.edges.length !== 0 ? res.data?.postsCollection?.edges?.map((val: any) => val.node) : [] 
                if (newData) {
                    setNewsPosts(newsPosts.concat((newData)))
                }
            });
        }
    }

    return (
        <div className="flex flex-col h-full max-h-fit ">
            {newsPosts.length === 0 ? 
                <span className='text-center'>
                    Follow users to see their latest posts
                </span>
                :
                <div className="flex flex-col gap-2 md:w-full">
                    <InfiniteScroll className="flex flex-col gap-6" dataLength={newsPosts.length} loader={<h4>Loading...</h4>} hasMore={data?.postsCollection?.pageInfo?.hasNextPage} scrollableTarget="scollableDiv" next={fetchNext} endMessage={<span className='text-center'>Yay! You have seen it all</span>}>
                        {newsPosts.map((val, index) => <PostCard key={index} data={val} isDeletModalOpen={false} handleDeletModalOpen={()=>{}}/>)}
                    </InfiniteScroll>
                </div>
            }
        </div>
    )
}

export default News