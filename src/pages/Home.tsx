import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import Logo from '../assets/spannews-logo.svg';
import Notifications from './Notifications';
import News from './News';
import {FileText, Bell, LogOut, User, Search} from 'react-feather'
import Profile from './Profile';
import SearchPage from './Search';
import { supabase } from '../utils/supabase';
import SearchUser from './SearchUser';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from '@apollo/client';
import { GET_USER_ID } from '../utils/queries';
import { setUser } from '../slice/authSlice';
import Post from './Post';
import Following from './Following';
import Savedposts from './Savedposts';

const Home = () => {
    const location = useLocation();
    const user_name = useSelector((state: RootState) => state.auth.user?.user_name);
    const user_photo = useSelector((state: RootState) => state.auth.user?.photo);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const notifications = useSelector((state: RootState) => state.auth.user?.notifications);
    const { refetch } = useQuery(GET_USER_ID, { variables: { "id": userId } });
    const dispatch = useDispatch()
    const hasNewNotification = notifications?.reduce((prev, curr: any) => prev || curr.isNew, false)
    

    useEffect(() => {
        refetch({"id":userId}).then((res) => {
            if (res.data.usersCollection.edges.length) {
                dispatch(setUser(res.data.usersCollection.edges[0].node));
                // console.log(res.data)
            }
        })
    },[location,refetch,userId,dispatch])

    return (
        <div className="flex flex-col h-[100vh] max-h-[100vh] bg-[#e0e0e0] lg:items-center">
            <header className="flex flex-col p-1 md:py-2 items-center w-full bg-blue">
                <img src={Logo} className='h-12' />
            </header>
            <div className='flex flex-1 overflow-hidden lg:w-min'>
                <div className='flex-col hidden md:flex px-2 py-1 w-64 h-min'>
                    <span className='flex flex-col  bg-white rounded-lg'>
                        <span className='flex flex-col gap-2 w-full h-44 items-center justify-center bg-[transparent] p-8'>
                            {
                                user_photo === null ? <User className='w-24 h-24 bg-white rounded-full stroke-blue' /> : <img src={`https://qgwjrqfxjnfydbioujcu.supabase.co/storage/v1/object/public/user/${user_photo}?ts=${Date.now()}`} className='w-28 rounded-full object-cover' />
                            }
                            <span className='font-bold text-xl text-blue'>{user_name}</span>
                        </span>
                        <span className='flex flex-col gap-2 p-2 '>
                            <NavLink to={'/'} className={`flex gap-2 items-center rounded-md px-4 py-2 ${location.pathname === '/' ? 'bg-blue text-white font-medium' : 'bg-white'}`}><FileText/>News</NavLink>
                            <NavLink to={'/search'} className={`flex gap-2 items-center rounded-md px-4 py-2 ${location.pathname === '/search' ? 'bg-blue text-white font-medium' : 'bg-white'}`}><Search/>Search</NavLink>
                            <NavLink to={'/notifications'} className={`flex relative gap-2 items-center rounded-md px-4 py-2 ${location.pathname === '/notifications' || location.pathname.includes("post") ? 'bg-blue text-white font-medium' : 'bg-white'}`}><Bell/> <span className={`${hasNewNotification && "animate-ping  bg-blue"} absolute inline-flex h-6 w-6 left-4 rounded-full opacity-75`}></span>Notifications</NavLink>
                            <NavLink to={'/profile'} className={`flex gap-2 items-center rounded-md px-4 py-2 ${location.pathname === '/profile' || location.pathname.includes("following") || location.pathname.includes("saved") ? 'bg-blue text-white font-medium' : 'bg-white'}`}><User/>User</NavLink>
                            <button className={`flex hover:bg-blue hover:text-white gap-2 items-center rounded-md px-4 py-2 bg-['#ffff']`} onClick={() => { supabase.auth.signOut() }}><LogOut/>Log out</button>
                        </span>
                    </span>
                </div>
                <div className='w-full flex-1 flex flex-col'>
                    <span className='flex w-full md:hidden'>
                        <NavLink to={'/'} className={`flex flex-1 gap-2 justify-center px-4 py-2 rounded-b-lg ${location.pathname === '/' ? 'bg-blue text-white font-medium' : 'bg-white'}`}><FileText />{location.pathname === '/' && "News"}</NavLink>
                        <NavLink to={'/search'} className={`flex flex-1 gap-2 justify-center px-4 py-2 rounded-b-lg ${location.pathname === '/search' || location.pathname.includes("user") ? 'bg-blue text-white font-medium' : 'bg-white'}`}><Search />{(location.pathname === '/search' || location.pathname.includes("user")) && "Search"}</NavLink>
                        <NavLink to={'/notifications'} className={`flex flex-1 relative gap-2 justify-center px-4 py-2 rounded-b-lg ${location.pathname === '/notifications' || location.pathname.includes("post") ? 'bg-blue text-white font-medium' : 'bg-white'}`}><Bell/>{(location.pathname === '/notifications' || location.pathname.includes("post"))&&"Notification"}<span className={`${hasNewNotification && location.pathname !== '/notifications' && !location.pathname.includes("post") && "animate-ping  bg-blue"} absolute inline-flex h-5 w-5 top-[20%]  rounded-full opacity-75`}></span></NavLink>
                        <NavLink to={'/profile'} className={`flex flex-1 gap-2 justify-center px-4 py-2 rounded-b-lg ${location.pathname === '/profile' || location.pathname.includes("following") || location.pathname.includes("saved") ? 'bg-blue text-white font-medium' : 'bg-white'}`}><User />{(location.pathname === '/profile' || location.pathname.includes("following") || location.pathname.includes("saved")) && "Profile"}</NavLink>
                    </span>
                    <div className='flex flex-1 lg:w-[850px] lg:max-w-[850px] overflow-x-hidden justify-center p-4 overflow-auto scroll-smooth no-scrollbar'>
                        <Routes >
                            <Route path='/' element={<News/>} />
                            <Route path='/notifications' element={<Notifications/>} />
                            <Route path='/profile' element={<Profile/>} />
                            <Route path='/search' element={<SearchPage/>} />
                            <Route path='/user/:userId' element={<SearchUser/>} />
                            <Route path='/post/:postId' element={<Post/>} />
                            <Route path='/following' element={<Following/>} />
                            <Route path='/saved' element={<Savedposts/>} />
                        </Routes>
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Home