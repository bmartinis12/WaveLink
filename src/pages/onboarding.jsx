import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function onboarding() {
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const router = useRouter();

  const [name, setName] = useState(userInfo?.name || '');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState('/default_avatar.png');

  useEffect(() => {
    if (!newUser) router.push('/');
  }, [newUser, userInfo, router])

  const onboardUserHandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image
        });

        if (data.status) {
          dispatch({ type: reducerCase.SET_NEW_USER, newUser: false });
          dispatch({
            type: reducerCase.SET_USER_INFO,
            userInfo: {
              id: data.user.id,
              name,
              email,
              profileImage: image,
              status: about
            }
          });
          router.push('/');
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const validateDetails = () => {
    if (name.length < 3) return false;
    return true;
  }

  return (
    <div className="h-screen w-screen bg-panel-header-background flex flex-col items-center justify-center text-white">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <Image src='/wavelink.gif' alt="wavelink" height={0} width={0} className="h-[100px] w-[200px] sm:h-[200px] sm:w-[300px]" />
        <span className="text-5xl sm:text-7xl">Wave<span className="text-[#00aeef]">Link</span></span>
      </div>
      <h2 className="text-2xl mt-10">Create your profile</h2>
      <div className="flex flex-col-reverse sm:flex-row gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name='Display Name' state={name} setState={setName} label />
          <Input name='About' state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button onClick={onboardUserHandler} className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-md">Create Profile</button>
          </div>
        </div>
        <div>
          <Avatar type='xl' image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
