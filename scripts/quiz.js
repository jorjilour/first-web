/**
 * Target: result.html
 * Author: Jorjilou Reyes
 * Purpose: to validate and display results from storage.
 * Date Created: 18/09/2020
 * Date Modified: 28/09/2020
 */

"use strict";


function validate() {
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

    //q1 - Check that valid name is added.
    var q1RegExp = new RegExp(/^[a-zA-Z -]+$/);
    if (!q1.match(q1RegExp)) {
        isValid = false;
        errorMsg += "Please answer Question 1 (with alphabet characters only) \n";
    }


    //q2 - check if at least one button is checked
    var isOption1 = document.getElementById("semicolon").checked;
    var isOption2 = document.getElementById("space").checked;
    var isOption3 = document.getElementById("newline").checked;
    var isOption4 = document.getElementById("curly").checked;
    var isOption5 = document.getElementById("comma").checked;
    if (!(isOption1 || isOption2 || isOption3 || isOption4 || isOption5)) {
        isValid = false;
        errorMsg += "Please answer Question 2 \n";
    }

    //q3 - check if at least one button is checked
    var isFtr1 = document.getElementById("ft1").checked;
    var isFtr2 = document.getElementById("ft2").checked;
    var isFtr3 = document.getElementById("ft3").checked;
    var isFtr4 = document.getElementById("ft4").checked;
    var isFtr5 = document.getElementById("ft5").checked;

    if (!(isFtr1 || isFtr2 || isFtr3 || isFtr4 || isFtr5)) {
        isValid = false;
        errorMsg += "Please answer Question 3 \n";
    }

    //q4 - check if someting is selected from options
    if (document.getElementById("valid_vals").value == "") {
        isValid = false;
        errorMsg += "Please answer Question 4 \n";
    }

    //q5 -check if value not added or check if in range from 1990 to 2020
    var q5 = document.getElementById("year").value;
    if (q5 == "") {
        isValid = false;
        errorMsg += "Please answer Question 5. ";
    }
    if (parseInt(q5) < 1990 || parseInt(q5) > 2020) {
        isValid = false;
        errorMsg += "Answer should be between 1990 - 2020. \n";
    } else {
        errorMsg += "\n";
    }


    var score = calcScore();
    //score
    if (score == 0) {
        isValid = false;
        errorMsg += "You scored 0. Try again!\n\n\n";

        errorMsg += alert_hints();
    }

    //if form is not valid: user inputs are not correct, alert them and dont submit
    if (errorMsg !== "") {
        alert(errorMsg);
    }

    if (isValid) {
        storeForm(firstname, lastname, id, score);
    }


    return isValid;
}

function alert_hints() {
    var hintsMsg = "HINTS: \n"
    const HINT_Q1 = "Q1: His initials are D.C. Just first name or just last name is acceptable.\n";
    const HINT_Q2 = "Q2: It is similar to how values in a CSV data format are separated. \n";
    const HINT_Q3 = "Q3: There are 3 correct answers. \n";
    const HINT_Q4 = "Q4: Revise what can be put inside an object from the Basic Syntax section of the JavaScript topic. \n";
    const HINT_Q5 = "Q5: It was discovered in 2001 but was only used by many later on.\n ";
    var tmpPts = 1;

    if (markQ1(tmpPts) <= 0) {
        hintsMsg += HINT_Q1;
    }
    if (markQ2(tmpPts) <= 0) {
        hintsMsg += HINT_Q2;
    }
    if (markQ3(tmpPts, tmpPts - 0.5) <= 0) {
        hintsMsg += HINT_Q3;
    }
    if (markQ4(tmpPts) <= 0) {
        hintsMsg += HINT_Q4;
    }
    if (markQ5(tmpPts) <= 0) {
        hintsMsg += HINT_Q5;
    }

    return hintsMsg;
}

function storeForm(firstname, lastname, id, score) {
    localStorage.setItem("firstname", firstname);
    localStorage.setItem("lastname", lastname);
    localStorage.setItem("score", score);
    localStorage.setItem("currentID", id);

    var index = -1;
    var isNewID = true;

    // setIDandAttempts(id);

    /*keep track of all ids and corresponding attempts*/

    //ids and attempts array are not initialized yet (new storage), do so
    if (localStorage.getItem("ids") == null ||
        localStorage.getItem("attempts") == null) {

        //set index where new values will be;
        index = 0;

        //initialize new array of ids and no. of attempts asssociated in that array
        var ids = new Array();
        var attempts = new Array();

        //set id, set index
        ids[index] = id;
        attempts[index] = 1;

        localStorage.setItem("ids", JSON.stringify(ids));
        localStorage.setItem("attempts", JSON.stringify(attempts));
    } else {
        //where attempts and ids are already in storage
        var ids = JSON.parse(localStorage.getItem("ids")); //['id1', 'id2', 'id3']
        var attempts = JSON.parse(localStorage.getItem("attempts")); //[1, 2, 1]

        var current_index = ids.indexOf(id);
        //if student id is in storage, set attempts only at index, current_index
        if (current_index != -1) {
            attempts[current_index] += 1;
        }
        //if id is NOT in storage yet, push id and attempts
        else {
            ids.push(id);
            attempts.push(1);
        }

        localStorage.setItem("ids", JSON.stringify(ids));
        localStorage.setItem("attempts", JSON.stringify(attempts));
    }
}

function getAttemptWithID(id) {
    var idsParsed = JSON.parse(localStorage.ids);
    var index = idsParsed.indexOf(id);
    var attemptsParsed = JSON.parse(localStorage.attempts);
    var attempt = -1;

    if (index != -1) {
        attempt = attemptsParsed[index];
    }

    return attempt;
}

function setAttempts(index, isNewID, attempts) {
    //if new array, just set it attempts to 1 in index

    var temp_index = -1;
    if (attempts[index] !== null) {
        temp_index = index;
        if (index == 0 || isNewID) {
            attempts.push(1);
            temp_index = index;
        } else {
            attempts[index] += 1;
        }
    }
    return temp_index;
}

function calcScore() {
    var score = 0;
    const Q1_PTS = 1;
    const Q2_PTS = 1;
    const Q3_PTS = 1;
    const Q3_PTS_NEG = 0.5;
    const Q4_PTS = 2;
    const Q5_PTS = 2;

    score += markQ1(Q1_PTS) + markQ2(Q2_PTS) +
        markQ3(Q3_PTS, Q3_PTS_NEG) + markQ4(Q4_PTS) +
        markQ5(Q5_PTS);

    if (score < 0) {
        score = 0;
    }

    return score;
}

function markQ1(pts) {
    var score = 0;
    var answer = document.getElementById("q1").value.trim();

    if ((answer.match(/^(douglas) ?(crockford)?$/i)) ||
        (answer.match(/^(crockford) ?(douglas)?$/i))) {
        score += pts;
    }

    return score;
}

function markQ2(pts) {
    var marks = 0;
    var answer = document.getElementById("comma").checked;

    if (answer) {
        marks += pts;
        return marks;
    } else return marks;
}

function markQ3(pts, negPts) {
    var marks = 0;
    var correct1 = document.getElementById("ft1").checked;
    var correct2 = document.getElementById("ft2").checked;
    var correct3 = document.getElementById("ft4").checked;
    var wrong1 = document.getElementById("ft3").checked;
    var wrong2 = document.getElementById("ft5").checked;

    //if correct, add pts each
    if (correct1) marks += pts;
    if (correct2) marks += pts;
    if (correct3) marks += pts;

    //if wrong anwer ticked, deduct points
    if (wrong1) marks -= negPts;
    if (wrong2) marks -= negPts;

    return marks;
}

function markQ4(pts) {
    var marks = 0;
    var answer = document.getElementById("valid_vals").value;

    if (answer == "img") {
        marks += pts;
        // alert("question 4 correct \n");
    }
    return marks;
}

function markQ5(pts) {
    var marks = 0;
    var answer = document.getElementById("year").value;

    if (answer == 2005) {
        marks += pts;
        // alert("question 5 correct \n");
    }
    return marks;
}

function getResult() {
    if (typeof(Storage) !== undefined) {
        if (localStorage.getItem("firstname") !== null) {

            //display student name
            var username = document.getElementById("confirm_name");
            username.textContent = localStorage.getItem("firstname") + " " +
                localStorage.getItem("lastname");

            //display student id
            var id = document.getElementById("confirm_id");
            id.textContent = localStorage.getItem("currentID");

            //display score
            var score = document.getElementById("score");
            score.value = localStorage.getItem("score"); // input: use value

            //display attempts
            var attempts_HTML = document.getElementById("confirm_attempts");
            var attempt = getAttemptWithID(localStorage.currentID);

            attempts_HTML.value = attempt;
        }
    }
}

function retakeQuiz() {
    if (typeof(Storage) !== undefined && localStorage.getItem("attempts") !== null) {
        var attempt = getAttemptWithID(localStorage.currentID);
        if (attempt < 3) {
            window.location = "quiz.html";
        } else {
            alert("You have used up your allowed attempts.");
        }
    }
}

function getIndexOfCurrentID() {
    var ids = JSON.parse(localStorage.ids);
    var index = ids.indexOf(localStorage.currentID);

    return index;
}

/*prefills form saved form sessionStorage */
function prefill_form() {
    if (localStorage.firstname !== undefined) {
        document.getElementById("firstname").value = localStorage.firstname;
        document.getElementById("lastname").value = localStorage.lastname;
        document.getElementById("studentid").value = localStorage.currentID;
    }
}


function init() {

    if (document.getElementById("jsonquiz")) {

        //validate form when submitted
        var quizForm = document.getElementById("jsonquiz");
        quizForm.onsubmit = validate;
        /***
        var reset = document.getElementById("restart");
        reset.onclick = startQuiz;
        ***/
        // if (typeof(Storage) !== undefined) {
        //     prefill_form();
        // }

    } else if (document.getElementById("results")) {
        getResult();

        var retake = document.getElementById("retakeButton");
        retake.onclick = retakeQuiz;
    }

}



window.onload = init;