import React, { useState, useRef } from 'react'
import './PostShare.css';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmergencyShareIcon from '@mui/icons-material/Report';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/UploadAction';

const PostShare = () => {
    const loading = useSelector((state) => state.postReducer.uploading)
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [emergency, setEmergency] = useState(false);
    const imageRef = useRef();
    const dispatch = useDispatch();
    const desc = useRef();
    const { user } = useSelector((state) => state.authReducer.authData);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(img);
        }
    }

    const getLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lati: position.coords.latitude,
                        longi: position.coords.longitude
                    });
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationLoading(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLocationLoading(false);
        }
    }

    const toggleEmergency = () => {
        setEmergency(!emergency);
    }

    const reset = () => {
        setImage(null);
        setLocation(null);
        setEmergency(false);
        desc.current.value = "";
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
            emergency: emergency
        }
        
        // Add location data if available
        if (location) {
            newPost.lati = location.lati;
            newPost.longi = location.longi;
        }

        if (image) {
            const data = new FormData();
            const filename = Date.now() + image.name;
            data.append("name", filename);
            data.append("file", image);
            newPost.image = filename;
            try {
                dispatch(uploadImage(data))
            } catch (error) {
                console.log(error)
            }
        }
        console.log("post data over here", newPost);
        dispatch(uploadPost(newPost))
        reset()
    }

    return (
        <div className="PostShare">
            <img src={user.profilePicture ? serverPublic + user.profilePicture : serverPublic + "defaultProfile.png"} alt="" />
            <div>
                <input type="text" placeholder='Write a caption...' required ref={desc} />
                <div className="postOptions">
                    <div className="option" style={{ color: "var(--photo)" }}
                        onClick={() => imageRef.current.click()}
                    >
                        <PhotoOutlinedIcon />
                        Photo
                    </div>
                    <div className="option" style={{ color: "var(--video)" }}>
                        <PlayCircleOutlineIcon />
                        Video
                    </div>
                    <div 
                        className="option" 
                        style={{ color: "var(--location)" }}
                        onClick={getLocation}
                    >
                        <LocationOnOutlinedIcon />
                        {locationLoading ? "Loading..." : location ? "Location Added" : "Location"}
                    </div>
                    <div 
                        className="option" 
                        style={{ color: emergency ? "red" : "var(--emergency)", fontWeight: emergency ? "bold" : "normal" }}
                        onClick={toggleEmergency}
                    >
                        <EmergencyShareIcon />
                        {emergency ? "Emergency On" : "Emergency"}
                    </div>
                    <button className='button ps-button' onClick={handleSubmit} disabled={loading}>
                        {loading ? "uploading..." : "Share"}
                    </button>
                    <div style={{ display: "none" }}>
                        <input
                            type="file"
                            name='myImage'
                            ref={imageRef}
                            onChange={onImageChange}
                        />
                    </div>
                </div>
                {image && (
                    <div className="previewImage">
                        <CloseOutlinedIcon onClick={() => setImage(null)} />
                        <img src={URL.createObjectURL(image)} alt="" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostShare