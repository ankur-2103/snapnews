import {useEffect} from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PrivateRoute from './routes/PrivateRoute';
import { useDispatch } from 'react-redux';
import { supabase } from './utils/supabase';
import { logout, setUser } from './slice/authSlice';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER, GET_USER_ID } from './utils/queries';
import { generateUserName } from './utils/utils';
import PublicRoute from './routes/PublicRoute';

const App = () => {
  const dispatch = useDispatch();// dispatch event for redux
  const { refetch } = useQuery(GET_USER_ID, { variables: {id:"as"} }) // query for getting user info using user id
  const [addUser] = useMutation(CREATE_USER) // mutation for add user
  const navigate = useNavigate(); // used for navigating to other page

  useEffect(() => {
    
    // Check if the user is already authenticated
    // Set up auth listener for real-time updates
    const auth = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        dispatch(logout());
        navigate('/signin')
      }
      if (session?.user) {
        refetch({ id: session.user.id }).then(({data}) => {
          if ( data?.usersCollection?.edges[0]?.node) {
            const user = data.usersCollection.edges[0].node
            dispatch(setUser(user));
          } else {
            addUser({ variables: { id: session?.user?.id, user_name: generateUserName(session.user.user_metadata?.full_name, session.user.email) + "#" + session.user.id.substring(0, 4) } }).then((data) => {
              dispatch(setUser(data))
            });
          }
        });
      } else {
        navigate('/signin')
      }
    });
    
    return () => {
      // Clean up the listener
      auth.data.subscription.unsubscribe()
    };
  }, [addUser,dispatch,refetch]);

  return (
      <Routes>
        <Route path="/signin" element={<PublicRoute element={<Signin />}/>} />
        <Route path="*" element={<PrivateRoute element={<Home />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup/>}/>} />
      </Routes>
  )
}

export default App