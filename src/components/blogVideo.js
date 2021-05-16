import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    wrapper: {
        position: 'relative',
        paddingTop: '56.25%' /* Player ratio: 100 / (16 / 9) */,
    },
    player: {
        position: 'absolute',
        top: 0,
        left: 0,
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

const BlogVideo = ({ post }) => {
    const classes = useStyles();
    const [url, setUrl] = useState(null);
    const [links, setLinks] = useState([]);
    useEffect(() => {
        if (post) {
            const temp = document.createElement('div');
            temp.innerHTML = post.content;
            const videoUrl = 'https://youtu.be/qbEUrlB1Ccg';

            setUrl(videoUrl);

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
            <div className={classes.wrapper}>
                {url && (
                    <ReactPlayer
                        url={url}
                        className={classes.player}
                        width="100%"
                        height="100%"
                    />
                )}
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

BlogVideo.propTypes = {
    post: PropTypes.object.isRequired,
};

export default BlogVideo;
