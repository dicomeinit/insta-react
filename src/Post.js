import React, {useState, useEffect} from "react";
import './Post.css';
import {Avatar, Button} from 'antd';

const BASE_URL = 'http://127.0.0.1:8001/'

function Post({post}) {

    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState([])


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


    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    alt="Catalin"
                    src="https://secure.gravatar.com/avatar/7381b9e7e146bf03b5ef62ce417b53a2.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-192.png"/>
            {/*</div>*/}
            {/*<div className="post_headerInfo">*/}
                <h3 className="post_headerInfo">{post.user.username}</h3>
                <Button className="post_delete">Delete</Button>
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
        </div>
    )
}

export default Post;