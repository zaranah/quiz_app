const question = document.getElementById("question");
// const choices = document.getElementsByClassName("choice-text");これだと答えが配列でないから反映しない
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// fecthを使用しない場合
// let questions = [
//   {
//     question: "Inside which HTML element do we put the JavaScript??",
//     choice1: "<script>",
//     choice2: "<javascript>",
//     choice3: "<js>",
//     choice4: "<scripting>",
//     answer: 1
//   },
//   {
//     question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
//     choice1: "<script href='xxx.js'>",
//     choice2: "<script name='xxx.js'>",
//     choice3: "<script src='xxx.js'>",
//     choice4: "<script file='xxx.js'>",
//     answer: 3
//   },
//   {
//     question: "How do you write 'Hello World' in an alert box?",
//     choice1: "msgBox('Hello World')",
//     choice2: "alertBox('Hello World')",
//     choice3: "msg('Hello World')",
//     choice4: "alert('Hello World')",
//     answer: 4
//   }
// ];
// fecthを使用しない場合


// fecthを使用する場合
let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple").then( res => {
  return res.json();
})
.then(loadedQuestions => {
  // console.log(loadedQuestions.results);
  questions = loadedQuestions.results.map( loadedQuestion => {
    const formattedQuestion = {
      question: loadedQuestion.question
    };
    const answerChoices = [...loadedQuestion.incorrect_answers]; //...を入れると配列になる（a b cじゃなくて[a, b, c]と出る）
    formattedQuestion.answer = Math.floor(Math.random() * 4) + 1; //1~4のどれかになる
    answerChoices.splice(
      formattedQuestion.answer - 1,
      0,
      loadedQuestion.correct_answer
    );
    answerChoices.forEach((choice, index) => {
      formattedQuestion["choice" + (index + 1)] = choice;
    });
    return formattedQuestion; //55lでquestion,58lでanswer,65lでchoice1...を入れた{}をmapで作っている
  });
  // console.log(questions);
  startGame();
})
.catch(err => {
  console.error(err);
});
// fecthを使用する場合

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  // availableQuestions = questions; だと質問sではなくそのhtmlが出る
  // console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
}

getNewQuestion = () => {

  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score);
    //go to the end page
    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`
  // Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach( choice => {
    const number =  choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  })

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply = 
      selectedAnswer == currentQuestion.answer ? "correct": "incorrect";
    // 上記と同じ意味を示す
    // const classToApply = 'incorrect';
    // if (selectedAnswer == currentQuestion.answer){
    //   classToApply = 'correct';
    // }

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    
    const answer = currentQuestion.answer;
    console.log(answer);
    const correctAnswerClass = document.getElementsByClassName("choice-text")
    console.log(correctAnswerClass);
    const correctAnswer = correctAnswerClass[answer-1]
    console.log(correctAnswer);
    if (classToApply !== "correct") {
      correctAnswer.parentElement.classList.add('correct');
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      if (classToApply != "correct") {
        correctAnswer.parentElement.classList.remove('correct');
      }
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}

// fecthを使用しない場合
// startGame();
// fecthを使用しない場合