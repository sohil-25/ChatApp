import { auth } from "./firebaseConfig";
import {signInWithEmailAndPassword} from 'firebase/auth'

export const LoginUser = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth,email, password);
    } catch (error) {
        return error;
    }
}