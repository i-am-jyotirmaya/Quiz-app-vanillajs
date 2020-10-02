# Quiz-app-vanillajs
Quiz app created using vanilla js with :heart:. *Currently in Alpha.*

Live: [Click Here](https://i-am-jyotirmaya.github.io/Quiz-app-vanillajs/)

## About
This is a web application (not a PWA currently) made using vanilla JS. I have used just a single html page for the entire application.
It uses the free to use API from the [**Open Trivia Database**](https://www.opentdb.com).

It contains three main sections :
* Control Panel
* Quiz
* Results

### Control Panel
This is where the user will land upon opening the page. This is where the user will enter the required inputs for the quiz to start.
The user can leave a field blank for the default value to be used.

The inputs are as 
* **Category.** This dropdown field loads a list of the available categories from the API. Choose the Random value or leave empty to get questions from random category.
* **Difficulty.** As you may guess from the name, it sets the difficulty of the quiz. Again leaving this empty will fetch questions of random difficulty (mixed).
* **No. of Questions.** Sets the preferred amount of questions. Leave empty for 10 questions.

The control panel also fetures a notifications section where the user is notified about the number of questions available for the user in a selected category or globally.
*Selecting a number of questions greater than the available number will result in a error.*

### Quiz
This is the main section which has the sole purpose of the application - Quiz.

### Results
This sections shows the result to the user after the quiz has been submitted. It shows the overall score as well as the detailed results.
