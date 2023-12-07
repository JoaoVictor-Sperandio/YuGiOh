const state ={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
    players: {
        player: "player-cards",
        playerBox: document.querySelector('#player-cards'),
        computer: "computer-cards",
        computerBox: document.querySelector('#computer-cards'),
    }
}

const pathImages = "./src/assets/icons/"
//Card data that could be fetched from an API
const cardData = [
    {
        id: 0,
        cardName: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        cardName: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {   
        id: 2,
        cardName: "Exodia The Forbidden One",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
]

//simply returns a random id
async function getRandomCardId(){
    const randomId = Math.floor(Math.random() * cardData.length);
    return cardData[randomId].id;
}
const cardBack = `${pathImages}card-back.png`;

//get the back image, event listeners and id for every card in hand
async function getCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100");
    cardImage.setAttribute("src", cardBack);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.players.player){
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        })
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })   
    }
    return cardImage;
}

async function setCardsField(idCard){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.style.display = "block";

    state.fieldCards.player.src = cardData[idCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
    let duelResult = await getDuelResult(idCard, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

//just update the score on the screen and the inner variable
async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore}    Lose: ${state.score.computerScore}`;
}

//draws the button with the result of the duel
async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

//checks the result of the duel and play audio according to the result
async function getDuelResult(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];
    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults);
    return duelResults;
}

//draws the cards to player and computer hands
async function drawCards(amountCards, fieldSide){
    for(let i = 0 ; i < amountCards; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await getCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

//removes all cards from the field
async function removeAllCardsImages(){
    let { playerBox, computerBox } = state.players;

    let imgElements = playerBox.querySelectorAll('img');
    imgElements.forEach((img) => { img.remove(); })

    imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach((img) => { img.remove(); })
}

//draws the selected card on the left screen
async function drawSelectedCard(idCard){
    state.cardSprites.avatar.src = cardData[idCard].img;
    state.cardSprites.name.innerText = cardData[idCard].cardName;
    state.cardSprites.type.innerText = "atribute : " + cardData[idCard].type;
}

//resets everything to start a new game keeping the score
async function resetDuel(){
    state.cardSprites.name.innerText = "SELECT";
    state.cardSprites.type.innerText = "A CARD!";
    state.cardSprites.avatar.src = "";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    state.actions.button.style.display = "none";
    await removeAllCardsImages();

    //restarting the game keeping the score
    await init();
}

//Generic audio player in .wav format
async function playAudio(status){
    let audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function backgroundAudio(){
    const bgm = document.getElementById("bgm");
    bgm.play();
    bgm.volume = 0.8;
}

//Function to initialize the game
function init(){
    //Removing the border of the image to leave the css border
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, state.players.player);
    drawCards(5, state.players.computer);
 
    backgroundAudio();
}

//Initializing the game
init();