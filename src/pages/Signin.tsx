import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/spannews-logo.svg';
import { NavLink } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate(); // used for navigating to other page
    const [email, setEmail] = useState(''); // state for email
    const [password, setPassword] = useState(''); // state for password
    const [error, setError] = useState(''); // state for error

    // handle sign in
    const handleSignin = async () => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError('Signin error: '+error.message);
            } else {
                navigate('/')
                setError('')
            }
        } catch (error:any) {
            console.error('Signin error: ', error.message);
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
                        <h1>SIGN IN</h1>
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
                        <button onClick={handleSignin} className='rounded-md bg-white text-blue w-full p-1'>Sign In</button>
                    </span>
                    <span className='flex flex-col items-center gap-2 px-4 py-2'>
                        <span>OR</span>
                        <span>Don't have accout <NavLink to={'/signup'} className='underline font-semibold underline-offset-4'>Create one</NavLink></span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Signin;

