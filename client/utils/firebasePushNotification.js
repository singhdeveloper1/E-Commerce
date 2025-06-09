import admin from "firebase-admin"
// import serviceAccount from "../firebase-adminsdk.json" assert { type: 'json' };
import {readFile} from "fs/promises"
const serviceAccount = JSON.parse(await readFile(new URL("../firebase-adminsdk.json", import.meta.url)))


admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
})

export default admin