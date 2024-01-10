import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVXps4dqu3q4yUNLJLZT2lo6CMsPUvqOM",
    authDomain: "cozilpoll.firebaseapp.com",
    projectId: "cozilpoll",
    storageBucket: "cozilpoll.appspot.com",
    messagingSenderId: "190251371277",
    appId: "1:190251371277:web:48909657d5a6d95de27e44",
    measurementId: "G-48VZK20X8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function find(cpf) {
    const querySnapshot = await getDocs(collection(db, 'colaboradores'));
    let index = 0;

    return await new Promise((resolve) => {
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

export async function getCandidates(type) {
    const querySnapshot = await getDocs(collection(db, 'candidato'));
    let index = 0;

    return await new Promise((resolve) => {
        querySnapshot.forEach((doc) => {
            if(doc.id === type) {
                resolve(doc.data());
            }

            if(querySnapshot.size - 1 === index) {
                resolve(undefined);
            }
            index++;
        })
    })
}

export async function updateUserVote(id) {
    await updateDoc(doc(db, "colaboradores", id), {
        hasVoted: true
    });
}

export async function updateCandidateVote(id, key, previousValue) {
    console.log(id);
    console.log(key);
    console.log(previousValue);
    
    await updateDoc(doc(db, "candidato", id), {
        [key]: previousValue + 1
    })
}

export async function hasVoted(user) {
    return user.data.hasVoted;
}

export async function isCozil(user) {
    return user.data.isCozil;
}