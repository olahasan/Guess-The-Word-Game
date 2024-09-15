// Setting Game Options & variables
const numbersOfTries = 3;
const numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;
const words = ["Create", "Update", "Delete", "Master", "Branch", "School"];
const wordToGuess =
  words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);
document.querySelector(".hint span").textContent = numberOfHints;
const getHintButton = document.querySelector(".hint");
const guessButton = document.querySelector(".check");
let messageArea = document.querySelector(".message");
// console.log(messageArea);
let myAudioGameOver = document.querySelector(".myAudioGameOver");
let myAudiocongratulations = document.querySelector(".myAudiocongratulations");

window.onload = function () {
  startGame();
};

function startGame() {
  setGameName();
  generateInputs();

  getHintButton.addEventListener("click", getHint);
  guessButton.addEventListener("click", handleGuesses);

  document.addEventListener("keydown", discover);
}

function setGameName() {
  const gameName = "Guess The Word";
  document.title = gameName;
  document.querySelector("h1").textContent = gameName;
  document.querySelector(
    "footer"
  ).textContent = `${gameName} Game Created By Elzero/Ola Ali`;
}

function generateInputs() {
  //1- creare main Attempts and thier  inputs
  const inputsContainer = document.querySelector(".inputs");

  // Create Main Try Div
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // Create Inputs
    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  //2- Focus On First Input In First Attempt Element
  inputsContainer.children[0].children[1].focus();

  //3- Disable All Attempts but the First One
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  //4- Make the cursor move to the next input automatically if current was full.
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Input To Uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    // 5- Make the cursor move right or left based on
    // "if the user presses the right arrow button on the keyboard or the left button".
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);

      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").textContent = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleGuesses() {
  let successGuess = true;

  //1- check if every character is in right place
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  //2- Check If User all characters are right the he Wins or has another tries, otherwise he loses
  let winLoseOrAnotherTry = checkWinLoseOrAnothertry(successGuess);

  if (winLoseOrAnotherTry === "win") {
    handleWin();
  } else if (winLoseOrAnotherTry === "anothertry") {
    handleAnotherTry();
  } else {
    handleLose();
  }
}

function checkWinLoseOrAnothertry(successGuess) {
  if (successGuess) {
    // console.log("win");
    return "win";
  } else if (!successGuess && currentTry < numbersOfTries) {
    // console.log("!successGuess && currentTry < numbersOfTries");
    return "anothertry";
  } else if (!successGuess && currentTry === numbersOfTries) {
    // console.log("!successGuess && currentTry === numbersOfTries");
    return "lose";
  }
}

function handleWin() {
  // document.style.pointerEvents = "none";
  messageArea.style.display = "block";
  // messageArea.innerHTML = `You Win! The word is <span>${wordToGuess}</span>`;
  // if (numberOfHints === 2) {
  //   messageArea.innerHTML += `<p>Congratulations! You didn't use any hints.</p>`;
  // }
  createFinalScreen(
    "You Win!",
    "Do You want to play again?",
    "Yes",
    "No",
    `${wordToGuess}`
  );

  // Disable All Try Divs
  document
    .querySelectorAll(".inputs > div")
    .forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

  // Disable Buttons
  guessButton.disabled = true;
  getHintButton.disabled = true;
  playAudio(myAudiocongratulations);
  playAgain();
}

function handleAnotherTry() {
  document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
  document
    .querySelectorAll(`.try-${currentTry} input`)
    .forEach((input) => (input.disabled = true));

  currentTry++;

  const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);

  nextTryInputs.forEach((input) => (input.disabled = false));

  const nextTryDiv = document.querySelector(`.try-${currentTry}`);

  if (nextTryDiv) {
    nextTryDiv.classList.remove("disabled-inputs");
    nextTryDiv.children[1].focus();
  }
}

function handleLose() {
  guessButton.disabled = true;
  getHintButton.disabled = true;
  // messageArea.innerHTML = `You Lose! The word was <span>${wordToGuess}</span>`;
  createFinalScreen(
    "You Lose!",
    "Do You want to play again?",
    "Yes",
    "No",
    `${wordToGuess}`
  );
  messageArea.style.display = "block";
  messageArea.style.backgroundColor = "#8a8f96";
  playAudio(myAudioGameOver);
  playAgain();
}

function playAudio(audio) {
  audio.play();
}

function playAgain() {
  addEventListeners();
}

function addEventListeners() {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-yes")) {
      handleYes();
    }

    if (e.target.classList.contains("btn-no")) {
      handleNo();
    }
  });
}

// function addEventListeners() {
//   // Remove existing event listeners to prevent duplication
//   document.removeEventListener("click", handleButtonClick);
//   document.removeEventListener("keydown", handleEnterKey);

//   // Add new event listeners
//   document.addEventListener("click", handleButtonClick);
//   document.addEventListener("keydown", handleEnterKey);
// }

function handleButtonClick(e) {
  if (e.target.classList.contains("btn-yes")) {
    handleYes();
  }

  if (e.target.classList.contains("btn-no")) {
    handleNo();
  }
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    const btnYes = document.querySelector(".btn-yes");
    if (btnYes) {
      handleYes();
    }
  }
}

function handleYes() {
  location.reload();
}

function handleNo() {
  messageArea.innerHTML = "";

  let p = document.createElement("p");
  p.className = "thanks";
  let pText = document.createTextNode("THANK YOU");
  p.appendChild(pText);

  messageArea.appendChild(p);
}

function discover(event) {
  // console.log(event.key);
  if (event.key === "Backspace") {
    handleBackspace(event);
  } else if (event.key === "Enter") {
    handleGuesses();
  }
}

function handleBackspace(event) {
  console.log(event.key);
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      // const prevInput = inputs[currentIndex - 1]; //
      currentInput.value = "";
      // prevInput.value = ""; //
      // prevInput.focus(); //
    }
  }
}

function createFinalScreen(title, question, btnYes, btnNo, correctAnswer) {
  // Check if the final screen already exists
  if (document.querySelector(".card")) {
    return; // Exit the function if the card already exists
  }

  // Create the card
  let theCard = document.createElement("div");
  theCard.className = "card";

  // Title
  let theTitle = document.createElement("div");
  theTitle.className =
    title === "Game Over" ? "title Game-Over" : "title Congratulations";
  let theTitleText = document.createTextNode(title);
  theTitle.appendChild(theTitleText);

  // Append the title to the card
  theCard.appendChild(theTitle);

  // Correct answer
  if (correctAnswer) {
    let theParagraph = createElement(
      "p",
      "rightanswer",
      `The right answer is `,
      theCard
    );
    createElement("span", "answer", ` ${correctAnswer} `, theParagraph);
  }

  // Question
  createElement("p", "question", question, theCard);

  // Buttons container
  let theBtnContainer = document.createElement("div");
  theBtnContainer.className = "btn-container";

  // Yes button
  let theBtnYes = createButton(btnYes, "btn-yes");

  // No button
  let theBtnNo = createButton(btnNo, "btn-no");

  // Append buttons to their container
  appendBtnsInContainer([theBtnYes, theBtnNo], theBtnContainer);

  // Append the button container to the card
  theCard.appendChild(theBtnContainer);

  // Append the card to the message area
  messageArea.appendChild(theCard);
}

function createButton(text, className) {
  let btn = document.createElement("button");
  btn.className = className;
  let btnText = document.createTextNode(text);
  btn.appendChild(btnText);

  return btn;
}

function appendBtnsInContainer(buttons, theBtnContainer) {
  buttons.forEach((button) => {
    theBtnContainer.appendChild(button);
  });
}

function createElement(tag, className, textcontent, parent) {
  let element = document.createElement(tag);
  if (className) element.className = className;
  if (textcontent) element.textContent = textcontent;
  if (parent) parent.appendChild(element);
  return element;
}
