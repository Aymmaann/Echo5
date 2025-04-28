import React, { useState } from 'react';
import './Post.css';
import Comment from '../../Img/comment.png';
import Share from '../../Img/share.png';
import Like from '../../Img/like.png';
import Location from '../../Img/location.png';
// import Emergency from '../../Img/emergency.png'; 
import Notlike from '../../Img/notlike.png';
import { useSelector } from 'react-redux';
import { likePost } from '../../api/PostRequest';

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData)
  const [liked, setLiked] = useState(data.likes.includes(user._id))
  const [likes, setLikes] = useState(data.likes.length)
  
  const handleLike = () => {
    setLiked((prev) => !prev)
    likePost(data._id, user._id)
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)
  }
  
  return (
    <div className={`Post ${data.emergency ? 'emergency-post' : ''}`}>
      {data.emergency && (
        <div className="emergency-banner">
          <span className="emergency-text">EMERGENCY</span>
        </div>
      )}
      
      <img src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : " "} alt="" />
      
      <div className="postReactContainer">
        <div className="postReact">
          <img src={liked ? Like : Notlike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
          <img src={Comment} alt="" />
          <img src={Share} alt="" />
        </div>
        <div className="postReact">
          {/* {data.emergency && (
            <img 
              width={30} 
              src={Emergency} 
              alt="Emergency"
              style={{ marginRight: '5px' }}
            />
          )} */}
          <img width={30} src={Location} alt="" />
          <h3 className='location'>{data.location}</h3>
        </div>
      </div>
      
      <span style={{ color: "var(--gray)", fontSize: '14px' }}>{likes} likes</span>
      
      <div className="detail">
        <span> <b>{data.name}</b> </span>
        <span>{data.desc}</span>
      </div>
    </div>
  )
}

export default Post