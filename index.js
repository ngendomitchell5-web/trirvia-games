const readline = require("node:readline");

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const questions = [
  {
    question: "Which language runs in a web browser?",
    choices: ["Python", "JavaScript", "C++", "Ruby"],
    answer: "B",
  },
  {
    question: "Which keyword declares a constant in JavaScript?",
    choices: ["let", "var", "const", "fixed"],
    answer: "C",
  },
  {
    question: "Which array method creates a new array by changing each item?",
    choices: ["map()", "push()", "pop()", "find()"],
    answer: "A",
  },
  {
    question: "Which symbol starts a single-line comment in JavaScript?",
    choices: ["<!--", "##", "//", "**"],
    answer: "C",
  },
  {
    question: "What does `===` check?",
    choices: ["Value only", "Type only", "Value and type", "Whether a value is false"],
    answer: "C",
  },
];

function ask(prompt) {
  return new Promise((resolve) => {
    let finished = false;

    function finish(answer) {
      if (finished) return;
      finished = true;
      terminal.removeListener("line", onLine);
      terminal.removeListener("close", onClose);
      resolve(answer);
    }

    function onLine(answer) {
      finish(answer.trim());
    }

    function onClose() {
      finish(null);
    }

    terminal.on("line", onLine);
    terminal.once("close", onClose);

    process.stdout.write(prompt);
  });
}

async function getAnswer() {
  while (true) {
    const answer = await ask("Your answer (A-D): ");

    if (answer === null) return null;

    const choice = answer.toUpperCase();
    if (["A", "B", "C", "D"].includes(choice)) return choice;

    console.log("Please enter A, B, C, or D.");
  }
}

async function startGame() {
  console.log("\nWelcome to Quick Trivia!");
  console.log(`There are ${questions.length} questions.`);
  const startAnswer = await ask("Press Enter to start: ");
  if (startAnswer === null) {
    terminal.close();
    return;
  }

  const results = [];

  for (const [index, item] of questions.entries()) {
    console.log(`\nQuestion ${index + 1}: ${item.question}`);
    item.choices
      .map((choice, choiceIndex) => `${String.fromCharCode(65 + choiceIndex)}. ${choice}`)
      .forEach((choice) => console.log(choice));

    const answer = await getAnswer();
    if (answer === null) {
      console.log("\nTime is up! The game is over.");
      break;
    }

    const isCorrect = answer === item.answer;
    results.push(isCorrect);
    console.log(isCorrect ? "Correct!" : `Not quite. The answer was ${item.answer}.`);
  }

  const score = results.reduce((total, isCorrect) => total + Number(isCorrect), 0);

  console.log("\nGame over!");
  console.log(`Your score: ${score}/${questions.length}`);
  console.log(`Questions answered: ${results.length}/${questions.length}`);
  terminal.close();
}

startGame().catch((error) => {
  console.error("The game could not start:", error.message);
  terminal.close();
});
