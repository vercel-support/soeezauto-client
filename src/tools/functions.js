import { LOCALE, LANG } from '../parameters';

const trans = {
    br: {
        today: 'Hoje',
        yesterday: 'Ontem',
    },
    en: {
        today: 'Today',
        yesterday: 'Yesterday',
    },
};
export const showtime = (baseDateString) => {
    const baseDate = new Date(baseDateString);
    const today = new Date();
    const utc1 = Date.UTC(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
    );
    const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
    let hours = baseDate.getHours();
    hours = hours < 10 ? `0${hours}` : hours;
    let minutes = baseDate.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let dateOut = '';
    if (diffDays === 0) {
        dateOut = `${trans[LANG].today} ${hours}:${minutes}`;
    } else if (diffDays === 1) {
        dateOut = `${trans[LANG].yesterday} ${hours}:${minutes}`;
    } else if (diffDays > 1 && diffDays < 7) {
        dateOut = baseDate.toLocaleDateString(LOCALE, { weekday: 'long' });
        dateOut = `${dateOut} ${hours}:${minutes}`;
    } else {
        dateOut = baseDate.toLocaleDateString(LOCALE, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    return dateOut;
};

// A few JavaScript Functions for Images and Files
// Author: Justin Mitchel
// Source: https://kirr.co/ndywes
// https://github.com/codingforentrepreneurs/Try-Reactjs/blob/master/src/learn/ResuableUtils.js

// Convert a Base64-encoded string to a File object
export function base64StringtoFile(base64String, filename) {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// Download a Base64-encoded file

export function downloadBase64File(base64Data, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', base64Data);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Extract an Base64 Image's File Extension
export function extractImageFileExtensionFromBase64(base64Data) {
    return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));
}

// Base64 Image to Canvas with a Crop
// original function was adapted to draw a resized image to canvas
// in this case with an aspect ratio of 1:1, and width = maxWidth
export function image64toCanvasRef(canvasRef, image64, percentCrop, maxWidth) {
    const canvas = canvasRef; // document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxWidth;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = image64;
    image.onload = () => {
        ctx.drawImage(
            image,
            (percentCrop.x / 100) * image.naturalWidth,
            (percentCrop.y / 100) * image.naturalHeight,
            (percentCrop.width / 100) * image.naturalWidth,
            (percentCrop.height / 100) * image.naturalHeight,
            0,
            0,
            maxWidth,
            maxWidth,
        );
    };
    return image;
}

export function rangeGenerator(start, stop, step = 1) {
    return Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);
}

// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
export function copyToClipboard(str) {
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0) // Store selection if found
            : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }
}

export function Now() {
    let now = new Date();
    now = parseInt(now.getTime() / 1000, 10);
    return now;
}

export function DateDDMMYY(dateString) {
    // eslint-disable-next-line no-extend-native
    String.prototype.replaceAll = (search, replacement) => {
        const target = this;
        return target.split(search).join(replacement);
    };

    let date = dateString.replaceAll('-', ',');
    date = date.replaceAll(':', ',');
    date = date.replace('.000000', '');
    date = date.replace(' ', ',');

    date = date.split(',');
    const year = parseInt(date[0], 10);
    const month = parseInt(date[1], 10) - 1;
    const day = parseInt(date[2], 10);
    const hours = parseInt(date[3], 10);
    const minutes = parseInt(date[4], 10);
    const seconds = parseInt(date[5], 10);
    date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

    return new Intl.DateTimeFormat(LOCALE, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}

// https://jrsinclair.com/articles/2019/what-is-a-higher-order-function-and-why-should-anyone-care/
function compareNumbers(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
}

export function orderArrayOfObjects(element1, element2, prop) {
    return -1 * compareNumbers(element1[prop], element2[prop]);
}

export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// https://stackoverflow.com/questions/1499889/remove-html-tags-in-javascript-with-regex
export function stripHtmlToText(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    let res = tmp.textContent || tmp.innerText || '';
    res.replace('\u200B', ''); // zero width space
    res = res.trim();
    return res;
}

export function dateObjectToString(dateObject) {
    return dateObject
        .toLocaleString(LOCALE, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
}

export function dateFormat(dateString) {
    const dateFormatter = new Intl.DateTimeFormat(LOCALE);
    const date = new Date(dateString);
    return dateFormatter.format(date);
}

export function dateRange(interval) {
    const d = new Date();
    const range = {
        after: null,
        before: null,
    };
    switch (interval) {
        case 'today': {
            const tomorrow = d.setDate(d.getDate() + 1);
            range.after = dateObjectToString(new Date());
            range.before = dateObjectToString(new Date(tomorrow));
            return range;
        }
        case 'yesterday': {
            const yesterday = d.setDate(d.getDate() - 1);
            range.after = dateObjectToString(new Date(yesterday));
            range.before = dateObjectToString(new Date());
            return range;
        }
        case 'this week': {
            // inclusive of today
            // get monday
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            range.after = dateObjectToString(new Date(d.setDate(diff)));
            range.before = dateObjectToString(new Date());
            return range;
        }
        case 'last 7 days': {
            // inclusive of today
            const base = d.setDate(d.getDate() - 6);
            range.after = dateObjectToString(new Date(base));
            range.before = dateObjectToString(new Date());
            return range;
        }
        case 'this month': {
            // inclusive of today
            range.after = dateObjectToString(new Date(d.getFullYear(), d.getMonth(), 1));
            range.before = dateObjectToString(new Date());
            return range;
        }
        case 'last month': {
            range.after = dateObjectToString(
                new Date(d.getFullYear(), d.getMonth() - 1, 1),
            );
            const newD = new Date();
            newD.setDate(1); // going to 1st of the month
            newD.setHours(-1); // going to last hour before this date even started.
            range.before = dateObjectToString(new Date(newD));
            return range;
        }
        case 'last 3 months': {
            // exclusive of current month
            range.after = dateObjectToString(
                new Date(d.getFullYear(), d.getMonth() - 4, 1),
            );
            const newD = new Date();
            newD.setDate(1); // going to 1st of the month
            newD.setHours(-1); // going to last hour before this date even started.
            range.before = dateObjectToString(new Date(newD));
            return range;
        }
        case 'this year': {
            // inclusive of today
            range.after = dateObjectToString(new Date(new Date().getFullYear(), 0, 1));
            range.before = dateObjectToString(new Date());
            return range;
        }
        case 'last year': {
            range.after = dateObjectToString(
                new Date(new Date().getFullYear() - 1, 0, 1),
            );
            range.before = dateObjectToString(
                new Date(new Date().getFullYear() - 1, 11, 31),
            );
            return range;
        }
        default:
            return false;
    }
}

// https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
export function sortObject(object) {
    return Object.keys(object)
        .sort()
        .reduce((r, k) => Object.assign(r, { [k]: object[k] }), {});
}

/**
 * Function to sort multidimensional array
 * https://coderwall.com/p/5fu9xw/how-to-sort-multidimensional-array-using-javascript
 * <a href="/param">@param</a> {array} [arr] Source array
 * <a href="/param">@param</a> {array} [columns] List of columns to sort
 * <a href="/param">@param</a> {array} [order_by] List of directions (ASC, DESC)
 * @returns {array}
 */
export function multisort(arr, columns, orderBy) {
    if (typeof columns === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        columns = [];
        for (let x = 0; x < arr[0].length; x++) {
            columns.push(x);
        }
    }

    if (typeof orderBy === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        orderBy = [];
        for (let x = 0; x < arr[0].length; x++) {
            orderBy.push('ASC');
        }
    }

    function multisortRecursive(a, b, columns1, orderBy1, index) {
        const direction = orderBy1[index] === 'DESC' ? 1 : 0;

        let x = null;
        let y = null;
        const isNumeric = !isNaN(+a[columns1[index]] - +b[columns1[index]]);
        x = isNumeric ? +a[columns1[index]] : a[columns1[index]].toLowerCase();
        y = isNumeric ? +b[columns1[index]] : b[columns1[index]].toLowerCase();

        if (x < y) {
            return direction === 0 ? -1 : 1;
        }

        if (x === y) {
            return columns1.length - 1 > index
                ? multisortRecursive(a, b, columns1, orderBy1, index + 1)
                : 0;
        }

        return direction === 0 ? 1 : -1;
    }

    return arr.sort((a, b) => {
        return multisortRecursive(a, b, columns, orderBy, 0);
    });
}

// https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
export function sortArrayOfObjectsByKey(key, order = 'asc') {
    return function innerSort(a, b) {
        // eslint-disable-next-line no-prototype-builtins
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return order === 'desc' ? comparison * -1 : comparison;
    };
}

export function sortArrayOfObjectsByValue(array, property) {
    return array.sort((a, b) =>
        a[property].localeCompare(b[property], LOCALE, { sensitivity: 'base' }),
    );
}

export function urlWriter(string) {
    const a =
        'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b =
        'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');
    return (
        string
            .toString()
            .toLowerCase()
            .replace(/\se\s/g, ' ') // Removes liason e
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
            // .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w-]+/g, '') // Remove all non-word characters
            .replace(/--+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    );
}

// checks auth on server
// could be done on the client with withCookies
// but some pages need info to avoid unnecessary queries
export function handleCheckAuthentication(context) {
    const {
        // req: { headers, url },
        req: { headers },
        // res,
    } = context;
    const cookies = {};
    if (headers && headers.cookie) {
        headers.cookie.split(';').forEach((cookie) => {
            const parts = cookie.match(/(.*?)=(.*)$/);
            cookies[parts[1].trim()] = (parts[2] || '').trim();
        });
    }
    const isAuthenticated = !!cookies.username;
    const isAdmin = !!cookies.isAdmin;
    /* not using as causes re-render
    if (!isAuthenticated) {
        res.setHeader('Location', `/login?from=${url}`);
        res.statusCode = 307;
    }
    if (isAuthenticated && url.includes('admin') && !isAdmin) {
        res.setHeader('Location', '/');
        res.statusCode = 307;
    }
    */
    return { isAuthenticated, isAdmin };
}

export function handleIsNotAuthenticated(router) {
    router.push({
        pathname: '/login',
        query: {
            href: router.pathname,
            as: router.asPath,
        },
    });
}

export function capitalizeCity(string) {
    const splitStr = string.toLowerCase().split('-');
    for (let i = 0; i < splitStr.length; i++) {
        if (splitStr[i] !== 'da' || splitStr[i] !== 'de') {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
    }
    return splitStr.join(' ');
}

// https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
export function removeDuplicatesFromArrayOfObjects(array) {
    return array.filter(
        (v, i, a) => a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i,
    );
}

export function arrayIntersect(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    return Array.from(intersection);
}

export function objectToMap(o) {
    return new Map(Object.entries(o));
}

export function numberFrance(value) {
    return new Intl.NumberFormat('fr-FR').format(Math.floor(Math.round(value)));
}

export function randIndex(len, max) {
    const rand = [];
    while (rand.length < max) {
        const r = Math.floor(Math.random() * len) + 1;
        if (rand.indexOf(r) === -1) rand.push(r);
    }
    return rand;
}
