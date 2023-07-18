import { db } from "../config"
import { addDoc, collection } from "firebase/firestore"

// const db = getFirestore(firebase_app)
export default async function addData(data) {
    let result = null
    let error = null
    const userCollectionRefs = collection(db, "user")
    try {
        result = await addDoc(userCollectionRefs, data);
    } catch (e) {
        error = e
    }

    return { result, error }
}