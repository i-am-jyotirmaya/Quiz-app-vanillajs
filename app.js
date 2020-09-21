const quizService = new QuizService();
showLoader();

const btnLaunchQuiz = /**@type{HTMLButtonElement} */(document.getElementById('launch-quiz'));
// const ddlCategory = /**@type{HTMLSelectElement} */(document.getElementById('sel-category'));
// const ddlDifficulty = /**@type{HTMLSelectElement} */(document.getElementById('sel-difficulty'));
// const ddlType = /**@type{HTMLSelectElement} */(document.getElementById('sel-type'));
// const txtAmount = /**@type{HTMLInputElement} */(document.getElementById('inp-amount'));
// const btnPrev = /**@type{HTMLButtonElement} */(document.querySelector('.q-prev'));
// const btnNext1 = /**@type{HTMLButtonElement} */(document.querySelector('.q-next'));
// const btnSubmit1 = /**@type{HTMLButtonElement} */(document.querySelector('.q-submit'));

let isQuizStarted = false;
const questionsArray = [];
let currentQuestion = 0;

// Initializing app
initializeCategories(ddlCategory);
// window.onpopstate = (e) => {
//     const ev = e || window.event;
//     console.log(ev);
//     ev.preventDefault();
//     if(isQuizStarted) {
//         if(confirm('You will lose your current progress in the quiz !')) {
//             ev.returnValue = '';
//         }
//     }
// }

//loading quiz
btnLaunchQuiz.onclick = (e) => {
    e.preventDefault();
    showLoader('Starting Quiz...')
    startQuiz();
}

async function startQuiz() {
    isQuizStarted = true;
    currentQuestion = 0;
    questionsArray.length = 0;
    // console.log(questionsArray);
    // console.log(isQuizStarted);
    updateLoader('Fetching session token...');
    let token = '';
    if (!sessionStorage.getItem('token')) {
        token = (await quizService.getSessionToken()).token;
        sessionStorage.setItem('token', token);
    } else {
        token = sessionStorage.getItem('token');
    }
    // console.log(token);
    updateLoader('Setting your preferences...');
    const url = quizService.createUrlObject();
    if(ddlCategory.value) {
        quizService.setCategory(url, +ddlCategory.value);
    }
    if(ddlType.value) {
        quizService.setType(url, ddlType.value);
    }
    if(ddlDifficulty.value) {
        quizService.setDifficulty(url, ddlDifficulty.value);
    }
    if(txtAmount.value) {
        quizService.setAmount(url, txtAmount.value);
    } else {
        quizService.setAmount(url, 10);
    }
    // console.log(url.href)
    const response = await quizService.sendRequest(url);
    // console.log(response);
    updateLoader('Preparing Quiz...');
    if(response.response_code === 0) {
        questionsArray.push(...(await prepareQuestions(response.results)));
        // console.log(questionsArray);
    }else if(response.response_code === 1) {
        alert('Not enough questions!');
        hideLoader();
        resetQuiz();
        return;
    }

    if(questionsArray.length) {
        setQuestionData(questionsArray[currentQuestion], true, false);
    }
    switchToQuiz();
    hideLoader();
}

btnPrev.onclick = () => {
    if(currentQuestion === 0) {
        alert('You are on the first Question!');
        return;
    }
    currentQuestion--;
    setQuestionData(questionsArray[currentQuestion], currentQuestion === 0 ? true : false, currentQuestion === questionsArray.length-1 ? true : false);
}

btnNext.onclick = () => {
    if(currentQuestion === questionsArray.length-1) {
        alert('You are on the last Question. Kindly submit');
        return;
    }
    if(!saveQuizResponse(questionsArray[currentQuestion])) return;
    // console.log(questionsArray[currentQuestion]);
    currentQuestion++;
    setQuestionData(questionsArray[currentQuestion], currentQuestion === 0 ? true : false, currentQuestion === questionsArray.length-1 ? true : false);
}

btnSubmit.onclick = () => {
    if(!saveQuizResponse(questionsArray[currentQuestion])) return;
    // let score = 0;
    // questionsArray.forEach(q => {
    //     if(q.isCorrect) {
    //         score++;
    //     }
    // });
    // alert(`Your score is ${score}`);
    showResults(questionsArray);
}

btnHome.onclick = () => {
    resetQuiz();
}