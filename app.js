const quizService = new QuizService();

const btnLaunchQuiz = /**@type{HTMLButtonElement} */(document.getElementById('launch-quiz'));

let isQuizStarted = false;
const questionsArray = [];
let currentQuestion = 0;

// Initializing app
initializeCategories(ddlCategory);
fetchCountAndSetNotification();
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
    let token = await getSessionToken();
    // console.log(token);
    updateLoader('Setting your preferences...');
    const url = quizService.createUrlObject();
    if(ddlCategory.value) {
        quizService.setCategory(url, +ddlCategory.value);
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
    quizService.setSessionToken(url, token);
    const response = await quizService.sendRequest(url);
    // console.log(response);
    updateLoader('Preparing Quiz...');
    if(response.response_code === 0) {
        questionsArray.push(...(await prepareQuestions(response.results)));
        // console.log(questionsArray);
    } else {
        errorHandler(response.response_code.toString());
        resetQuiz();
        hideLoader();
        return;
    }

    if(questionsArray.length) {
        setQuestionData(questionsArray[currentQuestion], true, false);
        setQuestionNumberCounter(currentQuestion, questionsArray.length);
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
    setQuestionNumberCounter(currentQuestion, questionsArray.length);
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
    setQuestionNumberCounter(currentQuestion, questionsArray.length);
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

ddlCategory.onchange = async e => {
    fetchCountAndSetNotification(+e.target.value, e.target.selectedOptions[0].innerText);
    // console.log(e);
};

notifyBtn.onclick = () => {
    showNotificationBar();
}

document.querySelector('.cp-notification-close').addEventListener('click', () => {
    hideNotificationBar();
});

btnResetSession.onclick = async () => {
    showLoader('Resetting Session token for you...');
    const token = await getSessionToken();
    const isSuccess = await quizService.resetToken(token);
    if(isSuccess) {
        resetQuiz();
        hideLoader();
        return;
    }
    errorHandler('TFR');
    resetQuiz();
}

//registerting service worker
window.addEventListener('load', e => {
    // new PWAConfApp();
    registerServiceWorker();
});

async function registerServiceWorker() {
    if('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./serviceworker.js');
        } catch (e) {
            alert('Service Worker registration failed! Offline mode may not work.');
        }
    } else {
        // document.querySelector('.alert').removeAttribute('hidden');
    }
}