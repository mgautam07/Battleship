import { db } from "../config"
import { getDocs, query, where, collection } from "firebase/firestore"

// const db = getFirestore(firebase_app)
export default async function getUserData(uid) {
    let result = null
    let error = null
    let res = null
    const userCollectionRefs = collection(db, "user")
    try {
        const q = query(userCollectionRefs, where("uid", "==", uid));
        res = await getDocs(q)
        res.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            result = doc.data()
            result["id"] = doc.id
            console.log(result)
          })
    } catch (e) {
        error = e
    }

    return { result, error }
}