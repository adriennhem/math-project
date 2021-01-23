$(document).ready(function(){
    var currentQuestion;
    var highScore = 0;
    var interval;
    var timeLeft = 10;
    var score = 0;
    
    var updateTimeLeft = function (amount) {
      timeLeft += amount;
      $('#time-left').text(timeLeft);
    };
    
    var updateScore = function (amount) {
      score += amount;
      $('#score').text(score);
    };

    var updateHighScore = function (score) {
      if (score > highScore) {
        $('#high-score').text(score);
      }
    }
    
    var startGame = function () {
      if (!interval) {
        if (timeLeft === 0) {
          updateTimeLeft(10);
          updateScore(-score);
        }
        interval = setInterval(function () {
          updateTimeLeft(-1);
          if (timeLeft === 0) {
            clearInterval(interval);
            interval = undefined;
            updateHighScore(score);
          }
        }, 1000);  
      }
    };
    
    var randomNumberGenerator = function (size) {
      return Math.ceil(Math.random() * size);
    };

    var randomOperatorGenerator = function () {
      var operators = [];
      $('input[type=checkbox]').each(function (index) {
        if ($('input[type=checkbox]')[index].checked) {
          operators.push($('input[type=checkbox]')[index].value)
        }
      })
      return operators[Math.floor(Math.random() * operators.length)]
    }
    
    var questionGenerator = function () {
      var question = {};
      var num1 = randomNumberGenerator(10);
      var num2 = randomNumberGenerator(10);
      var operator = randomOperatorGenerator();

      if (operator == "+") {
        question.answer = num1 + num2;
      } else if (operator == "-") {
        question.answer = num1 - num2;
      } else if (operator == "*") {
        question.answer = num1 * num2;
      } else {
        question.answer = num1 / num2;
      }
      
      question.equation = String(num1) + " " + String(operator) + " " + String(num2);
      
      return question;
    };
    
    var renderNewQuestion = function () {
      currentQuestion = questionGenerator();
      $('#equation').text(currentQuestion.equation);  
    };
    
    var checkAnswer = function (userInput, answer) {
      if (userInput === answer) {
        renderNewQuestion();
        $('#user-input').val('');
        updateTimeLeft(+1);
        updateScore(+1);
      }
    };
    
    $('#user-input').on('keyup', function () {
      startGame();
      checkAnswer(Number($(this).val()), currentQuestion.answer);
    });
    
    renderNewQuestion();
  });