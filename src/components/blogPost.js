import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactHtmlParser from 'react-html-parser';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from 'components/link';

const useStyles = makeStyles(() => ({
    catList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 280px',
        },
    },
}));

const BlogPost = ({ post }) => {
    const classes = useStyles();
    const [content, setContent] = useState(null);
    /*
    function removeScripts(string) {
        if (string.indexOf('<script') === -1) {
            return string;
        }
        const regexp = /<script/g;
        const matches = [...string.matchAll(regexp)];
        let newString = string;
        for (let i = 0; i < matches.length; i++) {
            const script = newString.substring(
                newString.indexOf('<script'),
                newString.indexOf('</script>') + '</script>'.length,
            );
            newString = newString.replace(script, '');
        }
        return newString;
    }
    */
    function replaceAtag(string) {
        // separate all <a tags
        // https://stackoverflow.com/questions/11592033/regex-match-text-between-tags
        const result = string.match(/<a [^>]+>(.*?)<\/a>/g).map((val) => {
            return val;
        });
        const elem = [];
        let str2 = string;
        for (let i = 0; i < result.length; i++) {
            // const getMatches = (str) => str.split(result[i]);
            // matches is an array of length 2
            const matches = str2.split(result[i]);
            elem.push(matches[0]);
            elem.push(result[i]);
            if (!matches[1].includes('<a')) {
                elem.push(matches[1]);
            }
            // remove used strings
            str2 = str2.replace(matches[0], '');
            str2 = str2.replace(result[i], '');
        }
        const newElem = [];
        elem.forEach((el, index) => {
            if (el.startsWith('<a')) {
                const temp = document.createElement('div');
                temp.innerHTML = el;
                const aTag = temp.firstChild;
                // if its <a> link to own domain, replace with Nextjs Link
                if (aTag.getAttribute('href').includes('soeezauto.ma')) {
                    newElem[index] = (
                        <Link
                            href={aTag
                                .getAttribute('href')
                                .replace('https://www.soeezauto.ma', '')}
                        >
                            {aTag.innerHTML}
                        </Link>
                    );
                }
            } else {
                newElem[index] = ReactHtmlParser(el);
            }
        });
        return (
            // TODO improve this
            <p>
                {newElem.map((el, ind) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span key={ind}>{el}</span>
                ))}
            </p>
        );
    }
    function setImages(imgs) {
        const images = [];
        const imgSection = [];
        Array.from(imgs).forEach((img) => {
            console.log('img', img);
            images.push({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt'),
                width: img.getAttribute('width'),
                height: img.getAttribute('height'),
            });
        });
        imgSection.push(
            <div>
                {images.map((img) => (
                    <Image
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                    />
                ))}
            </div>,
        );
        return imgSection;
    }
    useEffect(() => {
        if (post) {
            const main = document.createElement('main');
            main.innerHTML = post.content;
            console.log('MAe', main);
            const sections = [];
            for (const el of main.children) {
                if (el.className !== 'news_img1') {
                    if (el.nodeName === 'DIV' && el.className.includes('slider')) {
                        const imgs = el.getElementsByTagName('img');
                        if (imgs.length > 0) {
                            const imgSect = setImages(imgs);
                            sections.push(imgSect);
                        }
                    } else if (el.innerHTML.includes('<img')) {
                        const temp = document.createElement('div');
                        temp.innerHTML = el.innerHTML;
                        const imgs = temp.getElementsByTagName('img');
                        if (imgs.length > 0) {
                            const imgSect = setImages(imgs);
                            sections.push(imgSect);
                        }
                    } else if (el.innerHTML.includes('<a')) {
                        sections.push(replaceAtag(el.innerHTML));
                    } else if (!el.innerHTML.includes('adsbygoogle')) {
                        const Tag = el.nodeName.toLowerCase();
                        sections.push(<Tag>{ReactHtmlParser(el.innerHTML)}</Tag>);
                    }
                }
            }
            setContent([...sections]);
        }
    }, [post]);
    /*
    useEffect(() => {
        if (post) {
            let temp = post.content;
            const regexp = /<p>|<h2>/g;
            const matches = [...temp.matchAll(regexp)];
            const sections = [];
            // get all p and h2
            matches.forEach((match) => {
                console.log('matchs', match);
                const start = match[0] === '<p>' ? 'p' : 'h2';
                const section = temp.substring(
                    temp.indexOf(`<${start}>`),
                    temp.indexOf(`</${start}>`) + `</${start}>`.length,
                );
                sections.push(section);
                temp = temp.replace(section, '');
            });

            const newSections = [];
            sections.forEach((elem) => {
                let newElem = elem;
                if (elem.startsWith('<h2>')) {
                    // if h2, drop <h2> tags from string then create react element
                    let h2 = newElem.replace('<h2>', '');
                    h2 = h2.replace('</h2>', '');
                    newElem = <h2>{ReactHtmlParser(h2)}</h2>;
                } else if (elem.startsWith('<p><img') && elem.includes('wp-content')) {
                    // if image from own wp, replace with Nextjs <Image
                    let elemStr = elem.replace('</p>', '');
                    elemStr = elemStr.replace('<p>', '');
                    const temp1 = document.createElement('div');
                    temp1.innerHTML = elemStr;
                    const img = temp1.firstChild;
                    newElem = (
                        <Image
                            src={img.getAttribute('src')}
                            alt={img.getAttribute('alt')}
                            width={img.getAttribute('width')}
                            height={img.getAttribute('height')}
                            loading="eager"
                            priority
                        />
                    );
                } else {
                    // should be <p>, so remove from string and replace with react element
                    newElem = newElem.replace('</p>', '');
                    newElem = newElem.replace('<p>', '');
                    if (newElem.includes('<a')) {
                        newElem = replaceAtag(newElem);
                    } else {
                        newElem = <p>{ReactHtmlParser(newElem)}</p>;
                    }
                }
                console.log('NEW ELEMe', newElem);
                newSections.push(newElem);
            });
            setContent([...newSections]);
        }
    }, [post]);
    */
    return (
        <div>
            <div className={classes.catList}>
                <div>
                    <div>{post.title}</div>
                    {content &&
                        content.map((div, ind) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={ind}>{div}</div>
                        ))}
                </div>
            </div>
        </div>
    );
};

BlogPost.propTypes = {
    post: PropTypes.object.isRequired,
};

export default BlogPost;
