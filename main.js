let questions = document.querySelector(".count span");
let bulletsSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let result = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let jsonToJavaScriptIndex = 0;
let rightAnswers = 0;
let countdownInterval ;
function getJsonJs() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let jsonToJavaScript = JSON.parse(this.responseText);
      let numOfJsonJS = jsonToJavaScript.length;
      questionsNum(numOfJsonJS);
      getQuestions(jsonToJavaScript[jsonToJavaScriptIndex], numOfJsonJS);
      countdown(5, numOfJsonJS);

      submitButton.onclick = () => {
        let theRightAnswer =
          jsonToJavaScript[jsonToJavaScriptIndex].right_answer;
        jsonToJavaScriptIndex++;
        checkAnswer(theRightAnswer, numOfJsonJS);
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        getQuestions(jsonToJavaScript[jsonToJavaScriptIndex], numOfJsonJS);
        handelBullets();
        clearInterval(countdownInterval);
        countdown(5, numOfJsonJS);
        showResults(numOfJsonJS);
      };
    }
  };
  myRequest.open("GET", "./index.json", true);
  myRequest.send();
}
getJsonJs();

function questionsNum(num) {
  questions.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let spansNum = document.createElement("span");
    if (i === 0) {
      spansNum.className = "on";
    }
    bulletsSpans.appendChild(spansNum);
  }
}

function getQuestions(obj, count) {
  if (jsonToJavaScriptIndex < count) {
    let headQuestion = document.createElement("h2");
    let nameQuestion = document.createTextNode(obj.title);
    headQuestion.appendChild(nameQuestion);
    quizArea.appendChild(headQuestion);

    for (let i = 1; i <= 4; i++) {
      let divAnswers = document.createElement("div");
      divAnswers.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let textLabel = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(textLabel);
      divAnswers.appendChild(radioInput);
      divAnswers.appendChild(theLabel);
      answerArea.appendChild(divAnswers);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (theChosenAnswer === rAnswer) {
    rightAnswers++;
  }
}
function handelBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrBulletsSpan = Array.from(bulletsSpan);
  arrBulletsSpan.forEach((span, index) => {
    if (index === jsonToJavaScriptIndex) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let thResult;
  if (count === jsonToJavaScriptIndex) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      thResult = `<span class= "good">good</span>`;
    } else if (rightAnswers === count) {
      thResult = `<span class= "prefect">Prefect</span>`;
    } else {
      thResult = `<span class= "bad">Bad</span>`;
    }
    result.innerHTML = thResult;
  }
}
function countdown(duration, count) {
  if (jsonToJavaScriptIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}