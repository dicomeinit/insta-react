import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular, faUser, faUserFriends, faCamera } from '@fortawesome/free-solid-svg-icons';
import './UserProfile.css';
import './Post.css'

const BASE_URL = 'http://127.0.0.1:8001/';

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch user's data
    fetch(`${BASE_URL}user/${username}`)
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);

    fetch(`${BASE_URL}user/${username}/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);

  }, [username]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <ul className="profile-info">
            <li><h2>{username}'s Profile</h2></li>
            <li><h3><FontAwesomeIcon icon={faUserFriends} /> Followers ({user.followers ? user.followers.length : 0}):</h3>
        {user.followers && user.followers.map((follower) => (
          <div key={follower.username}>
            <p><FontAwesomeIcon icon={faUser} /> {follower.username}</p>
          </div>
        ))}</li>
            <li><h3><FontAwesomeIcon icon={faUserFriends} /> Following ({user.following ? user.following.length : 0}):</h3>
        {user.following && user.following.map((followed) => (
          <div key={followed.username}>
            <p><FontAwesomeIcon icon={faUser} /> {followed.username}</p>
          </div>
        ))}</li>
        </ul>

      <div className="posts-grid">
        <h3><FontAwesomeIcon icon={faCamera} /> Posts:</h3>
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post_header">
              <Avatar alt={post.user.username} src={post.user.avatar} />
              <h3 className="post_headerInfo">{post.user.username}</h3>
            </div>
            <img className="post_image" src={post.image_url} alt={post.caption} />
            <h4 className="post_text">{post.caption}</h4>
            <div className="post_like">
              <button style={{ border: 'none', background: 'transparent' }}>
                <FontAwesomeIcon icon={faHeartRegular} /> {/* Assuming likes are not implemented here */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
