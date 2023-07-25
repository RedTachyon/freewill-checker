let n = 5;  // number of letters in the sequence
let letters: { letter: string, predictionCorrect: boolean }[] = Array(20).fill({ letter: 'X', predictionCorrect: false });
let allLetters: string[] = Array(n).fill('X');
let maxLimit = 20; // maximum length to display
let nGrams: { [sequence: string]: number } = {};
let lastSequence: string = 'X'.repeat(n);
let prediction: string | null = null;
let totalPredictions = 0;
let correctPredictions = 0;
let recentPredictions: boolean[] = [];

// Get a handle to the div with id 'container'
const container = document.getElementById('container') as HTMLElement;
// Get a handle to the span with id 'accuracy'
const accuracyDisplay = document.getElementById('accuracy') as HTMLElement;
const accuracyValue = document.getElementById('accuracy-value') as HTMLElement;
const accuracyLocalValue = document.getElementById('accuracy-val-local') as HTMLElement;

// Update the display based on the current letters array
function updateDisplay() {
  // Remove all current boxes
  while (container.firstChild) {
    container.firstChild.remove();
  }

  // Create a new box for each letter in the letters array
  letters.forEach(({ letter, predictionCorrect }, index) => {
    let box = document.createElement('div');
    box.className = 'box ' + letter;
    if (letter !== 'X') {
      box.className += predictionCorrect ? ' correct' : ' incorrect';
    }
    box.innerText = letter;
    container.appendChild(box);
  });

  // Update global accuracy
  if (totalPredictions === 0) {
    accuracyValue.innerText = '00.00%';
  } else {
    let accuracy = (correctPredictions / totalPredictions) * 100;
    accuracyValue.innerText = accuracy.toFixed(2) + '%';
  }

  // Update local accuracy
  if (recentPredictions.length === 0) {
    accuracyLocalValue.innerText = '00.00%';
  } else {
    let correctLast20 = recentPredictions.filter(x => x).length;
    let accuracyLocal = (correctLast20 / recentPredictions.length) * 100;
    accuracyLocalValue.innerText = accuracyLocal.toFixed(2) + '%';
  }
}

// Update the frequencies of n-grams
function updateNGrams(sequence: string) {
  if (sequence in nGrams) {
    nGrams[sequence]++;
  } else {
    nGrams[sequence] = 1;
  }
}

// Make a prediction based on the most frequent n-gram that starts with the current sequence
function makePrediction() {
  let fSequence = lastSequence + 'f';
  let dSequence = lastSequence + 'd';
  if (!(fSequence in nGrams)) nGrams[fSequence] = 0;
  if (!(dSequence in nGrams)) nGrams[dSequence] = 0;
  prediction = nGrams[fSequence] > nGrams[dSequence] ? 'f' : 'd';
}

// Listen for keypresses and add to letters array
window.addEventListener('keydown', (event) => {
  if (event.key === 'f' || event.key === 'd') {
    // Update total predictions and correct predictions
    totalPredictions++;
    let predictionCorrect = prediction === event.key;
    if (predictionCorrect) correctPredictions++;

    // Add prediction correctness to recentPredictions and remove oldest if size exceeds 20
    recentPredictions.push(predictionCorrect);
    if (recentPredictions.length > 20) {
      recentPredictions.shift();
    }

    // Add the letter to the end of the allLetters array
    allLetters.push(event.key);

    // Add the letter to the end of the letters array
    letters.push({ letter: event.key, predictionCorrect });

    // If the length of the allLetters array exceeds n, remove the first element and update nGrams
    if (allLetters.length > n) {
      updateNGrams(allLetters.slice(-n-1).join(''));
      allLetters.shift();
    }

    // If the length of the letters array exceeds the max limit, remove the first element
    if (letters.length > maxLimit) {
      letters.shift();
    }

    // Update lastSequence and make a prediction
    lastSequence = allLetters.join('');
    makePrediction();

    // Update the display
    updateDisplay();
  }
});

// Initialize the display
updateDisplay();
