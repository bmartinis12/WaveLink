import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide }) {

  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [isPlaying, setIsPlaying] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [renderedAudio, setRenderedAudio] = useState(null)

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: '#ccc',
      progressColor: '#4a9eff',
      cursorColor: '#7ae3c3',
      barWidth: 2,
      height: 30,
      responsive: true
    });

    setWaveForm(waveSurfer);

    waveSurfer.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      waveSurfer.destroy();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener('timeupdate', updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener('timeupdate', updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.pause();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], 'recording.mp3');
        setRenderedAudio(audioFile);
      });
    }
  };

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setRecordedAudio(null);
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        setRecordedAudio(audio);
        waveForm.load(audioUrl);
      }

      mediaRecorder.start();
    }).catch((error) => {
      console.log("Error accessing microphone:", error);
    })
  };

  const handlePauseRecording = () => {
    waveForm.pause();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', renderedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        'Content-Type': 'multipart/form-data',
        params: {
          from: userInfo.id,
          to: currentChatUser.id
        }
      });
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message
        });
        dispatch({ type: reducerCase.ADD_MESSAGE, newMessage: { ...response.data.message }, fromSelf: true });
        hide();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formateTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }


  return (
    <div className="flex text-2xl w-full justify-center items-baseline">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-2 justify-center items-center bg-search-input-container-background rounded-lg drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-[100px] sm:w-[150px] text-[16px] sm:text-base md:text-lg md:w-[175px] text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? <FaPlay onClick={handlePlayRecording} /> : < FaStop onClick={handlePauseRecording} />}
              </>
            )}
          </div>
        )}
        <div className="sm:w-[55px] md:w-[175px]" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formateTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formateTime(totalDuration)}</span>
        )}
      </div>
      <audio ref={audioRef} hidden />
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone className="text-red-500" onClick={handleStartRecording} />
        ) : (
          <FaPauseCircle className="text-red-500" onClick={handleStopRecording} />
        )}
      </div>
      <div>
        <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="send" onClick={sendRecording} />
      </div>
    </div >
  );
}

export default CaptureAudio;
