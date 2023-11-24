import { createPortal, ReactDOM } from "react-dom";

const PhotoPicker = ({ onChange }) => {
    const component = (
        <input type="file" hidden id="photo-picker" onChange={onChange} />
    );

    return (
        <>
            {createPortal(
                component,
                document.body
            )}
        </>
    )
}

export default PhotoPicker