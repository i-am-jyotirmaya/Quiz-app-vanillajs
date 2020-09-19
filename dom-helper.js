// Reference decalrations
const question = /**@type{HTMLHeadingElement} */(document.getElementById('question-txt'));
const ansul = /**@type{HTMLUListElement} */(document.getElementById('ans-ul'));
const btnPrev = /**@type{HTMLButtonElement} */(document.querySelector('.q-prev'));
const btnNext = /**@type{HTMLButtonElement} */(document.querySelector('.q-next'));
const btnSubmit = /**@type{HTMLButtonElement} */(document.querySelector('.q-submit'));
const appName = document.getElementById('app-name');
const ddlCategory = /**@type{HTMLSelectElement} */(document.getElementById('sel-category'));
const ddlDifficulty = /**@type{HTMLSelectElement} */(document.getElementById('sel-difficulty'));
const ddlType = /**@type{HTMLSelectElement} */(document.getElementById('sel-type'));
const txtAmount = /**@type{HTMLInputElement} */(document.getElementById('inp-amount'));

// Methods
const initializeCategories = async (/**@type{HTMLSelectElement} */ ddl) => {
    const categories = await quizService.getCategories();
    if(categories) {
        categories.trivia_categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.innerText = cat.name;
            
            ddl.appendChild(option);
        });
        return 1;
    }
    return 0;
}

const switchToQuiz = () => {
    const cp = document.querySelector('.control-panel');
    const quiz = document.querySelector('.quiz');
    cp.style.display = "none";
    quiz.style.display = "grid";
    appName.classList.replace('app-header', 'quiz-header');
}

const saveQuizResponse = (questionObj) => {
    let ans = '';
    let id = 0;
    if(ansul.querySelector('input[type=radio][name=ans]:checked+label')) {
        ans = ansul.querySelector('input[type=radio][name=ans]:checked+label').innerText;
        id = +ansul.querySelector('input[type=radio][name=ans]:checked').id;
        ans = ans.substring(ans.indexOf(".") + 2);
        questionObj.isAnswered = true;
        questionObj.answer.id = id;
        questionObj.answer.value = ans;
        if(ans === questionObj.correct_answer)
            questionObj.isCorrect = true;
        return true;
    } else {
        alert('You cannot proceed without filling the answer!');
        return false;
    }
}

const setQuestionData = (questionObj, isFirst, isLast) => {

    if(isFirst) {
        btnPrev.style.display = "none";
    } else if (isLast) {
        btnPrev.style.removeProperty("display");
        btnSubmit.style.removeProperty("display");
        btnNext.style.display = "none";
    } else {
        btnPrev.style.removeProperty("display");
        btnNext.style.removeProperty("display");
    }

    question.innerText = `Q${+questionObj.serial+1}. ${questionObj.question}`;
    ansul.innerHTML='';
    if(ansul.querySelector('input[type=radio][name=ans]:checked')) {
        ansul.querySelector('input[type=radio][name=ans]:checked').checked = false;
    }
    questionObj.answers.forEach((ans, index) => {
        ansul.appendChild(createOption(ans, index));
    });

    if(questionObj.isAnswered) {
        ansul.querySelector(`input[type=radio][id="${questionObj.answer.id}"]`).checked = true;
    }
}

const createOption = (value, id) => {
    const html = `<li>
                    <span>
                        <input type="radio" name="ans" id="${id}">
                        <label for="${id}">${+id+1}. ${value}</label>
                    </span>
                </li>`;
    return parseFromString(html);
}

const parseFromString = (html) => {
    const parser = new DOMParser();
    const ele = parser.parseFromString(html, 'text/html');
    return ele.body;
}

const resetQuiz = () => {
    const cp = document.querySelector('.control-panel');
    const quiz = document.querySelector('.quiz');
    cp.style.display = "block";
    quiz.style.display = "none";
    ddlCategory.value = "";
    ddlDifficulty.value = "";
    ddlType.value = "";
    txtAmount.value = "";
    appName.classList.replace('quiz-header', 'app-header');
}