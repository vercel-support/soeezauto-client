import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import PropTypes from 'prop-types';

const BlogVideo = ({ post }) => {
    const [content, setContent] = useState([]);
    useEffect(() => {
        if (post) {
            const temp = document.createElement('div');
            temp.innerHTML = post.content;
            console.log('TEMPo', temp);
            const url = 'https://youtu.be/qbEUrlB1Ccg';

            setContent(url);
        }
    }, [post]);
    return (
        <div>
            <div>
                <div>
                    <div>{post.title}</div>
                    {content && <ReactPlayer url={content} />}
                </div>
            </div>
        </div>
    );
};

BlogVideo.propTypes = {
    post: PropTypes.object.isRequired,
};

export default BlogVideo;
