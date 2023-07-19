import { db } from "../config"
import { getDocs, query, orderBy, collection, limit } from "firebase/firestore"

const timeAgo = (date) => {
const seconds = Math.floor((new Date() - date) / 1000);

let interval = Math.floor(seconds / 31536000);
if (interval > 1) {
    return interval + ' months ago';
}

interval = Math.floor(seconds / 2592000);
if (interval > 1) {
    return interval + ' days ago';
}

interval = Math.floor(seconds / 86400);
if (interval > 1) {
    return interval + ' hours ago';
}

interval = Math.floor(seconds / 3600);
if (interval > 1) {
    return interval + ' minutes ago';
}

// interval = Math.floor(seconds / 60);
// if (interval > 1) {
//     return interval + ' minutes ago';
// }

if(seconds < 10) return 'just now';

return Math.floor(seconds) + ' seconds ago';
}

export default async function getLeadeboard(uid) {
    let result = []
    let error = null
    let res = null
    const userCollectionRefs = collection(db, "user")
    try {
        const q = query(userCollectionRefs, orderBy("wins", "desc"));
        res = await getDocs(q)
        res.forEach((doc) => {
            const temp = doc.data()
            temp['timediff'] = timeAgo(new Date(Date.now()-temp.lastonline.seconds))
            temp['winrate']= (temp.wins / (temp.wins+temp.loses) * 100).toFixed(2).toString() + '%'
            if(temp.wins === 0 && temp.loses === 0) temp.winrate = 0
            // console.log(temp)
            result.push(temp)
        })
    } catch (e) {
        error = e
    }

    return { result, error }
}