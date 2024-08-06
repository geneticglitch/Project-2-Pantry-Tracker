"use client"
import React, { useState , useEffect} from 'react'
import {create_user, check_display_name_availability} from '@/app/auth/signup/server_actions'

export default function SignUp() {
  const [displayName, setDisplayName] = useState('');
  const [displayNameStatus, setDisplayNameStatus] = useState(false);
  const [displayNameError, setDisplayNameError] = useState('');

  const validateDisplayName = (display_name :String) => {
    if (display_name.includes(' ')) {
      setDisplayNameError('Display name cannot contain spaces');
      return false;
    }
    setDisplayNameError('');
    return true;
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (displayName) {
        const isAvailable:boolean = await check_display_name_availability(displayName);
        setDisplayNameStatus(isAvailable);
      } else {
        setDisplayNameStatus(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [displayName]);

  const handleDisplayNameChange = (e:any) => {
    const newDisplayName = e.target.value.replace(/\s/g, '');
    setDisplayName(newDisplayName);
    validateDisplayName(newDisplayName);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      display_name: { value: string };
      password: { value: string };
      name: { value: string };
    };

    if (!displayNameStatus || !validateDisplayName(displayName)) {
      alert("Please choose a valid display name");
      return;
    }

    const display_name = target.display_name.value;
    const password = target.password.value;
    const name = target.name.value;
    const result = await create_user(name,display_name,password);
    if (result.status === 200) {
      window.location.href = '/api/auth/signin';
    } else {
      alert(result.error);
    }
  }  
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Pantry Tracker    
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign Up
              </h1>
             
           
              <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your name" required/>
              </div>
              <div>
                <label htmlFor="display_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Choose a unique display name (no spaces allowed)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="display_name"
                    id="display_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Display name"
                    required
                    value={displayName}
                    onChange={handleDisplayNameChange}
                  />
                  {displayNameStatus !== null && !displayNameError && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {displayNameStatus ? (
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
                {displayNameError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{displayNameError}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <a href="/auth/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
              </p>
            </form>
          </div>
      </div>
  </div>
</section>
  )
}