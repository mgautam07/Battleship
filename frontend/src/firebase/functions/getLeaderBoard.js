import { db } from "../config"
import { getDocs, query, orderBy, collection, limit } from "firebase/firestore"

export default async function getLeadeboard(uid) {
    let result = []
    let error = null
    let res = null
    const userCollectionRefs = collection(db, "user")
    try {
        const q = query(userCollectionRefs, orderBy("wins", "desc"));
        res = await getDocs(q)
        res.forEach((doc) => {
            result.push(doc.data())
          })
    } catch (e) {
        error = e
    }

    return { result, error }
}