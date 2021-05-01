import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

const BlogImage = ({ post }) => {
    const [content, setContent] = useState([]);
    useEffect(() => {
        if (post) {
            const temp = document.createElement('div');
            temp.innerHTML = post.content;
            console.log('TEMPo', temp);
            const images = [];
            temp.childNodes.forEach((child) => {
                if (child.id && child.id.includes('metaslider')) {
                    console.log('CHILD', child.id);
                    const imgs = child.getElementsByTagName('img');
                    console.log('IMGS', imgs);
                    if (imgs.length > 0) {
                        Array.from(imgs).forEach((img) => {
                            console.log('img', img);
                            images.push({
                                src: img.getAttribute('src'),
                                alt: img.getAttribute('alt'),
                                width: img.getAttribute('width'),
                                height: img.getAttribute('height'),
                            });
                        });
                    }
                }
            });
            setContent(images);
        }
    }, [post]);
    return (
        <div>
            <div>
                <div>
                    <div>{post.title}</div>
                    {content.length > 0 &&
                        content.map((img) => (
                            <Image
                                key={img.src}
                                src={img.src}
                                alt={img.alt}
                                width={img.width}
                                height={img.height}
                                loading="eager"
                                priority
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

BlogImage.propTypes = {
    post: PropTypes.object.isRequired,
};

export default BlogImage;
