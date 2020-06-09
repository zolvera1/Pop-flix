import React from "react";
import "../css/lazy.css";
import LazyLoad from "react-lazyload";

function Post({ id, title, body }) {
    return (
        <div className="post">
            <LazyLoad
                className="img"
                once={true}
                placeholder={<img src={`https://picsum.photos/id/${id}/5/5`} alt="..." />}
            >
                <div className="post-img">
                    <img src={`https://picsum.photos/id/${id}/1000/1000`} alt="..." />
                </div>
            </LazyLoad>
            <div className="post-body">
                <h4>{title}</h4>
                <p>{body}</p>
            </div>
        </div>
    );
}

export default Post;