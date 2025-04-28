import React, { useEffect, useState } from 'react'
import './Posts.css';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getTimelinePosts } from '../../actions/PostAction';
import { useParams } from 'react-router-dom';

const Posts = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'emergency', or 'normal'
  
  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lati: position.coords.latitude,
            longi: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationError(true);
    }
  }, []);
  
  // Fetch posts
  useEffect(() => {
    dispatch(getTimelinePosts(user._id));
  }, [dispatch, user._id]);
  
  // Filter posts by distance when posts or user location updates
  useEffect(() => {
    if (!loading && posts.length > 0 && userLocation) {
      const filtered = posts.filter(post => {
        // If post doesn't have location data, include it by default
        if (!post.lati || !post.longi) return true;
        
        const distance = calculateDistance(
          userLocation.lati, 
          userLocation.longi, 
          post.lati, 
          post.longi
        );
        
        // Include posts that are within 4km
        return distance <= 4;
      });
      
      setNearbyPosts(filtered);
    }
  }, [posts, userLocation, loading]);
  
  // Handle filter and profile page cases
  let displayPosts = [];
  
  if (params.id) {
    // On profile page, show all user posts regardless of filter
    displayPosts = posts.filter((post) => post.userId === params.id);
  } else if (userLocation) {
    // Apply emergency filter to nearby posts if selected
    if (filter === 'emergency') {
      displayPosts = nearbyPosts.filter(post => post.emergency === true);
    } else if (filter === 'normal') {
      displayPosts = nearbyPosts.filter(post => post.emergency !== true);
    } else {
      displayPosts = nearbyPosts; // 'all' filter
    }
  } else {
    // No location, apply filter to all posts
    if (filter === 'emergency') {
      displayPosts = posts.filter(post => post.emergency === true);
    } else if (filter === 'normal') {
      displayPosts = posts.filter(post => post.emergency !== true);
    } else {
      displayPosts = posts; // 'all' filter
    }
  }
  
  return (
    <div className='Posts-container'>
      {!params.id && (
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button 
            className={`filter-button emergency ${filter === 'emergency' ? 'active' : ''}`} 
            onClick={() => setFilter('emergency')}
          >
            Emergency Posts
          </button>
          <button 
            className={`filter-button normal ${filter === 'normal' ? 'active' : ''}`} 
            onClick={() => setFilter('normal')}
          >
            Normal Posts
          </button>
        </div>
      )}
      
      <div className='Posts'>
        {loading ? "Fetching Posts..." : locationError ? "Location access needed to show nearby posts." : (
          <>
            {displayPosts.length === 0 ? (
              <div className="no-posts-message">
                {filter === 'emergency' ? "No emergency posts" : filter === 'normal' ? "No normal posts" : "No posts"} 
                {!params.id ? " within 4km of your location" : ""}
              </div>
            ) : (
              displayPosts.map((post, id) => {
                return <Post data={post} id={id} key={id} />;
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;