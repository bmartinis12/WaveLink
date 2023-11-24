import Image from "next/image";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoLibrary from "./PhotoLibrary";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setcontextMenuCordinates] = useState({ x: 0, y: 0 });
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setcontextMenuCordinates({ x: e.pageX, y: e.pageY })
  };

  const contextMenuOptions = [
    {
      name: 'Choose From Library', callback: () => {
        setShowPhotoLibrary(true);
      }
    },
    {
      name: 'Remove Photo', callback: () => {
        setImage('/default_avatar.png');
      }
    }
  ]
  return (
    <>
      <div className="flex items-center justify-center">
        {type === 'sm' && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill sizes="100%" />
          </div>
        )}
        {type === 'lg' && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill sizes="100%" />
          </div>
        )}
        {type === 'xl' && (
          <div className="relative z-0" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div id="context-opener" className={`z-10 cursor-pointer bg-photopicker-overlay-background h-40 w-40 sm:h-60 sm:w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${hover ? 'visible' : 'hidden'}`} onClick={(e) => showContextMenu(e)}>
              <FaCamera className="text-2xl" id="context-opener" onClick={(e) => showContextMenu(e)} />
              <span className="text-sm" id="context-opener" onClick={(e) => showContextMenu(e)}>Change Profile Photo</span>
            </div>
            <div className="h-40 w-40 sm:h-60 sm:w-60 flex items-center justify-center">
              <Image src={image} alt="avatar" className="rounded-full" fill sizes="100%" />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && <ContextMenu options={contextMenuOptions} cordinates={contextMenuCordinates} contextMenu={isContextMenuVisible} setContextMenu={setIsContextMenuVisible} />}
      {showPhotoLibrary && <PhotoLibrary setPhoto={setImage} hidePhotoLibrary={setShowPhotoLibrary} />}
    </>
  );
}

export default Avatar;
