import { hasVoted, find, updateUserVote, getCandidates, updateCandidateVote } from "./firebase.js";

let currentPosition = 0;
let selectedCandidate;
let candidatesList = {};

window.onload = function() { 
    setupButtons();
};

// SHOUTOUT TO: trincot (from stackoverflow)
document.addEventListener('DOMContentLoaded', () => {
    for (const el of document.querySelectorAll("[placeholder][data-slots]")) {
        const pattern = el.getAttribute("placeholder"),
            slots = new Set(el.dataset.slots || "_"),
            prev = (j => Array.from(pattern, (c,i) => slots.has(c)? j=i+1: j))(0),
            first = [...pattern].findIndex(c => slots.has(c)),
            accept = new RegExp(el.dataset.accept || "\\d", "g"),
            clean = input => {
                input = input.match(accept) || [];
                return Array.from(pattern, c =>
                    input[0] === c || slots.has(c) ? input.shift() || c : c
                );
            },
            format = () => {
                const [i, j] = [el.selectionStart, el.selectionEnd].map(i => {
                    i = clean(el.value.slice(0, i)).findIndex(c => slots.has(c));
                    return i<0? prev[prev.length-1]: back? prev[i-1] || first: i;
                });
                el.value = clean(el.value).join``;
                el.setSelectionRange(i, j);
                back = false;
            };
        let back = false;
        el.addEventListener("keydown", (e) => back = e.key === "Backspace");
        el.addEventListener("input", format);
        el.addEventListener("focus", format);
        el.addEventListener("blur", () => el.value === pattern && (el.value=""));
    }
});

function setupButtons() {
    const buttons = document.getElementsByClassName("button");

    for(let i=0; i<buttons.length; i++) {
        buttons[i].addEventListener('click', moveCarousel);
    }
}

async function loadCandidates() {
    const wrapper = document.getElementById('candidate-wrapper');
    const cpf = getCPF();
    const user = await find(cpf);
    let candidates = {};

    if(user.data.isCozil) {
        candidates = await getCandidates("votosCOZIL");

        for(const key in candidates) {
            wrapper.appendChild(buildCandidateElement(key));
        }
    } else {
        candidates = await getCandidates("votosPROINOX");

        for(const key in candidates) {
            wrapper.appendChild(buildCandidateElement(key));
        }
    }

    setupCandidates();
    console.log("#1:", candidates);
    return {
        isCozil: user.data.isCozil,
        candidates: candidates
    };
}

function buildCandidateElement(candidateName) {
    const div = document.createElement('div');
    div.classList.add('candidate')

    const span = document.createElement('span');
    span.classList.add('tooltip-text');
    span.innerHTML = candidateName;

    div.appendChild(span);

    return div;
}

function setupCandidates() {
    let candidateElements = document.getElementsByClassName("candidate");

    for(let i=0; i<candidateElements.length; i++) {
        candidateElements[i].addEventListener('click', selectCandidate);
    }
}

function selectCandidate(e) {
    let candidateElements = document.getElementsByClassName("candidate");
    selectedCandidate = e.target;

    for(let i=0; i<candidateElements.length; i++) {
        candidateElements[i].classList.remove("selected");
    }

    selectedCandidate.classList.add("selected");
}

function clearCandidate(e) {
    let candidateElements = document.getElementsByClassName("candidate");
    selectedCandidate = undefined;

    for(let i=0; i<candidateElements.length; i++) {
        candidateElements[i].classList.remove("selected");
    }
}

async function moveCarousel() {
    const carousel = document.getElementById("carousel");
    let isCozil = true;

    if(currentPosition === 0 && await verifyCPF()) {
        const candidatesObject = (await loadCandidates());
        console.log("#4:", candidatesObject);

        candidatesList = candidatesObject.candidates;
        isCozil = candidatesObject.isCozil;

        carousel.style.marginLeft = '-100vw';
        currentPosition++;
        return;
    }

    if(currentPosition === 1 && selectedCandidate != undefined) {
        console.log("#2:", candidatesList);
        vote(candidatesList, isCozil);
        carousel.style.marginLeft = '-200vw';
        currentPosition++;
        return;
    }
    if(currentPosition === 2) {
        clearCPF();
        clearCandidate();
        carousel.style.marginLeft = '0vw';
        currentPosition = 0;
        return;
    }
}

async function verifyCPF() {
    const cpf = getCPF();
    const user = await find(cpf);

    if(!user) {
        enableErrorMessage("CPF não cadastrado");
        return;
    }

    const hasUserVoted = await hasVoted(user);
    
    if(hasUserVoted) {
        enableErrorMessage("CPF já utilizado");
        return;
    }

    disableErrorMessage("");
    return true;
}

async function vote(candidates, isCozil) {
    const _selectedCandidate = selectedCandidate.firstChild.innerHTML;
    const cpf = getCPF();
    const user = await find(cpf);

    updateUserVote(user.id);
    console.log("selected candidate:", _selectedCandidate);
    console.log("#3:", candidates);
    if(isCozil) {
        console.log("candidate value:", candidates[_selectedCandidate])
        updateCandidateVote('votosCOZIL', _selectedCandidate, candidates[_selectedCandidate]);
    } else {
        console.log("candidate value:", candidates[_selectedCandidate])
        updateCandidateVote('votosPROINOX', _selectedCandidate, candidates[_selectedCandidate]);
    }

}

function getCPF() {
    const textField = document.getElementById("text-field");
    return textField.value;
}

function clearCPF() {
    const textField = document.getElementById("text-field");
    textField.value = "";
}

function enableErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerText = message;
    errorMessage.style.color = "rgb(255, 0, 0)";
}

function disableErrorMessage() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.color = "rgba(0, 0, 0, 0)";
}


