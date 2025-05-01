function checkLinux() {
    var answer = document.querySelector('input[name="linux"]:checked').value;
    if (answer == "0") {
        document.getElementById("linux-answer").innerHTML = "try actually answering the question, enjoy 2 minutes of the free software song!";
        let audio = new Audio('files/free-software-song.ogg');
        audio.play();
        return false;
    }
    if (answer == "1935") {
        document.getElementById("linux-answer").innerHTML = "Correct!";
        let audio = new Audio('files/answer-correct.mp3');
        audio.play();
        return true;
    } else {
        document.getElementById("linux-answer").innerHTML = "Incorrect!";
        let audio = new Audio('files/sad-trombone.mp3');
        audio.play();
        return false;
    }
}

function checkKernel() {
    var answer = document.querySelector('input[name="kernel"]:checked').value;
    if (answer == "0") {
        document.getElementById("kernel-answer").innerHTML = "try actually answering the question, enjoy 2 minutes of the free software song!";
        let audio = new Audio('files/free-software-song.ogg');
        audio.play();
        return false;
    }
    if (answer == "Linux 0.01") {
        document.getElementById("kernel-answer").innerHTML = "Correct!";
        let audio = new Audio('files/answer-correct.mp3');
        audio.play();
        return true;
    } else {
        document.getElementById("kernel-answer").innerHTML = "Incorrect!";
        let audio = new Audio('files/sad-trombone.mp3');
        audio.play();
        return false;
    }
}

function checkAccuracy() {
    var answer = document.querySelector('input[name="accuracy"]:checked').value;
    if (answer == "0") {
        document.getElementById("accuracy-answer").innerHTML = "try actually answering the question, enjoy 2 minutes of the free software song!";
        let audio = new Audio('files/free-software-song.ogg');
        audio.play();
        return false;
    }
    if (answer == "correct") {
        document.getElementById("accuracy-answer").innerHTML = "Correct!";
        let audio = new Audio('files/answer-correct.mp3');
        audio.play();
        return true;
    } else {
        document.getElementById("accuracy-answer").innerHTML = "Incorrect!";
        let audio = new Audio('files/sad-trombone.mp3');
        audio.play();
        return false;
    }
}

function resetRadio() {
    var radios = document.querySelectorAll('input[type="radio"]');

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == "0") {
            radios[i].checked = true;
        }
    }
}

function getAnswers() {
    var linux = checkLinux();
    var kernel = checkKernel();
    var accuracy = checkAccuracy();
    var correct = 0;

    if (linux) {
        correct++;
    }
    if (kernel) {
        correct++;
    }
    if (accuracy) {
        correct++;
    }

    // change the text of the answers paragraph
    document.getElementById("answers").innerHTML = "You got " + correct + " out of 3 questions correct!";
}
