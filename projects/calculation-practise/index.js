const resultsDiv = document.getElementById("results");
let questionCount = 0;
let correctCount = 0;
let maxDigitCount = 10;
let currentOperator = "";
let globalAnswer = 0;
let globalNumVariables = 0;

function generateRandomNumber(maxDigitCount) {
  return Math.floor(Math.random() * Math.pow(10, maxDigitCount));
}

function generateQuestion(maxDigitCount, operation, numVariables) {
  const numbers = [];
  for (let i = 0; i < numVariables; i++) {
    numbers.push(generateRandomNumber(maxDigitCount));
  }
  globalAnswer = calculateCorrectAnswer(numbers, operation); // Set the global answer
  const question = numbers.join(` ${operation} `) + ' = ?';
  console.log("Question: ", question);
  console.log("Answer: ", globalAnswer);
  return question;
}

function checkAnswer() {
  const userAnswer = parseFloat(document.getElementById("userAnswer").value);
  console.log("User Answer: ", userAnswer);
  let correct = false;
  let correctAnswer = globalAnswer;
  if (!isNaN(correctAnswer) && userAnswer === correctAnswer) {
    correct = true;
    correctCount++;
  }

  if (correct){
    console.log("Correct: True");
  }else{
    console.log("Correct: False");
  }
  console.log("===================");

  questionCount++;

  document.getElementById("userAnswer").value = "";
  document.getElementById("userAnswer").focus();
  document.getElementById("question").textContent = generateQuestion(
    maxDigitCount,
    currentOperator,
    globalNumVariables
  );

  const resultDiv = document.createElement("div");
  resultDiv.style.display = "flex";
  resultDiv.style.flexDirection = "column";
  const questionRank = document.createElement("span");
  questionRank.textContent = `${questionCount}`;
  const icon = document.createElement("span");
  icon.textContent = correct ? "✅" : "❌";
  resultDiv.appendChild(questionRank);
  resultDiv.appendChild(icon);
  resultDiv.classList.add("result-item");
  resultsDiv.appendChild(resultDiv);
}

function calculateCorrectAnswer(variables, operation) {
  if (variables.length < 1) {
    return NaN; // Handle cases with insufficient variables
  }

  let correctAnswer = 0;

  if (operation === '*'){
    correctAnswer = 1;
  }

  for (let i = 0; i < variables.length; i++) {
    const num = parseFloat(variables[i]);
    if (isNaN(num)) {
      return NaN; // Handle invalid number
    }

    switch (operation) {
      case "+":
        correctAnswer += num;
        break;
      case "-":
        correctAnswer -= num;
        break;
      case "*":
        correctAnswer *= num;
        break;
      case "/":
        correctAnswer /= num;
        break;
      default:
        return NaN; // Handle invalid operation
    }
  }

  return correctAnswer;
}

function startTest() {
  maxDigitCount = document.getElementById("maxDigitCount").value;
  const operation = document.getElementById("operation").value;
  currentOperator = operation;
  let numVariables = parseInt(document.getElementById("numVariables").value); // Update the number of variables
  globalNumVariables =numVariables;
  // Hide the options after the test starts
  document.getElementById("options").style.display = "none";
  document.getElementById("startButton").style.display = "none";
  document.getElementById("question").style.display = "flex";
  document.getElementById("userAnswer").style.display = "flex";
  document.getElementById("container").style.display = "flex";
  document.getElementById("container").style.flexDirection = "column";
  document.getElementById("container").style.alignItems = "center";

  // Generate the first question
  document.getElementById("question").textContent = generateQuestion(
    maxDigitCount,
    operation,
    numVariables
  );

  document.getElementById("userAnswer").focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
}
