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
    return results.map(e => {
        let answers = [...e.incorrect_answers, e.correct_answer].map(e => atob(e));
        if(e.type === "multiple") shuffleArray(answers);
        return {
            answers: answers,
            category: atob(e.category),
            correct_answer: atob(e.correct_answer),
            difficulty: atob(e.difficulty),
            question: atob(e.question),
            type: atob(e.type),
            isCorrect: false,
            isAnswered: false,
            answer: {id: 0, value: ''}
        }
    })
}