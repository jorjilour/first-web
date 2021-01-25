/**
 * Target: enhancements2.html
 * Author: Jorjilou Reyes
 * Purpose: enhancements using javascript
 * Date Created: 27/09/2020
 * Date Modified: 27/09/2020
 */

/*** FOR ENHANCEMENTS BUT NOT TIME TO FIND OUT HOW TO DO MULTIPLE SCRIPTS KEPT FAILING **/
"use strict";
/**
 * Canvas Clock Scripts, copied from W3Schools
 */
function displayClock() {

}



function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius, minute, second) {
    // var now = new Date();
    // var hour = now.getHours();
    // //hour
    // hour = hour % 12;
    // hour = (hour * Math.PI / 6) +
    //     (minute * Math.PI / (6 * 60)) +
    //     (second * Math.PI / (360 * 60));
    // drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    //minute
    minute = (0 * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);

}
/**
 * End of Canvas Clock Scripts
 */

function startTimer(duration) {
    var display = document.querySelector("#timer2");
    var timer = duration,
        minutes, seconds;

    display.innerHTML = "";

    var myInterval = setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;

        // timer--;
        // to restart timer
        if (--timer < 0) {
            clearInterval(myInterval);
            display.innerHTML = 'TIMES UP!!';
            //SUBMIT
        }
    }, 1000);
}

function stopQuiz() {
    alert('TIME\'S UP!!!');
    //validate quiz or restart
    //submit quiz, disable inputs
    var inputs = document.getElementsByTagName("input");
    var select = document.getElementsByTagName("select");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'submit') {
            inputs[i].disabled = false;
            document.getElementById("jsonquiz").onsubmit = validateTimeOut;
        } else if (inputs[i].className == "inputQ") {
            inputs[i].disabled = true;
        } else {
            inputs[i].disabled = false;
        }
    }
    if (select[0].id == "valid_vals") {
        select[0].disabled = true;
    }

}

function startQuizTimer() {
    // document.getElementById("quizStartButton").onclick = null;
    var duration = 3 * 60; //3 minutes
    var writtenTimer = setTimeout(stopQuiz, (duration + 1) * 1000)
    var writenInterval = startTimer(duration);

    //display clock
    var timer = duration;
    var minutes_in_clock = duration / 60;
    var second = duration % 60;
    second = second == 0 ? 60 : second;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    var clockInterval = setInterval(function() {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius, minutes_in_clock, second);
        // minute += 1;
        // second -= 1;

        if (second == 0 && minutes_in_clock > 0) {
            minutes_in_clock -= 1;
            second = 60;
            timer--;
        }
        if (timer <= 0 || (minutes_in_clock == 0 && second == 0)) {
            minutes_in_clock = 0;
            second = 0;
            clearInterval(clockInterval);
        }
        if (minutes_in_clock != 0 && second != 0) {
            second--;
            timer--;
        }
    }, 1000);

    clearInterval(myInterval);

}

function manageStartQuizTimer() {
    window.location = "quiz.html#quizform"
    var isQuizOngoing = false;
    var curTime = document.getElementById("timer2").innerHTML;

    if (curTime != "") {
        isQuizOngoing = true;
    }

    if (isQuizOngoing) {
        //restart quiz
        alert("Quiz will be restarting...");
        window.location = "quiz.html";
    } else {
        startQuizTimer();
    }
}

function validateTimeOut() {
    var errorMsg = "";
    var isValid = true;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var id = document.getElementById("studentid").value;
    var q1 = document.getElementById("q1").value;

    //firstname
    var fNameRegExp = new RegExp(/^[a-zA-Z- ]+$/);
    if (!firstname.match(fNameRegExp) || !(firstname.length <= 25)) {
        isValid = false;
        errorMsg += "Invalid First Name. \n";
    }
    //lastname
    var lNameRegExp = new RegExp(/^[a-zA-Z- ]+$/);
    if (!lastname.match(lNameRegExp) || !(lastname.length <= 25)) {
        isValid = false;
        errorMsg += "Invalid Last Name. \n";
    }

    //id
    var idRegExp = new RegExp(/[0-9]{7,10}/);
    if (!id.match(idRegExp)) {
        isValid = false;
        errorMsg += "Invalid Student ID. It must be 7 or 10 digits \n";
    }
    var score = calcScore();
    //score
    if (score == 0) {
        isValid = false;
        errorMsg += "You scored 0. Try again!\n\n\n";

        errorMsg += alert_hints();
        //if timed out, and at attempt 2, meaning at attempt 3, submit score==0

    }

    //if form is not valid: user inputs are not correct, alert them and dont submit
    if (errorMsg !== "") {
        alert(errorMsg);
    }

    if (isValid) {
        storeForm(firstname, lastname, id, score);

        if (typeof(Storage) == undefined || localStorage.getItem("firstname") == null) {
            alert("STORING DETAILS FAILED");
        }
    }


    return isValid;
}