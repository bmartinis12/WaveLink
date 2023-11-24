import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {

  const [{ userInfo, currentChatUser }] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveFormRef = useRef(null);
  const waveForm = useRef(null);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.pause();
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    waveForm.current.pause();
    audioMessage.pause();
    setIsPlaying(false);
  };

  const formateTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: '#ccc',
        progressColor: '#4a9eff',
        cursorColor: '#7ae3c3',
        barWidth: 2,
        height: 30,
        responsive: true
      });

      waveForm.current.on('finish', () => {
        setIsPlaying(false);
      });

    }

    return () => {
      waveForm.current.destroy();
    }
  }, []);

  useEffect(() => {
    const audioUrl = `${HOST}/${message.message}`;
    const audio = new Audio(audioUrl);
    setAudioMessage(audio);
    waveForm.current.load(audioUrl);
    waveForm.current.on('ready', () => {
      setTotalDuration(waveForm.current.getDuration());
    });
  }, [message.message])


  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener('timeupdate', updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener('timeupdate', updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  return (
    <div className={`flex items-center gap-5 text-white px-2 sm:px-4 py-4 text-sm rounded-md ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
      <div>
        <Avatar type='sm' image={currentChatUser?.profilePicture} />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />}
      </div>
      <div className="sm:relative">
        <div className="hidden sm:inline-block sm:w-[150px]" ref={waveFormRef} />
        <div className="text-bubble-meta text-[10px] pt-1 flex flex-col sm:flex-row justify-between sm:absolute sm:bottom-[-22px] w-full">
          <span>
            {formateTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
