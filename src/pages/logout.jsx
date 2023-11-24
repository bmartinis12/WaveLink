import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      socket.current.emit('signout', userInfo.id);
      dispatch({ type: reducerCase.SET_USER_INFO, userInfo: undefined });
      signOut(firebaseAuth);
    }
    router.push('/login');
  }, [socket]);

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-10 sm:gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 text-white">
        <Image src='/wavelink.gif' alt="wavelink" height={0} width={0} className="h-[100px] w-[200px] sm:h-[200px] sm:w-[300px]" />
        <span className="text-4xl sm:text-7xl">Wave<span className="text-[#00aeef]">Link</span></span>
      </div>
    </div>
  );
}

export default logout;
