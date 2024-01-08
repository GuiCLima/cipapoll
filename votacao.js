import { hasVoted } from "./firebase.js";

const button = document.getElementById("next-button");
button.addEventListener('click', moveCarousel);


async function moveCarousel() {
    const carousel = document.getElementById("carousel");
    const carouselStyle = getComputedStyle(carousel);

    if(carouselStyle.marginLeft === '0px') {
        const cpf = getCPF();
        const voted = await hasVoted(cpf);

        if(voted === undefined) {
            enableErrorMessage("CPF não cadastrado");
            return
        }
        if(voted) {
            enableErrorMessage("CPF já utilizado");
            return;
        }

        disableErrorMessage("");
        carousel.style.marginLeft = '-100vw';
    }
    if(carouselStyle.marginLeft === '-100vw') {
        carousel.style.marginLeft = '-200vw';
    }
    if(carouselStyle.marginLeft === '-200vw') {
        carousel.style.marginLeft = '-300vw';
    }
    if(carouselStyle.marginLeft === '-300vw') {
        carousel.style.marginLeft = 'none';
    }
}

function getCPF() {
    const textField = document.getElementById("text-field");

    return textField.value;
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


