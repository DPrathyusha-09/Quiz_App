// Quiz Questions Data - Add/modify questions here
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        difficulty: "easy"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        difficulty: "easy"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correct: 1,
        difficulty: "medium"
    },
    {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: 1,
        difficulty: "medium"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
        difficulty: "hard"
    },
    {
        question: "Which programming language was created by Guido van Rossum?",
        options: ["Java", "C++", "JavaScript", "Python"],
        correct: 3,
        difficulty: "hard"
    }
];

// Quiz State Management
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    questionNumber: document.getElementById('question-number'),
    totalQuestions: document.getElementById('total-questions'),
    currentScore: document.getElementById('current-score'),
    questionText: document.getElementById('question-text'),
    answerOptions: document.getElementById('answer-options'),
    submitBtn: document.getElementById('submit-answer'),
    feedback: document.getElementById('feedback'),
    feedbackText: document.getElementById('feedback-text'),
    nextBtn: document.getElementById('next-question'),
    finalScore: document.getElementById('final-score'),
    finalTotal: document.getElementById('final-total'),
    scoreMessage: document.getElementById('score-message'),
    restartBtn: document.getElementById('restart-btn')
};

// Initialize the quiz
function initializeQuiz() {
    // Set total questions count
    elements.totalQuestions.textContent = quizQuestions.length;
    elements.finalTotal.textContent = quizQuestions.length;
    
    // Add event listeners
    elements.startBtn.addEventListener('click', startQuiz);
    elements.submitBtn.addEventListener('click', submitAnswer);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.restartBtn.addEventListener('click', restartQuiz);
    
    // Initialize keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

// Show a specific screen and hide others
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Start the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    
    updateScoreDisplay();
    showScreen('quiz');
    displayCurrentQuestion();
}

// Display the current question and options
function displayCurrentQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Update question number and text
    elements.questionNumber.textContent = currentQuestionIndex + 1;
    elements.questionText.textContent = question.question;
    
    // Clear previous options
    elements.answerOptions.innerHTML = '';
    
    // Create radio button options for accessibility
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'quiz-option';
        radioInput.value = index;
        radioInput.id = `option-${index}`;
        
        const label = document.createElement('label');
        label.htmlFor = `option-${index}`;
        label.textContent = option;
        
        optionElement.appendChild(radioInput);
        optionElement.appendChild(label);
        
        // Add click event to the option container
        optionElement.addEventListener('click', () => selectOption(index, optionElement));
        
        elements.answerOptions.appendChild(optionElement);
    });
    
    // Reset UI state
    elements.submitBtn.disabled = true;
    elements.feedback.classList.add('hidden');
    selectedAnswer = null;
}

// Handle option selection
function selectOption(optionIndex, optionElement) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Mark current selection
    optionElement.classList.add('selected');
    optionElement.querySelector('input').checked = true;
    
    selectedAnswer = optionIndex;
    elements.submitBtn.disabled = false;
}

// Submit the selected answer
function submitAnswer() {
    if (selectedAnswer === null) return;
    
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    // Update score if correct
    if (isCorrect) {
        score++;
        updateScoreDisplay();
    }
    
    // Show feedback
    showFeedback(isCorrect, question.correct);
    
    // Disable submit button and option selection
    elements.submitBtn.disabled = true;
    document.querySelectorAll('.option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
}

// Display feedback for the answer
function showFeedback(isCorrect, correctIndex) {
    const question = quizQuestions[currentQuestionIndex];
    
    elements.feedback.classList.remove('hidden', 'correct', 'incorrect');
    elements.feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        elements.feedbackText.textContent = "Correct! Well done!";
    } else {
        elements.feedbackText.textContent = `Incorrect. The correct answer was: ${question.options[correctIndex]}`;
    }
    
    // Update button text for last question
    if (currentQuestionIndex === quizQuestions.length - 1) {
        elements.nextBtn.textContent = 'Show Results';
    } else {
        elements.nextBtn.textContent = 'Next Question';
    }
}

// Move to next question or show results
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
    } else {
        displayCurrentQuestion();
        // Re-enable option selection
        document.querySelectorAll('.option').forEach(opt => {
            opt.style.pointerEvents = 'auto';
        });
    }
}

// Show final results
function showResults() {
    elements.finalScore.textContent = score;
    
    // Generate encouraging message based on score
    const percentage = (score / quizQuestions.length) * 100;
    let message = "";
    
    if (percentage === 100) {
        message = "Perfect! You got everything right!";
    } else if (percentage >= 80) {
        message = "Excellent work! You really know your stuff!";
    } else if (percentage >= 60) {
        message = "Good job! You did well!";
    } else if (percentage >= 40) {
        message = "Not bad! Keep learning and try again!";
    } else {
        message = "Keep studying and try again! You can do better!";
    }
    
    elements.scoreMessage.textContent = message;
    showScreen('results');
}

// Update the score display
function updateScoreDisplay() {
    elements.currentScore.textContent = score;
}

// Restart the quiz
function restartQuiz() {
    showScreen('start');
}

// Keyboard navigation support
function handleKeyPress(event) {
    // Only handle keys when quiz screen is active
    if (!screens.quiz.classList.contains('active')) return;
    
    // Number keys 1-4 for option selection
    if (event.key >= '1' && event.key <= '4') {
        const optionIndex = parseInt(event.key) - 1;
        const options = document.querySelectorAll('.option');
        if (options[optionIndex]) {
            selectOption(optionIndex, options[optionIndex]);
        }
    }
    
    // Enter key to submit answer
    if (event.key === 'Enter') {
        if (!elements.submitBtn.disabled) {
            submitAnswer();
        } else if (!elements.feedback.classList.contains('hidden')) {
            nextQuestion();
        }
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeQuiz);
