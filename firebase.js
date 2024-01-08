import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVXps4dqu3q4yUNLJLZT2lo6CMsPUvqOM",
    authDomain: "cozilpoll.firebaseapp.com",
    projectId: "cozilpoll",
    storageBucket: "cozilpoll.appspot.com",
    messagingSenderId: "190251371277",
    appId: "1:190251371277:web:48909657d5a6d95de27e44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function find(cpf) {
    const querySnapshot = await getDocs(collection(db, 'colaboradores'));
    let index = 0;


    return await new Promise((resolve, reject) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().cpf === cpf) {
                resolve({
                    id: doc.id,
                    data: doc.data()
                });
            }

            if(querySnapshot.size - 1 === index) {
                resolve(undefined);
            }
            index++;
        });
    });
}



export async function hasVoted(cpf) {
    const user = (await find(cpf)).data;

    if (!user) {
        return undefined;
    }
    return user.hasVoted;
}

export async function isCozil(cpf) {
    const user = await (await find(cpf)).data;

    if (!user) {
        return undefined;
    }
    return user.isCozil;
}

function vote(cpf, vote) {

}