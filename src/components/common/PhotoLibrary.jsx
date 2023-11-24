import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

function PhotoLibrary({ setPhoto, hidePhotoLibrary }) {
  const images = [
    '/avatars/1.png',
    '/avatars/2.png',
    '/avatars/3.png',
    '/avatars/4.png',
    '/avatars/5.png',
    '/avatars/6.png',
    '/avatars/7.png',
    '/avatars/8.png',
    '/avatars/9.png'
  ]
  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex justify-center items-center">
      <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
        <div className='cursor-pointer flex items-end justify-end' onClick={() => hidePhotoLibrary(false)}>
          <IoClose className='h-10 w-10' />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 justify-center items-center gap-16 p-10 sm:p-20 w-full max-h-[75vh] sm:max-h-none overflow-y-scroll custom-scrollbar sm:overflow-auto min-w-[50vw] sm:min-w-fit">
          {images.map((img, i) => (
            <div className='flex items-center justify-center' key={`avatar-${i}`} onClick={() => {
              setPhoto(images[i]);
              hidePhotoLibrary(false)
            }}>
              <div className='h-24 w-24 cursor-pointer relative hover:border-4 hover:border-[#00aeef] rounded-full'>
                <Image src={img} alt='avatar' fill sizes='100%' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
