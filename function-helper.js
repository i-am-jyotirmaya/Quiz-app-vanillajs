const allowOnlyNumbers = (event) => {
    var iKeyCode = (event.which) ? event.which : event.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;
    return true;
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const prepareQuestions = async (results) => {
    return results.map((e, index) => {
        let answers = [...e.incorrect_answers, e.correct_answer].map(e => atob(e));
        if(e.type === "multiple") shuffleArray(answers);
        return {
            answer: {id: 0, value: ''},
            answers: answers,
            category: atob(e.category),
            correct_answer: atob(e.correct_answer),
            difficulty: atob(e.difficulty),
            isCorrect: false,
            isAnswered: false,
            question: atob(e.question),
            serial: index,
            type: atob(e.type),
        }
    })
}

const errorHandler = (errorCode) => {
    switch (errorCode) {
        case "1":
            alert('Not Enough questions! Did you check the notification for the number of questions❓');
            break;
        case "2":
            alert('Invalid Paramter passed! (Report to the developer 😅)');
            break;
        case "3":
            alert('Token not set! Try to reload the site... 🔁');
            break;
        case "4":
            alert("All questions exhausted for the selected category 💔. Please reset the token.");
            break;
        default:
            if(errorCode)
                alert(`An error occured with error code ${errorCode}`);
            else
                alert("An Internal error Occurred! (Not sure exactly...😕)")
            break;
    }
}

const getSessionToken = async () => {
    const quizService = new QuizService();
    let token = '';
    if (!sessionStorage.getItem('token')) {
        token = (await quizService.getSessionToken()).token;
        sessionStorage.setItem('token', token);
    } else {
        token = sessionStorage.getItem('token');
    }

    return token;
}