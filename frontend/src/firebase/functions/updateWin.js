import { db } from "../config"
import { doc, updateDoc } from "firebase/firestore"

export default async function updateWin(id, win){
  let result = null
  let error = null
  const userDoc = doc(db, "user", id)
  const newFields = {wins: win + 1}
  try {
    result = await updateDoc(userDoc, newFields)
  } catch (e) {
    error = e
  }
  return { result, error }
}