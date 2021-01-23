$(document).ready(function(){
    var currentQuestion;
    var highScore = 0;
    var interval;
    var timeLeft = 10;
    var score = 0;
    var limit = 10;

    $(document).on('change', '#number-limit', function () {
      var currentLimit = $('#number-limit').val();
      $('#current-number-limit').text(currentLimit);
      limit = currentLimit;
    });
    
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
        highScore = score;
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
      var num1 = randomNumberGenerator(limit);
      var num2 = randomNumberGenerator(limit);
      var operator = randomOperatorGenerator();

      question.equation = String(num1) + " " + String(operator) + " " + String(num2);

      if (operator == "+") {
        question.answer = num1 + num2;
      } else if (operator == "-") {
        question.answer = num1 - num2;
      } else if (operator == "*") {
        question.answer = num1 * num2;
      } else {
        if (num1 >= num2) {
          while (num1 % num2 != 0) {
            num1 = randomNumberGenerator(limit);
          }
          question.equation = String(num1) + " " + String(operator) + " " + String(num2);
          question.answer = num1 / num2;
        } else {
          while (num2 % num1 != 0) {
            num2 = randomNumberGenerator(limit);
          }
          question.answer = num2 / num1;
          question.equation = String(num2) + " " + String(operator) + " " + String(num1);
        }
      }
      
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