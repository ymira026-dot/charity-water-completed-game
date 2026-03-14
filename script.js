// Water Rush game logic
// Beginner-friendly structure: one state object + one rounds array.

const rounds = [
	{
		title: "Pump Breakdown",
		description: "The village water pump stopped working. Repairs cost resources.",
		choiceA: {
			text: "Repair Immediately",
			effects: { water: 10, health: 5, education: 0, economy: -12, score: 12 },
			message: "Quick action protected clean water."
		},
		choiceB: {
			text: "Delay Repairs",
			effects: { water: -18, health: -6, education: 0, economy: 5, score: -8 },
			message: "Delay saved money now, but caused water losses."
		}
	},
	{
		title: "School Water Filter",
		description: "The school needs a new water filter. Funding it reduces budget today.",
		choiceA: {
			text: "Fund The Filter",
			effects: { water: 8, health: 7, education: 10, economy: -10, score: 14 },
			message: "Students now have safer drinking water."
		},
		choiceB: {
			text: "Postpone Purchase",
			effects: { water: -6, health: -4, education: -8, economy: 6, score: -6 },
			message: "The budget improved, but school conditions worsened."
		}
	},
	{
		title: "Obstacle: Drought Week",
		description: "A drought reduces local water sources. This round includes a forced penalty.",
		obstaclePenalty: 12,
		choiceA: {
			text: "Ration Water Fairly",
			effects: { water: -8, health: -2, education: 0, economy: -4, score: 8 },
			message: "Rationing reduced damage but was difficult for families."
		},
		choiceB: {
			text: "Keep Normal Usage",
			effects: { water: -16, health: -6, education: -3, economy: 2, score: -10 },
			message: "Normal usage made shortages worse."
		}
	},
	{
		title: "Community Training Day",
		description: "You can run a workshop on water sanitation and maintenance.",
		choiceA: {
			text: "Run The Training",
			effects: { water: 4, health: 8, education: 9, economy: -5, score: 12 },
			message: "Training improved long-term community outcomes."
		},
		choiceB: {
			text: "Skip This Month",
			effects: { water: -3, health: -4, education: -7, economy: 4, score: -5 },
			message: "Skipping training slowed progress this round."
		}
	}
];

const initialState = {
	roundIndex: 0,
	water: 100,
	health: 100,
	education: 100,
	economy: 100,
	score: 0,
	gameOver: false
};

let gameState = { ...initialState };

// Cache DOM elements once so we can reuse them in every function.
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const choiceABtn = document.getElementById("choice-a-btn");
const choiceBBtn = document.getElementById("choice-b-btn");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");

const roundValue = document.getElementById("round-value");
const scoreValue = document.getElementById("score-value");
const waterValue = document.getElementById("water-value");
const healthValue = document.getElementById("health-value");
const educationValue = document.getElementById("education-value");
const economyValue = document.getElementById("economy-value");

const eventTitle = document.getElementById("event-title");
const eventDescription = document.getElementById("event-description");
const feedbackMessage = document.getElementById("feedback-message");

const endTitle = document.getElementById("end-title");
const endMessage = document.getElementById("end-message");
const finalScoreValue = document.getElementById("final-score-value");

const confettiContainer = document.getElementById("confetti-container");

function setScreen(screenName) {
	startScreen.classList.add("hidden");
	gameScreen.classList.add("hidden");
	endScreen.classList.add("hidden");

	if (screenName === "start") {
		startScreen.classList.remove("hidden");
	}

	if (screenName === "game") {
		gameScreen.classList.remove("hidden");
	}

	if (screenName === "end") {
		endScreen.classList.remove("hidden");
	}
}

function renderStats() {
	roundValue.textContent = `${gameState.roundIndex + 1} / ${rounds.length}`;
	scoreValue.textContent = gameState.score;
	waterValue.textContent = gameState.water;
	healthValue.textContent = gameState.health;
	educationValue.textContent = gameState.education;
	economyValue.textContent = gameState.economy;
}

function setFeedback(message, type) {
	feedbackMessage.textContent = message;
	feedbackMessage.classList.remove("success", "failure", "neutral");
	feedbackMessage.classList.add(type);
}

function renderRound() {
	const currentRound = rounds[gameState.roundIndex];
	eventTitle.textContent = currentRound.title;
	eventDescription.textContent = currentRound.description;
	choiceABtn.textContent = currentRound.choiceA.text;
	choiceBBtn.textContent = currentRound.choiceB.text;
}

function clampResources() {
	// Clamp values so they do not display below 0 or above 120.
	gameState.water = Math.max(0, Math.min(120, gameState.water));
	gameState.health = Math.max(0, Math.min(120, gameState.health));
	gameState.education = Math.max(0, Math.min(120, gameState.education));
	gameState.economy = Math.max(0, Math.min(120, gameState.economy));
}

function applyEffects(effects) {
	gameState.water += effects.water;
	gameState.health += effects.health;
	gameState.education += effects.education;
	gameState.economy += effects.economy;
	gameState.score += effects.score;
	clampResources();
}

function applyObstacleIfNeeded(round) {
	if (!round.obstaclePenalty) {
		return "";
	}

	gameState.water -= round.obstaclePenalty;
	gameState.score -= round.obstaclePenalty;
	clampResources();

	return ` Obstacle hit: drought caused -${round.obstaclePenalty} water and -${round.obstaclePenalty} score.`;
}

function didPlayerLose() {
	return gameState.water <= 0 || gameState.health <= 0 || gameState.economy <= 0;
}

function endGame(playerWon) {
	gameState.gameOver = true;
	finalScoreValue.textContent = gameState.score;

	if (playerWon) {
		endTitle.textContent = "You Win!";
		endMessage.textContent = "Great job. You protected village water through all rounds.";
		launchConfetti();
	} else {
		endTitle.textContent = "You Lost";
		endMessage.textContent = "Critical resources ran out before the village stabilized.";
	}

	setScreen("end");
}

function handleChoice(choiceKey) {
	if (gameState.gameOver) {
		return;
	}

	const currentRound = rounds[gameState.roundIndex];
	const chosenOption = currentRound[choiceKey];

	applyEffects(chosenOption.effects);
	const obstacleText = applyObstacleIfNeeded(currentRound);

	if (chosenOption.effects.score >= 0) {
		setFeedback(`${chosenOption.message}${obstacleText}`, "success");
	} else {
		setFeedback(`${chosenOption.message}${obstacleText}`, "failure");
	}

	renderStats();

	if (didPlayerLose()) {
		endGame(false);
		return;
	}

	const isFinalRound = gameState.roundIndex === rounds.length - 1;

	if (isFinalRound) {
		endGame(true);
		return;
	}

	gameState.roundIndex += 1;
	renderRound();
}

function resetGameState() {
	gameState = { ...initialState };
	renderStats();
	renderRound();
	setFeedback("Make a choice to continue.", "neutral");
}

function startGame() {
	resetGameState();
	setScreen("game");
}

function resetToStart() {
	resetGameState();
	setScreen("start");
}

function launchConfetti() {
	confettiContainer.innerHTML = "";
	const colors = ["#ffc907", "#2e9df7", "#4fcb53", "#ff902a", "#f16061"];

	for (let i = 0; i < 80; i += 1) {
		const piece = document.createElement("span");
		piece.className = "confetti-piece";
		piece.style.left = `${Math.random() * 100}%`;
		piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
		piece.style.animationDelay = `${Math.random() * 0.4}s`;
		piece.style.transform = `rotate(${Math.random() * 360}deg)`;
		confettiContainer.appendChild(piece);
	}

	setTimeout(() => {
		confettiContainer.innerHTML = "";
	}, 2200);
}

startBtn.addEventListener("click", startGame);
choiceABtn.addEventListener("click", () => handleChoice("choiceA"));
choiceBBtn.addEventListener("click", () => handleChoice("choiceB"));
resetBtn.addEventListener("click", resetToStart);
playAgainBtn.addEventListener("click", startGame);

// Start on the intro screen.
setScreen("start");
