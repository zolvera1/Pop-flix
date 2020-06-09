import React from "react";
import "../css/lazy.css";
import LazyLoad from "react-lazyload";

function Post({ id, original_title, overview, poster_path }) {
    // function Post({ id, title, body }) {
    return (
        <div className="post">
            <LazyLoad
                className="img"
                once={true}
                placeholder={<img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt="..." />}
            >
                <div className="post-img">
                    <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt="..." />
                </div>
            </LazyLoad>
            <div className="post-body">
                <h4>{original_title}</h4>
                <p>{overview}</p>
            </div>
        </div>
    );
}

export default Post;