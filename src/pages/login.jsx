import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from 'react-icons/fc'

function login() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) router.push('/');
  }, [userInfo, newUser])

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const { user: { displayName: name, email, photoURL: profileImage } } = await signInWithPopup(firebaseAuth, provider);

    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });

        if (!data.status) {
          dispatch({ type: reducerCase.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCase.SET_USER_INFO,
            userInfo: { name, email, profileImage, status: '' }
          })
          router.push('/onboarding')
        } else {
          const { id, name, email, profilePicture: profileImage, status } = data.data;
          dispatch({
            type: reducerCase.SET_USER_INFO,
            userInfo: { id, name, email, profileImage, status }
          });
          router.push('/');
        }
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-10 sm:gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 text-white">
        <Image src='/wavelink.gif' alt="wavelink" height={0} width={0} className="h-[100px] w-[200px] sm:h-[200px] sm:w-[300px]" />
        <span className="text-4xl sm:text-7xl">Wave<span className="text-[#00aeef]">Link</span></span>
      </div>
      <button onClick={handleLogin} className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-md">
        <FcGoogle className="text-2xl sm:text-4xl" />
        <span className="text-white text-xl sm:text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
