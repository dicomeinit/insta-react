import React, {useState, useEffect} from "react";
import './Post.css';
import {Avatar, Button, Input, Modal} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faEdit} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

const BASE_URL = 'http://127.0.0.1:8001/'

function Post({post, authToken, authTokenType, username}) {

    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isEditing, setIsEditing] = useState(false);
    const [editCaption, setEditCaption] = useState(post.caption || '');


    useEffect(() => {
        if (post.image_url_type === 'absolute') {
            setImageUrl(post.image_url)
        } else {
            setImageUrl(BASE_URL + post.image_url)
        }
    }, [])

    useEffect(() => {
        setComments(post.comments)
    }, [])

    const handleDelete = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken
            })
        }

        fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
            .then(response => {
                if (response.ok) {
                    window.location.reload()
                }
                throw response
            })
            .catch(error => {
                console.log(error);
            })
    }

    const postComment = (event) => {
        event.preventDefault()

        const json_string = JSON.stringify({
          'username': username,
          'text': newComment,
          'post_id': post.id
        })

        const requestOptions = {
          method: 'POST',
          headers: new Headers({
            'Authorization': authTokenType + ' ' + authToken,
            'Content-Type': 'application/json'
          }),
          body: json_string
        }

        fetch(BASE_URL + 'comment', requestOptions)
          .then(response => {
            if (response.ok) {
              return response.json()
            }
          })
          .then(data => {
            fetchComments()
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            setNewComment('')
          })
      }

      const fetchComments = () => {
        fetch(BASE_URL + 'comment/all/' + post.id)
          .then(response => {
            if (response.ok) {
              return response.json()
            }
            throw response
          })
          .then(data => {
            setComments(data)
          })
          .catch(error => {
            console.log(error);
          })
      }

    useEffect(() => {
        setLiked(post.likes?.some(like => like.username === username) || false);
    }, [post.likes, username]);

    const handleLike = () => {
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken,
                'Content-Type': 'application/json'
            })
        };

        const url = BASE_URL + 'like/' + (liked ? 'unlike/' : 'like/') + '' + post.id;

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    setLiked(!liked);
                    setLikesCount(likesCount + (liked ? -1 : 1));
                }
            })
            .catch(error => {
                console.log(error);
            });
    };


    const handleEdit = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                caption: editCaption,
            }),
        };
        const url = `${BASE_URL}post/edit/${post.id}`;

        try {
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const updatedPost = await response.json();
                // Update the post state with the new caption
                post.caption = updatedPost.caption;
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                console.error('Failed to update the post:', errorData);
            }
        } catch (error) {
            console.error('Failed to update the post:', error);
        }
    };


    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    alt="Catalin"
                    src="https://secure.gravatar.com/avatar/7381b9e7e146bf03b5ef62ce417b53a2.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-192.png"/>
                {/*</div>*/}
                {/*<div className="post_headerInfo">*/}
                <h3 className="post_headerInfo">{post.user.username}</h3>
                <Button className="post_delete" onClick={handleDelete}>
                    Delete
                </Button>
                {username === post.user.username && (
                    <Button icon={<FontAwesomeIcon icon={faEdit} />} onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                )}
            </div>
            <img
                className='post_image'
                src={imageUrl}
            />

            <h4 className='post_text'>{post.caption}</h4>

            <div className='post_comments'>
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}:</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            <div className="post_like">
              <button onClick={handleLike} style={{ border: 'none', background: 'transparent' }}>
                {liked ? (
                  <FontAwesomeIcon icon={faHeartSolid} style={{ color: 'red' }} />
                ) : (
                  <FontAwesomeIcon icon={faHeartRegular} />
                )} ({likesCount})
              </button>
            </div>

            {authToken && (
                <form className="post_commentbox">
                    <input className="post_input"
                           type="text"
                           placeholder="Add a comment"
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className="post_button"
                        type="submit"
                        disabled={!newComment}
                        onClick={postComment}>
                        Post
                    </button>
                </form>
            )}

            <Modal title="Edit Post" visible={isEditing} onOk={handleEdit} onCancel={() => setIsEditing(false)}>
                <Input value={editCaption} onChange={e => setEditCaption(e.target.value)} />
            </Modal>
        </div>
)
}

export default Post;