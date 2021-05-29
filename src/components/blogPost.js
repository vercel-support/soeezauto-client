import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import Link from 'components/link';
import { urlWriterWithSlash } from 'tools/functions';

const BlogPost = ({ post }) => {
    const [content, setContent] = useState(null);

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
                            href={urlWriterWithSlash(
                                aTag
                                    .getAttribute('href')
                                    .replace('https://www.soeezauto.ma', ''),
                            )}
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
                {newElem.map((el) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span key={Math.random()}>{el}</span>
                ))}
            </p>
        );
    }
    function setImages(imgs) {
        const images = [];
        const imgSection = [];
        Array.from(imgs).forEach((img) => {
            images.push({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt'),
                width: img.getAttribute('width'),
                height: img.getAttribute('height'),
                id: Math.random(),
            });
        });
        imgSection.push(
            <div key={Math.random()}>
                {images.map((img) => (
                    <Image
                        key={img.id}
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
                    } else if (el.nodeName === 'A') {
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
                    } else if (!el.innerHTML.includes('adsbygoogle')) {
                        const Tag = el.nodeName.toLowerCase();
                        sections.push(<Tag>{ReactHtmlParser(el.innerHTML)}</Tag>);
                    }
                }
            }
            setContent([...sections]);
        }
    }, [post]);
    return (
        <>
            {content &&
                content.map((div) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={Math.random()}>{div}</div>
                ))}
        </>
    );
};

BlogPost.propTypes = {
    post: PropTypes.object.isRequired,
};

export default BlogPost;
