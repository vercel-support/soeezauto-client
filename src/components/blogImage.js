import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    catList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        gap: 10,
        '& > div': {
            flex: '0 0 400px',
            backgroundColor: '#ffe082',
        },
    },
    links: {
        '& div': {
            width: 'clamp(300px,70%, 50%)',
            margin: '30px auto',
        },
        '& a': {
            fontWeight: 700,
        },
    },
}));

const BlogImage = ({ post }) => {
    const classes = useStyles();
    const [content, setContent] = useState([]);
    const [links, setLinks] = useState([]);
    useEffect(() => {
        if (post) {
            const temp = document.createElement('div');
            temp.innerHTML = post.content;
            const images = [];
            temp.childNodes.forEach((child) => {
                if (child.id && child.id.includes('metaslider')) {
                    const imgs = child.getElementsByTagName('img');
                    if (imgs.length > 0) {
                        Array.from(imgs).forEach((img) => {
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
            // get links
            const main = document.createElement('main');
            main.innerHTML = post.content;
            const sections = [];
            for (const el of main.children) {
                if (el.nodeName === 'A') {
                    sections.push(
                        <a
                            href={el
                                .getAttribute('href')
                                .replace('https://www.soeezauto.ma', '')}
                            alt={el.alt}
                        >
                            {el.innerText}
                        </a>,
                    );
                }
            }
            setLinks([...sections]);
        }
    }, [post]);
    return (
        <>
            <div className={classes.catList}>
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
            <div className={classes.links}>
                {links.length > 0 &&
                    links.map((div, ind) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={ind}>{div}</div>
                    ))}
            </div>
        </>
    );
};

BlogImage.propTypes = {
    post: PropTypes.object.isRequired,
};

export default BlogImage;
