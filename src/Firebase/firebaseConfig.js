import { initializeApp, } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAQZnRj64Ar0DaDq2a0mJ9JoL3XloI04hs",
    databaseURL: "https://chatapp-de6ff-default-rtdb.firebaseio.com/",
    projectId: "chatapp-de6ff",
    appId: "1:260333510423:android:c3f13e51c0c8d79984a152",
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app)
export {auth};
export default app;
