// Ripple Effect game logic
// Beginner-friendly structure: one state object + one rounds array.

const difficultySettings = {
	easy: {
		label: "Easy",
		goalScore: 34,
		roundTime: 24,
		obstacleMultiplier: 0.75,
		timeoutPenalty: { water: -5, health: -2, education: -2, economy: -2, score: -4 },
		roundPressure: { water: 0, health: 0, education: 0, economy: 0, score: 0 }
	},
	normal: {
		label: "Normal",
		goalScore: 46,
		roundTime: 16,
		obstacleMultiplier: 1,
		timeoutPenalty: { water: -8, health: -4, education: -3, economy: -3, score: -7 },
		roundPressure: { water: 0, health: 0, education: 0, economy: 0, score: 0 }
	},
	hard: {
		label: "Hard",
		goalScore: 58,
		roundTime: 10,
		obstacleMultiplier: 1.25,
		timeoutPenalty: { water: -10, health: -5, education: -4, economy: -4, score: -9 },
		roundPressure: { water: -1, health: -2, education: 0, economy: -2, score: -1 }
	}
};

const milestoneMessages = [
	{ score: 10, message: "Milestone: Great start. Your plan is gaining momentum." },
	{ score: 25, message: "Milestone: Halfway there. Keep protecting clean water systems." },
	{ score: 45, message: "Milestone: Strong impact. Families are seeing real change." },
	{ score: 60, message: "Milestone: Mission-level progress. One final push." }
];

const rounds = [
	{
		title: "Broken Pump, Busy Morning",
		description: "The main water point fails before sunrise. Families are already lining up with containers.",
		missionTip: "Fast repair means girls spend less time walking for water and more time in school.",
		choiceA: {
			text: "Call Local Mechanics Now",
			risk: "Low Risk",
			effects: { water: 12, health: 6, education: 5, economy: -10, score: 14 },
			message: "Local partners fixed the pump quickly and restored clean water access."
		},
		choiceB: {
			text: "Wait For Next Week",
			risk: "High Risk",
			effects: { water: -18, health: -6, education: -4, economy: 6, score: -8 },
			message: "Waiting protected budget, but families lost safe water days."
		},
		choiceC: {
			text: "Temporary Water Truck",
			risk: "Balanced",
			effects: { water: 2, health: 2, education: 1, economy: -4, score: 5 },
			message: "Temporary support helped today, but permanent repair still matters."
		},
		choiceD: {
			text: "Community Repair Shift",
			risk: "Bold",
			effects: { water: 9, health: 4, education: 3, economy: -6, score: 10 },
			message: "Volunteers restored access quickly, though tools and coordination cost effort."
		}
	},
	{
		title: "School Filter Decision",
		description: "The school requests a replacement filter and hygiene station before exams.",
		missionTip: "Clean water and handwashing in school improve attendance and student health.",
		choiceA: {
			text: "Fund Filter + Hygiene Lessons",
			risk: "Low Risk",
			effects: { water: 8, health: 9, education: 12, economy: -11, score: 15 },
			message: "Students stay healthier, and classrooms lose fewer days to water sickness."
		},
		choiceB: {
			text: "Delay Until Next Term",
			risk: "High Risk",
			effects: { water: -6, health: -5, education: -9, economy: 6, score: -6 },
			message: "Money stayed in reserve, but unsafe water disrupted student focus."
		},
		choiceC: {
			text: "Pilot In Two Classrooms",
			risk: "Balanced",
			effects: { water: 3, health: 4, education: 5, economy: -5, score: 7 },
			message: "A smaller pilot improved conditions while controlling costs."
		},
		choiceD: {
			text: "Parent-Led Water Club",
			risk: "Bold",
			effects: { water: 5, health: 6, education: 7, economy: -7, score: 9 },
			message: "Families helped run hygiene routines and boosted attendance over time."
		}
	},
	{
		title: "Obstacle: Drought Week",
		description: "Rainfall drops sharply and water pressure falls in every tap stand.",
		missionTip: "Resilience plans protect communities during climate stress.",
		obstaclePenalty: 12,
		choiceA: {
			text: "Ration + Emergency Storage",
			risk: "Low Risk",
			effects: { water: -7, health: -2, education: 0, economy: -4, score: 9 },
			message: "The emergency plan kept clinics and schools operating."
		},
		choiceB: {
			text: "Keep Business As Usual",
			risk: "High Risk",
			effects: { water: -17, health: -6, education: -3, economy: 3, score: -10 },
			message: "Without planning, shortages spread faster than expected."
		},
		choiceC: {
			text: "Protect Clinics First",
			risk: "Balanced",
			effects: { water: -11, health: 1, education: -2, economy: -3, score: 4 },
			message: "Essential services stayed safer, though some families still struggled."
		},
		choiceD: {
			text: "Rain Harvest Sprint",
			risk: "Bold",
			effects: { water: -5, health: -1, education: 1, economy: -6, score: 8 },
			message: "Fast rain capture softened losses but required emergency spending."
		}
	},
	{
		title: "Women-Led Water Committee",
		description: "Community leaders ask for training to maintain pumps and track repairs year-round.",
		missionTip: "Strong local leadership makes water systems last for years, not months.",
		choiceA: {
			text: "Fund Leadership Training",
			risk: "Low Risk",
			effects: { water: 5, health: 8, education: 10, economy: -5, score: 13 },
			message: "Local ownership improved maintenance and reliability."
		},
		choiceB: {
			text: "Skip For Cost Savings",
			risk: "High Risk",
			effects: { water: -3, health: -4, education: -7, economy: 4, score: -5 },
			message: "Skipping training saved money now, but slowed long-term progress."
		},
		choiceC: {
			text: "Train Fewer Leaders",
			risk: "Balanced",
			effects: { water: 2, health: 3, education: 4, economy: -2, score: 6 },
			message: "A lighter training plan delivered moderate long-term gains."
		},
		choiceD: {
			text: "Youth Mentorship Track",
			risk: "Bold",
			effects: { water: 4, health: 4, education: 8, economy: -4, score: 8 },
			message: "Student mentors spread good maintenance habits across neighborhoods."
		}
	},
	{
		title: "Data And Accountability",
		description: "You can install remote sensors that report broken pumps faster.",
		missionTip: "Transparent data helps teams respond quickly and earn donor trust.",
		choiceA: {
			text: "Install Smart Monitoring",
			risk: "Low Risk",
			effects: { water: 9, health: 5, education: 3, economy: -8, score: 14 },
			message: "Real-time updates helped teams fix issues before families lost access."
		},
		choiceB: {
			text: "Use Manual Logs Only",
			risk: "High Risk",
			effects: { water: -4, health: -2, education: -1, economy: 2, score: -4 },
			message: "Manual logs worked, but response time stayed slow."
		},
		choiceC: {
			text: "Monthly Manual Audits",
			risk: "Balanced",
			effects: { water: 2, health: 1, education: 1, economy: -2, score: 5 },
			message: "Regular audits improved accountability without full tech rollout."
		},
		choiceD: {
			text: "SMS Repair Hotline",
			risk: "Bold",
			effects: { water: 6, health: 3, education: 2, economy: -5, score: 8 },
			message: "A simple hotline sped up repair reports with lower setup costs."
		}
	}
];

const initialState = {
	roundIndex: 0,
	difficultyKey: "normal",
	secondsLeft: difficultySettings.normal.roundTime,
	water: 100,
	health: 100,
	education: 100,
	economy: 100,
	streak: 0,
	peopleReached: 0,
	accessPercent: 0,
	score: 0,
	gameOver: false
};

let gameState = { ...initialState };
let roundTimerId = null;
let reachedMilestones = [];

// Cache DOM elements once so we can reuse them in every function.
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty-select");
const choiceABtn = document.getElementById("choice-a-btn");
const choiceBBtn = document.getElementById("choice-b-btn");
const choiceCBtn = document.getElementById("choice-c-btn");
const choiceDBtn = document.getElementById("choice-d-btn");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const choiceButtons = [choiceABtn, choiceBBtn, choiceCBtn, choiceDBtn];

const roundValue = document.getElementById("round-value");
const modeValue = document.getElementById("mode-value");
const scoreValue = document.getElementById("score-value");
const goalValue = document.getElementById("goal-value");
const timerValue = document.getElementById("timer-value");
const streakValue = document.getElementById("streak-value");
const peopleValue = document.getElementById("people-value");
const waterValue = document.getElementById("water-value");
const healthValue = document.getElementById("health-value");
const educationValue = document.getElementById("education-value");
const economyValue = document.getElementById("economy-value");
const impactFill = document.getElementById("impact-fill");
const impactLabel = document.getElementById("impact-label");

const eventTitle = document.getElementById("event-title");
const eventDescription = document.getElementById("event-description");
const missionTip = document.getElementById("mission-tip");
const feedbackMessage = document.getElementById("feedback-message");
const milestoneMessage = document.getElementById("milestone-message");
const activityLog = document.getElementById("activity-log");

const endTitle = document.getElementById("end-title");
const endMessage = document.getElementById("end-message");
const impactSummary = document.getElementById("impact-summary");
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

function getDifficulty() {
	return difficultySettings[gameState.difficultyKey];
}

function renderStats() {
	roundValue.textContent = `${gameState.roundIndex + 1} / ${rounds.length}`;
	modeValue.textContent = getDifficulty().label;
	scoreValue.textContent = gameState.score;
	goalValue.textContent = getDifficulty().goalScore;
	timerValue.textContent = `${gameState.secondsLeft}s`;
	streakValue.textContent = gameState.streak;
	peopleValue.textContent = gameState.peopleReached;
	waterValue.textContent = gameState.water;
	healthValue.textContent = gameState.health;
	educationValue.textContent = gameState.education;
	economyValue.textContent = gameState.economy;
	impactFill.style.width = `${gameState.accessPercent}%`;
	impactLabel.textContent = `${gameState.accessPercent}%`;
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
	missionTip.textContent = `Mission tip: ${currentRound.missionTip}`;

	const choiceKeys = shuffleArray(["choiceA", "choiceB", "choiceC", "choiceD"]);

	for (let i = 0; i < choiceButtons.length; i += 1) {
		const button = choiceButtons[i];
		const key = choiceKeys[i];
		const option = currentRound[key];
		button.dataset.choiceKey = key;
		button.innerHTML = `<span class="choice-label">${option.text}<span class="choice-risk">${option.risk}</span></span>`;
	}
}

function shuffleArray(items) {
	const result = [...items];

	for (let i = result.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = result[i];
		result[i] = result[j];
		result[j] = temp;
	}

	return result;
}

function startRoundTimer() {
	stopRoundTimer();
	gameState.secondsLeft = getDifficulty().roundTime;
	renderStats();

	roundTimerId = setInterval(() => {
		if (gameState.gameOver) {
			stopRoundTimer();
			return;
		}

		gameState.secondsLeft -= 1;
		timerValue.textContent = `${gameState.secondsLeft}s`;

		if (gameState.secondsLeft <= 0) {
			handleTimeout();
		}
	}, 1000);
}

function stopRoundTimer() {
	if (roundTimerId) {
		clearInterval(roundTimerId);
		roundTimerId = null;
	}
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
	updateAccessPercent();
}

function updateAccessPercent() {
	// We use an average of the four village stats as a simple access indicator.
	const total = gameState.water + gameState.health + gameState.education + gameState.economy;
	gameState.accessPercent = Math.round(total / 4);
}

function updateImpactFromChoice(chosenOption) {
	if (chosenOption.effects.score > 0) {
		gameState.streak += 1;
		gameState.score += gameState.streak;
		gameState.peopleReached += 45 + gameState.streak * 10;
	} else {
		gameState.streak = 0;
		gameState.peopleReached = Math.max(0, gameState.peopleReached - 12);
	}
}

function updateStreakBadge() {
	const existingBadge = document.getElementById("streak-badge");

	if (gameState.streak >= 2) {
		if (!existingBadge) {
			const badge = document.createElement("span");
			badge.id = "streak-badge";
			badge.className = "streak-badge";
			eventTitle.appendChild(badge);
		}

		document.getElementById("streak-badge").textContent = `Hot Streak x${gameState.streak}`;
		return;
	}

	if (existingBadge) {
		existingBadge.remove();
	}
}

function addActivityItem(text) {
	const item = document.createElement("li");
	item.textContent = text;
	activityLog.appendChild(item);

	// Keep the feed short by removing older lines.
	while (activityLog.children.length > 5) {
		activityLog.firstElementChild.remove();
	}
}

function showMilestone(text) {
	milestoneMessage.textContent = text;
	milestoneMessage.classList.remove("hidden");

	setTimeout(() => {
		milestoneMessage.classList.add("hidden");
	}, 2400);
}

function checkMilestones() {
	for (const milestone of milestoneMessages) {
		const alreadyReached = reachedMilestones.includes(milestone.score);

		if (!alreadyReached && gameState.score >= milestone.score) {
			reachedMilestones.push(milestone.score);
			showMilestone(milestone.message);
			addActivityItem(milestone.message);
		}
	}
}

function applyObstacleIfNeeded(round) {
	if (!round.obstaclePenalty) {
		return "";
	}

	const difficultyPenalty = Math.round(round.obstaclePenalty * getDifficulty().obstacleMultiplier);
	gameState.water -= difficultyPenalty;
	gameState.score -= difficultyPenalty;
	clampResources();
	updateAccessPercent();

	return ` Obstacle hit: drought caused -${difficultyPenalty} water and -${difficultyPenalty} score.`;
}

function applyRoundPressureIfNeeded() {
	const pressure = getDifficulty().roundPressure;

	if (pressure.score === 0 && pressure.water === 0 && pressure.health === 0 && pressure.education === 0 && pressure.economy === 0) {
		return "";
	}

	// This keeps Hard mode tough in a predictable way instead of random spikes.
	applyEffects(pressure);

	return " Hard mode pressure: system strain caused -2 health, -2 economy, -1 water, and -1 score.";
}

function didPlayerLose() {
	return gameState.water <= 0 || gameState.health <= 0 || gameState.economy <= 0;
}

function didPlayerReachGoal() {
	return gameState.score >= getDifficulty().goalScore;
}

function moveToNextRoundOrEnd() {
	if (didPlayerLose()) {
		endGame(false);
		return;
	}

	const isFinalRound = gameState.roundIndex === rounds.length - 1;

	if (isFinalRound) {
		endGame(didPlayerReachGoal());
		return;
	}

	gameState.roundIndex += 1;
	renderRound();
	startRoundTimer();
}

function endGame(playerWon) {
	gameState.gameOver = true;
	stopRoundTimer();
	finalScoreValue.textContent = gameState.score;
	impactSummary.textContent = `Estimated people with improved water access: ${gameState.peopleReached}. Final access level: ${gameState.accessPercent}%. Goal score for ${getDifficulty().label}: ${getDifficulty().goalScore}.`;

	if (playerWon) {
		endTitle.textContent = "Mission Success";
		endMessage.textContent = "Your team protected clean water access through every challenge and strengthened long-term systems.";
		launchConfetti();
	} else {
		endTitle.textContent = "Mission Incomplete";
		endMessage.textContent = "The community faced major setbacks, but every lesson can improve the next response.";
	}

	setScreen("end");
}

function handleTimeout() {
	if (gameState.gameOver) {
		return;
	}

	stopRoundTimer();
	applyEffects(getDifficulty().timeoutPenalty);
	gameState.streak = 0;
	gameState.peopleReached = Math.max(0, gameState.peopleReached - 15);
	updateStreakBadge();

	setFeedback("Time ran out. The delay hurt water access this round.", "failure");
	addActivityItem("Time expired: the team reacted late and lost ground.");
	renderStats();
	moveToNextRoundOrEnd();
}

function handleChoice(choiceKey) {
	if (gameState.gameOver) {
		return;
	}

	if (!choiceKey) {
		return;
	}

	stopRoundTimer();

	const currentRound = rounds[gameState.roundIndex];
	const chosenOption = currentRound[choiceKey];

	applyEffects(chosenOption.effects);
	updateImpactFromChoice(chosenOption);
	const obstacleText = applyObstacleIfNeeded(currentRound);
	const pressureText = applyRoundPressureIfNeeded();
	updateAccessPercent();

	if (chosenOption.effects.score >= 0) {
		setFeedback(`${chosenOption.message}${obstacleText}${pressureText} Streak bonus: +${gameState.streak} score.`, "success");
		addActivityItem(`Round ${gameState.roundIndex + 1}: Positive action increased impact.`);
	} else {
		setFeedback(`${chosenOption.message}${obstacleText}${pressureText}`, "failure");
		addActivityItem(`Round ${gameState.roundIndex + 1}: Short-term choice reduced impact.`);
	}

	checkMilestones();
	updateStreakBadge();
	renderStats();
	moveToNextRoundOrEnd();
}


function resetGameState(difficultyKey) {
	gameState = { ...initialState };
	gameState.difficultyKey = difficultyKey;
	gameState.secondsLeft = difficultySettings[difficultyKey].roundTime;
	reachedMilestones = [];
	activityLog.innerHTML = "";
	milestoneMessage.classList.add("hidden");
	updateStreakBadge();
	updateAccessPercent();
	renderStats();
	renderRound();
	setFeedback("Pick the action that protects long-term clean water access.", "neutral");
	addActivityItem(`Mode selected: ${difficultySettings[difficultyKey].label}. Reach ${difficultySettings[difficultyKey].goalScore} points to win.`);
}

function startGame() {
	resetGameState(difficultySelect.value);
	setScreen("game");
	startRoundTimer();
}

function resetToStart() {
	stopRoundTimer();
	resetGameState(difficultySelect.value);
	setScreen("start");
}

function launchConfetti() {
	confettiContainer.innerHTML = "";
	const colors = ["#ffc907", "#77a8bb", "#4fcb53", "#ff902a", "#f16061"];

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

for (const button of choiceButtons) {
	button.addEventListener("click", () => {
		handleChoice(button.dataset.choiceKey);
	});
}

resetBtn.addEventListener("click", resetToStart);
playAgainBtn.addEventListener("click", startGame);

// Start on the intro screen.
setScreen("start");
