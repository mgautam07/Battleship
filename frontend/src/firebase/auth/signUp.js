import { createUserWithEmailAndPassword } from "firebase/auth"
import addData from "../functions/addData"
import { auth } from "../config"

export default async function signUp(email, password, username) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password)
        const d = new Date()
        result = await addData({
            uid: result.user.uid,
            username: username,
            wins: 0,
            loses: 0,
            joined: d,
            lastonline: d,
            email: email
        })
        // console.log(result)
    } catch (e) {
        error = e;
    }

    return { result, error }
}