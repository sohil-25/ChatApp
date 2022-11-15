import { auth } from "./firebaseConfig";
import {createUserWithEmailAndPassword} from 'firebase/auth'

export const SignUpUser = async (email, password) => {
    try {
        console.log('SignUpUser');
        return await createUserWithEmailAndPassword(auth,email, password);
    } catch (error) {
        console.log('sign up error',error);
        return error;
    }
}