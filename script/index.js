// প্রতিটি lesson-এ lesson-এর নাম এবং ইংরেজি শব্দ, বাংলা অর্থ ও উদাহরণ থাকে।
const lessons = [
  {
    id: 1,
    title: "Lesson 1",
    words: [
      {
        word: "Abandon",
        meaning: "ত্যাগ করা",
        example: "He abandoned the old house.",
      },
      {
        word: "Ability",
        meaning: "ক্ষমতা",
        example: "She has the ability to learn quickly.",
      },
      {
        word: "Brave",
        meaning: "সাহসী",
        example: "The brave boy helped the child.",
      },
      {
        word: "Curious",
        meaning: "কৌতূহলী",
        example: "The curious student asked many questions.",
      },
      {
        word: "Discover",
        meaning: "আবিষ্কার করা",
        example: "We discovered a new way to learn.",
      },
    ],
  },
  {
    id: 2,
    title: "Lesson 2",
    words: [
      { word: "Calm", meaning: "শান্ত", example: "Please stay calm." },
      {
        word: "Create",
        meaning: "সৃষ্টি করা",
        example: "They create useful things.",
      },
      {
        word: "Decide",
        meaning: "সিদ্ধান্ত নেওয়া",
        example: "I decided to study English.",
      },
      {
        word: "Effort",
        meaning: "চেষ্টা",
        example: "Your effort will bring success.",
      },
      {
        word: "Friendly",
        meaning: "বন্ধুসুলভ",
        example: "Our new teacher is friendly.",
      },
    ],
  },
  {
    id: 3,
    title: "Lesson 3",
    words: [
      { word: "Eager", meaning: "আগ্রহী", example: "He is eager to learn." },
      { word: "Famous", meaning: "বিখ্যাত", example: "He is a famous writer." },
      {
        word: "Improve",
        meaning: "উন্নতি করা",
        example: "Practice will improve your English.",
      },
      {
        word: "Journey",
        meaning: "যাত্রা",
        example: "Learning is a lifelong journey.",
      },
      {
        word: "Kindness",
        meaning: "দয়া",
        example: "Kindness makes the world better.",
      },
    ],
  },
  {
    id: 4,
    title: "Everyday English",
    words: [
      {
        word: "Arrive",
        meaning: "পৌঁছানো",
        example: "We arrive at school before nine.",
      },
      {
        word: "Borrow",
        meaning: "ধার নেওয়া",
        example: "May I borrow your pen?",
      },
      {
        word: "Choose",
        meaning: "বেছে নেওয়া",
        example: "Choose a book you enjoy.",
      },
      {
        word: "Explain",
        meaning: "ব্যাখ্যা করা",
        example: "Can you explain this word?",
      },
      {
        word: "Quiet",
        meaning: "নীরব",
        example: "The library is quiet in the morning.",
      },
    ],
  },
  {
    id: 5,
    title: "At work & school",
    words: [
      {
        word: "Attend",
        meaning: "উপস্থিত থাকা",
        example: "I attend an English class on Monday.",
      },
      {
        word: "Complete",
        meaning: "সম্পন্ন করা",
        example: "She completed her homework early.",
      },
      {
        word: "Discuss",
        meaning: "আলোচনা করা",
        example: "We discuss our ideas together.",
      },
      {
        word: "Prepare",
        meaning: "প্রস্তুতি নেওয়া",
        example: "He prepared for the interview.",
      },
      {
        word: "Result",
        meaning: "ফলাফল",
        example: "Her hard work brought a good result.",
      },
    ],
  },
  {
    id: 6,
    title: "Feelings & ideas",
    words: [
      {
        word: "Confident",
        meaning: "আত্মবিশ্বাসী",
        example: "Practice makes me feel confident.",
      },
      {
        word: "Gentle",
        meaning: "কোমল",
        example: "She gave the dog a gentle pat.",
      },
      {
        word: "Honest",
        meaning: "সৎ",
        example: "An honest answer builds trust.",
      },
      {
        word: "Patient",
        meaning: "ধৈর্যশীল",
        example: "Be patient while you learn.",
      },
      {
        word: "Wonder",
        meaning: "বিস্মিত হওয়া",
        example: "I wonder how this machine works.",
      },
    ],
  },
  {
    id: 7,
    title: "Travel & places",
    words: [
      {
        word: "Explore",
        meaning: "অন্বেষণ করা",
        example: "We explored the old town on foot.",
      },
      {
        word: "Guide",
        meaning: "পথপ্রদর্শক",
        example: "Our guide showed us the museum.",
      },
      {
        word: "Local",
        meaning: "স্থানীয়",
        example: "We tried a local dish in the village.",
      },
      {
        word: "Route",
        meaning: "পথ",
        example: "This route takes us to the river.",
      },
      {
        word: "Transport",
        meaning: "যাতায়াত",
        example: "Public transport is easy to find here.",
      },
    ],
  },
  {
    id: 8,
    title: "Food & cooking",
    words: [
      {
        word: "Boil",
        meaning: "সিদ্ধ করা",
        example: "Boil the water before making tea.",
      },
      {
        word: "Delicious",
        meaning: "সুস্বাদু",
        example: "The soup smells delicious.",
      },
      {
        word: "Ingredient",
        meaning: "উপকরণ",
        example: "Fresh vegetables are the main ingredient.",
      },
      {
        word: "Recipe",
        meaning: "রান্নার পদ্ধতি",
        example: "I found a simple recipe for bread.",
      },
      {
        word: "Serve",
        meaning: "পরিবেশন করা",
        example: "They serve lunch at one o'clock.",
      },
    ],
  },
  {
    id: 9,
    title: "Nature & weather",
    words: [
      {
        word: "Breeze",
        meaning: "মৃদু বাতাস",
        example: "A cool breeze came through the window.",
      },
      {
        word: "Cloud",
        meaning: "মেঘ",
        example: "A dark cloud covered the sun.",
      },
      {
        word: "Forest",
        meaning: "অরণ্য",
        example: "Many birds live in the forest.",
      },
      {
        word: "Fresh",
        meaning: "তাজা",
        example: "We bought fresh fruit at the market.",
      },
      {
        word: "Season",
        meaning: "ঋতু",
        example: "Spring is my favourite season.",
      },
    ],
  },
  {
    id: 10,
    title: "Speak & connect",
    words: [
      {
        word: "Agree",
        meaning: "সম্মত হওয়া",
        example: "I agree with your idea.",
      },
      {
        word: "Describe",
        meaning: "বর্ণনা করা",
        example: "Please describe what you saw.",
      },
      {
        word: "Invite",
        meaning: "আমন্ত্রণ জানানো",
        example: "We will invite our neighbours to dinner.",
      },
      {
        word: "Mention",
        meaning: "উল্লেখ করা",
        example: "She forgot to mention the meeting.",
      },
      {
        word: "Reply",
        meaning: "জবাব দেওয়া",
        example: "Please reply to my message.",
      },
    ],
  },
  {
    id: 11,
    title: "Goals & growth",
    words: [
      {
        word: "Achieve",
        meaning: "অর্জন করা",
        example: "You can achieve your goal with practice.",
      },
      {
        word: "Challenge",
        meaning: "প্রতিদ্বন্দ্বিতা",
        example: "Learning a new skill is a fun challenge.",
      },
      {
        word: "Focus",
        meaning: "মনোযোগ দেওয়া",
        example: "Try to focus on one task at a time.",
      },
      {
        word: "Goal",
        meaning: "উদ্দেশ্য",
        example: "My goal is to speak English clearly.",
      },
      {
        word: "Success",
        meaning: "সাফল্য",
        example: "Small habits can lead to success.",
      },
    ],
  },
  {
    id: 12,
    title: "Time & routines",
    words: [
      {
        word: "Continue",
        meaning: "চালিয়ে যাওয়া",
        example: "Continue reading for ten minutes.",
      },
      {
        word: "Early",
        meaning: "আগেভাগে",
        example: "He wakes up early every morning.",
      },
      {
        word: "Habit",
        meaning: "অভ্যাস",
        example: "Reading is a helpful habit.",
      },
      {
        word: "Regular",
        meaning: "নিয়মিত",
        example: "Regular practice builds confidence.",
      },
      {
        word: "Schedule",
        meaning: "সময়সূচি",
        example: "I wrote my lessons in a schedule.",
      },
    ],
  },
];

// পৃষ্ঠার প্রয়োজনীয় element এবং বর্তমান lesson, filter ও search-এর অবস্থা রাখা হয়।
const levelContainer = document.getElementById("level-container");
const wordContainer = document.getElementById("word-container");
const savedContainer = document.getElementById("saved-container");
const searchInput = document.getElementById("input-search");
const searchButton = document.getElementById("btn-search");
const clearSearchButton = document.getElementById("clear-search");
const filterButtons = document.querySelectorAll("[data-filter]");
const resultsCount = document.getElementById("results-count");
const randomWordButton = document.getElementById("random-word");
const spinner = document.getElementById("spinner");
const detailsContainer = document.getElementById("details-container");
const allWords = lessons.flatMap((lesson) => lesson.words);
let visibleWords = [];
let quizWord = null;
let quizOptions = [];
let sourceWords = allWords;
let activeFilter = "all";
let searchQuery = "";

// browser localStorage থেকে শেখা/সংরক্ষিত শব্দ নিরাপদে পড়া ও লেখা হয়।
function getWordList(storageKey) {
  try {
    const words = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(words) ? words : [];
  } catch {
    return [];
  }
}

function setWordList(storageKey, words) {
  localStorage.setItem(storageKey, JSON.stringify(words));
}

// dashboard-এর শব্দের হিসাব, দৈনিক লক্ষ্য, streak ও quiz score হালনাগাদ করে।
function updateProgress() {
  const learnedWords = getWordList("learnedWords");
  const savedWords = getWordList("savedWords");
  const percent = Math.min(
    100,
    Math.round((learnedWords.length / allWords.length) * 100),
  );
  const todayWords = getTodayLearnedWords();

  document.getElementById("stat-learned").textContent = learnedWords.length;
  document.getElementById("stat-total").textContent = allWords.length;
  document.getElementById("stat-saved").textContent = savedWords.length;
  document.getElementById("learning-progress").value = percent;
  document.getElementById("progress-label").textContent = `${percent}%`;
  document.getElementById("goal-count").textContent = Math.min(
    todayWords.length,
    5,
  );
  document.getElementById("streak-count").textContent = getCurrentStreak();
  document.getElementById("quiz-score").textContent =
    localStorage.getItem("quizScore") || "0";
  document.getElementById("quiz-round").textContent =
    localStorage.getItem("quizRound") || "0";
}

// স্থানীয় তারিখ ধরে দৈনিক শেখা ও ধারাবাহিক দিনের হিসাব করা হয়।
function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayLearnedWords() {
  const today = getDateKey();
  if (localStorage.getItem("todayLearnedDate") !== today) {
    localStorage.setItem("todayLearnedDate", today);
    localStorage.setItem("todayLearnedWords", "[]");
  }
  return getWordList("todayLearnedWords");
}

function getCurrentStreak() {
  const lastActive = localStorage.getItem("lastLearningDate");
  if (!lastActive) return 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastActive !== getDateKey() && lastActive !== getDateKey(yesterday)) {
    localStorage.setItem("learningStreak", "0");
    return 0;
  }
  return Number(localStorage.getItem("learningStreak") || 0);
}

function recordLearningActivity(word) {
  const today = getDateKey();
  const lastActive = localStorage.getItem("lastLearningDate");
  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const streak =
      lastActive === getDateKey(yesterday)
        ? Number(localStorage.getItem("learningStreak") || 0) + 1
        : 1;
    localStorage.setItem("learningStreak", String(streak));
    localStorage.setItem("lastLearningDate", today);
  }
  const todayWords = getTodayLearnedWords();
  if (!todayWords.includes(word))
    setWordList("todayLearnedWords", [...todayWords, word]);
}

// সংরক্ষিত শব্দের card দেখায় এবং তালিকা বদলালে তা আবার আঁকে।
function renderSavedWords() {
  const savedWords = getWordList("savedWords");
  const savedItems = allWords.filter((item) => savedWords.includes(item.word));

  if (!savedItems.length) {
    savedContainer.innerHTML = `
      <p class="font-bangla text-slate-500 col-span-full border-y border-slate-200 py-6">
        এখনো কোনো শব্দ save করা হয়নি। Lesson থেকে শব্দ save করলে এখানে দেখা যাবে।
      </p>
    `;
    return;
  }

  savedContainer.innerHTML = savedItems
    .map((item) => renderWordCard(item))
    .join("");
}

function toggleWordList(storageKey, word) {
  const words = getWordList(storageKey);
  if (storageKey === "learnedWords" && !words.includes(word))
    recordLearningActivity(word);
  const updatedWords = words.includes(word)
    ? words.filter((savedWord) => savedWord !== word)
    : [...words, word];

  setWordList(storageKey, updatedWords);
  renderSavedWords();
  updateProgress();
  renderFilteredWords();
  renderDailyWord();
}

// lesson, search ও saved list-এ ব্যবহারের জন্য একটি শব্দের card তৈরি করে।
function renderWordCard(item) {
  const saved = getWordList("savedWords").includes(item.word);
  const learned = getWordList("learnedWords").includes(item.word);
  const safeWord = escapeHtml(item.word);

  return `
    <article class="word-card">
      <h3>${item.word}</h3><button class="grid size-[30px] place-items-center rounded-full border border-[#dce5db] bg-white text-[#173f36] transition hover:border-[#173f36] hover:bg-[#edf3e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64]" type="button" data-word-action="speak" data-word="${safeWord}" aria-label="Hear ${safeWord}" title="Hear pronunciation"><i class="fa-solid fa-volume-high"></i></button>
      <p class="font-bangla word-meaning">${item.meaning}</p>
      <p class="word-example">${item.example}</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <button type="button" class="inline-flex min-h-[33px] items-center justify-center gap-2 rounded border px-3 text-[11px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64] ${saved ? "border-[#a6cbb1] bg-[#e7f2e9] text-[#245c38] hover:border-[#75a986] hover:bg-[#d8ebdc]" : "border-[#b9c8bd] bg-white text-[#173f36] hover:border-[#173f36] hover:bg-[#edf3e9]"}" data-word-action="save" data-word="${safeWord}" aria-pressed="${saved}">
          <i class="fa-solid fa-bookmark"></i> ${saved ? "Saved" : "Save for review"}
        </button>
        <button type="button" class="inline-flex min-h-[33px] items-center justify-center gap-2 rounded border px-3 text-[11px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64] ${learned ? "border-[#a6cbb1] bg-[#e7f2e9] text-[#245c38] hover:border-[#75a986] hover:bg-[#d8ebdc]" : "border-transparent bg-transparent text-[#45574c] hover:border-[#dce5d8] hover:bg-[#eaf0e7]"}" data-word-action="learn" data-word="${safeWord}" aria-pressed="${learned}">
          <i class="fa-solid fa-check"></i> ${learned ? "Learned" : "Mark learned"}
        </button>
      </div>
      <button type="button" class="mt-3 inline-flex min-h-[33px] items-center justify-center gap-2 rounded border border-[#173f36] bg-[#173f36] px-3 text-[11px] font-semibold text-white shadow-sm transition hover:-translate-y-px hover:border-[#27584b] hover:bg-[#27584b] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64]" data-word-action="details" data-word="${safeWord}">
        Details
      </button>
    </article>
  `;
}

// আজকের শব্দ দেখায় এবং button-টি শেখা শব্দের তালিকার সঙ্গে যুক্ত করে।
function renderDailyWord() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  const item = allWords[dayNumber % allWords.length];
  const learned = getWordList("learnedWords").includes(item.word);

  document.getElementById("daily-word").textContent = item.word;
  document.getElementById("daily-meaning").textContent = item.meaning;
  document.getElementById("daily-example").textContent = item.example;
  document.getElementById("daily-learned").innerHTML = learned
    ? '<i class="fa-solid fa-check"></i> Learned'
    : '<i class="fa-solid fa-check"></i> Mark as learned';
  document.getElementById("daily-learned").disabled = learned;
  document.getElementById("daily-learned").onclick = () => {
    if (!getWordList("learnedWords").includes(item.word))
      toggleWordList("learnedWords", item.word);
  };
}

// browser-এর speech synthesis দিয়ে ইংরেজি শব্দটি উচ্চারণ করে শোনায়।
function speakWord(word) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

// একটি শব্দ বেছে quiz প্রশ্ন ও তার উত্তরগুলোর button তৈরি করে।
function startPractice() {
  quizWord = allWords[Math.floor(Math.random() * allWords.length)];
  quizOptions = [quizWord.meaning];

  while (quizOptions.length < Math.min(4, allWords.length)) {
    const meaning =
      allWords[Math.floor(Math.random() * allWords.length)].meaning;
    if (!quizOptions.includes(meaning)) quizOptions.push(meaning);
  }

  quizOptions.sort(() => Math.random() - 0.5);
  document.getElementById("quiz-word").textContent = quizWord.word;
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-options").innerHTML = quizOptions
    .map(
      (meaning, index) => `
    <button type="button" class="inline-flex min-h-[46px] items-center justify-start rounded border border-[#dfe5db] bg-white px-4 text-left text-sm text-[#38483f] transition hover:border-[#173f36] hover:bg-[#f3f7ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64] disabled:cursor-default disabled:opacity-100 font-bangla" data-answer="${index}">${meaning}</button>
  `,
    )
    .join("");
  document.getElementById("quiz-start").classList.add("hidden");
  document.getElementById("quiz-next").classList.add("hidden");

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener(
      "click",
      () => checkAnswer(Number(button.dataset.answer)),
      { once: true },
    );
  });
}

// নির্বাচিত উত্তর যাচাই করে score ও সঠিক/ভুলের বার্তা দেখায়।
function checkAnswer(selectedIndex) {
  const isCorrect = quizOptions[selectedIndex] === quizWord.meaning;
  const answered = Number(localStorage.getItem("quizRound") || 0) + 1;
  const score =
    Number(localStorage.getItem("quizScore") || 0) + Number(isCorrect);
  localStorage.setItem("quizRound", String(answered));
  localStorage.setItem("quizScore", String(score));
  updateProgress();
  const feedback = document.getElementById("quiz-feedback");
  feedback.textContent = isCorrect
    ? "সঠিক উত্তর! খুব ভালো।"
    : `উত্তরটি ঠিক হয়নি। সঠিক অর্থ: ${quizWord.meaning}`;
  feedback.className = `font-bangla mt-4 min-h-6 ${isCorrect ? "text-emerald-700" : "text-rose-700"}`;
  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.disabled = true;
    if (button.textContent === quizWord.meaning) {
      button.classList.add(
        "border-[#3b8060]",
        "bg-[#e8f4eb]",
        "text-[#20573a]",
      );
    } else if (Number(button.dataset.answer) === selectedIndex) {
      button.classList.add(
        "border-[#d16c58]",
        "bg-[#fff0eb]",
        "text-[#9b4536]",
      );
    }
  });
  document.getElementById("quiz-next").classList.remove("hidden");
}

// lesson তালিকা থেকে lesson বেছে নেওয়ার button তৈরি করে।
function renderLessons() {
  levelContainer.innerHTML = [
    `<button type="button" aria-pressed="false" class="inline-flex min-h-10 items-center justify-center rounded border border-[#d8e0d4] bg-white px-4 text-xs font-semibold text-[#45564c] shadow-sm transition hover:border-[#173f36] hover:bg-[#173f36] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64]" data-lesson="all">All ${allWords.length} words</button>`,
    ...lessons.map(
      (lesson) =>
        `<button type="button" aria-pressed="false" class="inline-flex min-h-10 items-center justify-center rounded border border-[#d8e0d4] bg-white px-4 text-xs font-semibold text-[#45564c] shadow-sm transition hover:border-[#173f36] hover:bg-[#173f36] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64]" data-lesson="${lesson.id}">${lesson.title}</button>`,
    ),
  ].join("");
  levelContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lesson]");
    if (button) selectLesson(button.dataset.lesson);
  });
}

// নির্বাচিত lesson-এর শব্দ দেখায় এবং সেই lesson button-কে চিহ্নিত করে।
function selectLesson(id) {
  const lesson =
    id === "all" ? null : lessons.find((item) => item.id === Number(id));
  if (id !== "all" && !lesson) return;

  sourceWords = lesson ? lesson.words : allWords;
  searchQuery = "";
  searchInput.value = "";
  clearSearchButton.classList.add("hidden");
  document
    .querySelectorAll("#level-container [data-lesson]")
    .forEach((button) => {
      const isActive = button.dataset.lesson === String(id);
      button.classList.toggle("active", isActive);
      button.classList.toggle("border-[#173f36]", isActive);
      button.classList.toggle("bg-[#173f36]", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle("shadow-md", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  renderFilteredWords();
}

function renderWords(words) {
  sourceWords = words;
  renderFilteredWords();
}

// card দেখানোর আগে search ও saved/unlearned filter প্রয়োগ করে।
function renderFilteredWords() {
  const savedWords = getWordList("savedWords");
  const learnedWords = getWordList("learnedWords");
  visibleWords = sourceWords.filter((item) => {
    const matchesQuery =
      !searchQuery ||
      item.word.toLocaleLowerCase().includes(searchQuery) ||
      item.meaning.toLocaleLowerCase().includes(searchQuery);
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unlearned" && !learnedWords.includes(item.word)) ||
      (activeFilter === "saved" && savedWords.includes(item.word));
    return matchesQuery && matchesFilter;
  });

  resultsCount.textContent = `${visibleWords.length} ${visibleWords.length === 1 ? "word" : "words"}`;
  if (!visibleWords.length) {
    wordContainer.innerHTML = `
      <div class="empty-results col-span-full font-bangla">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>এই filter-এ কোনো শব্দ পাওয়া যায়নি।</p>
        <button type="button" class="inline-flex min-h-10 items-center justify-center rounded border border-[#173f36] bg-[#173f36] px-4 text-xs font-bold text-white shadow-sm transition hover:-translate-y-px hover:border-[#27584b] hover:bg-[#27584b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1dd64]" data-reset-vocabulary>সব শব্দ দেখুন</button>
      </div>
    `;
    return;
  }
  wordContainer.innerHTML = visibleWords
    .map((item) => renderWordCard(item))
    .join("");
}

// শব্দের বিস্তারিত dialog-এ তথ্য বসিয়ে সেটি খোলে।
function showDetails(word, meaning, example) {
  const heading = document.createElement("h2");
  heading.className = "text-3xl font-bold";
  heading.textContent = word;
  const meaningText = document.createElement("p");
  meaningText.className = "font-bangla text-xl";
  meaningText.textContent = `Meaning: ${meaning}`;
  const exampleText = document.createElement("p");
  exampleText.textContent = `Example: ${example}`;
  detailsContainer.replaceChildren(heading, meaningText, exampleText);
  document.getElementById("word_modal").showModal();
}

// সব lesson-এ ইংরেজি শব্দ বা বাংলা অর্থ খোঁজে।
function searchVocabulary() {
  sourceWords = allWords;
  searchQuery = searchInput.value.trim().toLocaleLowerCase();
  clearSearchButton.classList.toggle("hidden", !searchQuery);
  document
    .querySelectorAll("#level-container [data-lesson]")
    .forEach((button) => {
      const isActive = button.dataset.lesson === "all" && !searchQuery;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  renderFilteredWords();
}

// filter ও lesson reset করে সব শব্দ আবার দেখায়।
function resetVocabulary() {
  activeFilter = "all";
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === "all";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  selectLesson("all");
}

// HTML attribute-এ বসানোর আগে text-এর বিশেষ character escape করে।
function escapeHtml(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

// search, filter, card ও mobile navigation-এর event handler যুক্ত করে।
function wireVocabularyControls() {
  searchInput.addEventListener("input", searchVocabulary);
  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    searchVocabulary();
    searchInput.focus();
  });
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      renderFilteredWords();
    });
  });
  wordContainer.addEventListener("click", (event) => {
    if (event.target.closest("[data-reset-vocabulary]")) resetVocabulary();
    else handleWordAction(event);
  });
  savedContainer.addEventListener("click", handleWordAction);
  randomWordButton.addEventListener("click", () => {
    const choices = visibleWords.length ? visibleWords : allWords;
    const item = choices[Math.floor(Math.random() * choices.length)];
    showDetails(item.word, item.meaning, item.example);
  });
  const mobileMenuButton = document.querySelector(
    "[aria-controls='mobile-navigation']",
  );
  const mobileMenu = document.getElementById("mobile-navigation");
  const setMobileMenuOpen = (isOpen) => {
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
    mobileMenu.classList.toggle("is-open", isOpen);
  };
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
    setMobileMenuOpen(!isOpen);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobileMenuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMobileMenuOpen(false);
      mobileMenuButton.blur();
    }
  });
  document.addEventListener("click", (event) => {
    if (!mobileMenuButton.parentElement.contains(event.target)) {
      setMobileMenuOpen(false);
    }
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuOpen(false));
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
    setMobileMenuOpen(false);
  });
}

// card-এ click হলে pronunciation, save, learn বা details action চালায়।
function handleWordAction(event) {
  const button = event.target.closest("[data-word-action]");
  if (!button) return;
  const item = allWords.find((word) => word.word === button.dataset.word);
  if (!item) return;

  switch (button.dataset.wordAction) {
    case "speak":
      speakWord(item.word);
      break;
    case "save":
      toggleWordList("savedWords", item.word);
      break;
    case "learn":
      toggleWordList("learnedWords", item.word);
      break;
    case "details":
      showDetails(item.word, item.meaning, item.example);
      break;
  }
}

searchButton.addEventListener("click", searchVocabulary);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchVocabulary();
  }
});

// active API session বন্ধ করে login পাতায় ফিরিয়ে নেয়।
async function logout() {
  try {
    await window.EnglishSikhoAuth.signOut();
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout করা যায়নি। আবার চেষ্টা করুন।");
    return;
  }
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accountId");
  localStorage.removeItem("username");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");
  window.location.replace("login.html");
}

// page element ও lesson data প্রস্তুত হলে dashboard চালু করে।
const learnerName =
  localStorage.getItem("fullName") ||
  localStorage.getItem("username") ||
  "Learner";
document.getElementById("learner-name").textContent = learnerName;
document.getElementById("quiz-start").addEventListener("click", startPractice);
document.getElementById("quiz-next").addEventListener("click", startPractice);

updateProgress();
renderSavedWords();
renderDailyWord();
renderLessons();
selectLesson("all");
wireVocabularyControls();
