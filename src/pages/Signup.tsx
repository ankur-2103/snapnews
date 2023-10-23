import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/spannews-logo.svg';
import { NavLink } from 'react-router-dom';
import { CREATE_USER } from '../utils/queries';
import { useMutation } from '@apollo/client';
import { generateUserName } from '../utils/utils';

const Signup = () => {
    const navigate = useNavigate();// used for navigating to other page
    const [email, setEmail] = useState('');// state for email
    const [password, setPassword] = useState('');// state for password
    const [error, setError] = useState(''); // state for error
    const [addUser] = useMutation(CREATE_USER); // mutation for create user

    // handle sign up
    const handleSignup = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.signUp({email:email, password:password});
            
            if (error) {
                setError('Signup error: '+ error.message);
            } else {
                if (user?.id) {
                    addUser({ variables: { id: user?.id, user_name: generateUserName(user.user_metadata.name, email) + "#" + user.id.substring(0, 4) } }).then(() => {
                        navigate('/')
                    })
                }
            }
        } catch (error:any) {
            console.error('Signup error: ', error.message);
        }
    };

    return (
        <div className='flex flex-col md:flex-row justify-center items-center w-full h-[100vh] md:text-md text-lg text-white'>
            <div className='flex flex-col items-center md:flex-row p-2 md:w-1/2 h-fit bg-[#271c4f] rounded-2xl'>
                <div className='flex flex-1 justify-center text-3xl font-extrabold'>
                        <img src={Logo} className='h-20'/>
                </div>
                <div className='flex flex-1 flex-col'>
                    <span className="flex flex-1 flex-col gap-4 items-center px-4 py-2 font-medium">
                        <h1>SIGN UP</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border-0 py-1.5 pl-2 ring-2 ring-inset ring-white sm:text-sm sm:leading-6 outline-none bg-[transparent] font-medium"
                            autoComplete='email'
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border-0 py-1.5 pl-2 ring-2 ring-inset ring-white sm:text-sm sm:leading-0 outline-none bg-[transparent] font-bold"
                            autoComplete='current-password'
                        />
                        <span>{error}</span>
                        <button onClick={handleSignup} className='rounded-md bg-white text-blue w-full p-1'>Sign Up</button>
                    </span>
                    <span className='flex flex-col items-center gap-2 px-4 py-2'>
                        <span>OR</span>
                        <span>Already have accout <NavLink to={'/signin'} className='underline font-semibold underline-offset-4'>Sign Up</NavLink></span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
{/* <h1>Signup</h1>
<input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>
<input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>
    <button onClick={handleSignup}>Log In</button>
    <button onClick={handleGoogle}>Google</button>
    <button onClick={()=>supabase.auth.signOut()}>Logout</button> */}
