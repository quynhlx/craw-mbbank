import * as crypto from 'crypto';
import * as moment from 'moment';
 
export const  generateRandomCharacter = (t) => {
    const n = "abcdefghijklmnopqrstuvwxyz0123456789";
    const length = n.length;
    let res = '';
    for (let i = 0; i < t; i++) {
        res += n.charAt(Math.floor(Math.random() * length));
    }
    return res;
}

export const  generateDeviceId = () => {
    return generateRandomCharacter(8) + "-0000-0000-0000-" + makeRefNo();
}

export const makeRefNo = (t = '') => {
    const formatTime = moment().format('YYYYMMDDHHmmssSS');
    if (t === '') return formatTime;
    return t + '-' + formatTime;
}

export const  md5 = (text) => {
    return crypto.createHash('md5').update(text).digest('hex');
}