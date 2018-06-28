"use strict";

let cards = Array.from(document.getElementsByClassName("card"));
let cardContainer = document.querySelector(".container-space"),
    counter = document.querySelector(".counter"),
    timer = document.querySelector(".timer"),
    success = document.querySelector(".successMsg");
let iconContainer = Array.from(document.getElementsByClassName("white-font"));
let matchedCards = [],
    unmatchedCards = [],
    cardToCheck = [];
let count = 0;
var id,
    time;

//this should only shuffled the card and return a new one
function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let index = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[index];
        array[index] = temp;
    }
    return array;
}

//this will show the card on refresh or reload and also remove it after some time
function displayCards() {
    cardContainer.innerHTML = "";
    cards = shuffleCards(cards);
    cards.forEach((card, index) => {
        cardContainer.appendChild(card);
        card.classList.remove("hide");
        card.classList.add("open")
    })

    //this should remove the card after some seconds
    setTimeout(hideCards, 1500)
}

//starts the game with the necessary defaults
function startGame() {
    var fiveMinutes = 60 * 5,
        display = timer;
    startTimer(fiveMinutes, display);
    displayCards();
    cards.forEach((card, index) => {
        card.addEventListener("click", addCard);
        card.addEventListener("click", showCard);
        card.addEventListener("click", validateCard);
        // card.setAttribute("type", cards[index]);
    })
}

//checks whether the card matches or not
function validateCard() {
    cardToCheck.push(this);
    if (cardToCheck.length == 2) {
        count++;
        counter.innerHTML = count;
        //disable cards
        disableCards();
        if (cardToCheck[0].getAttribute("data-card") == cardToCheck[1].getAttribute("data-card")) {
            matchCard(cardToCheck[0], cardToCheck[1]);
            matchedCards.push(...cardToCheck);
            cardToCheck = [];
            //enable cards again
            enableCards();
            //checks for successful completion
            if(matchedCards.length == 16){
                success.removeAttribute('hidden');
                document.getElementById("finalMove").textContent = count;
                document.getElementById("totalTime").textContent = time;
                clearInterval(id)
                matchedCards = [];
                disableCards();
            }
        } else {
            unmatchCard(cardToCheck[0], cardToCheck[1]);
            unmatchedCards.push(...cardToCheck);
            cardToCheck = [];
            //enable cards again
            enableCards();
        }
    }
}

function matchCard(firstCard, secondCard) {
    firstCard.classList.add("match");
    secondCard.classList.add("match");
}

function unmatchCard(firstCard, secondCard) {
    firstCard.classList.add("unmatch");
    secondCard.classList.add("unmatch");
    setTimeout(()=>{
        firstCard.classList.remove("show", "open", "unmatch");
        firstCard.querySelector("i").classList.add("hide");
        secondCard.classList.remove("show", "open", "unmatch");
        secondCard.querySelector("i").classList.add("hide");
    }, 1000)
}


function addCard() {
    cards.forEach(() => {
        this.classList.add("open");
    })
}

//this will remove the hide class and show the card to the view
function showCard() {
    let i = this.querySelector("i");
    i.classList.remove("hide");
}

//this adds the hide class, which hides the cards from the view
function hideCards() {
    iconContainer.forEach((card) => {
        card.classList.add("hide");
    })
    cards.forEach((card)=>{
        card.classList.remove("open");
    })
}

//function to disable cards
function disableCards(){
    cards.forEach((card)=>{
        card.classList.add("disable");
    });
}

//this will enable the cards again
function enableCards(){
    cards.forEach((card)=>{
        card.classList.remove("disable");
    });

    matchedCards.forEach((card)=>{
        card.classList.add("disable");
    });
}

function startTimer(duration, display){
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    //we don't want to wait a full second before the timer starts
    timer();
    id = setInterval(timer, 1000);

    function timer(){
        //get the number of seconds that have elapsed since
        //startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        //does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        time = minutes + ":" + seconds;

        if(diff <= 0){
            //add one second so that the count down starts at the full duration
            //example 05:00 not 04:49
            start = Date.now() + 1000;
            clearInterval(id);
            failure.removeAttribute('hidden');
            unmatchedCards = [];
            disableCards();
        }
    };
}

//reload the browser
function reload() {
    location.reload()
}

window.onload = startGame();