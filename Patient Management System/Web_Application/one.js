/***** ..codeauthor:: Muthukumar Subramanian *****/
/*****  HTML JavaScript to Write and Read on the Google Firebase *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

/***** Firebase config *****/
const firebaseConfig = {
    apiKey: "AIzaSyCC4ukNHjuZMI2KazX-dJXWRKNK00wawZk",
    authDomain: "sampath-323fb.firebaseapp.com",
    databaseURL: "https://sampath-323fb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sampath-323fb",
    storageBucket: "sampath-323fb.appspot.com",
    messagingSenderId: "408200175365",
    appId: "1:408200175365:web:2aeaf74cd6ffc9ffd5a16c"
};

/***** Initialize Firebase *****/
const app = initializeApp(firebaseConfig);
var db = getDatabase();
/***** write data to firebase *****/

let increment = 1;
let maxValue = 5;
let calling = 0;
let doctor01 = 0;
let doctor02 = 0;
let value01 = 0;
let value02 = 0;
let patientNot01 = 0;
let patientNot02 = 0;
let patientNotValue01 = 0;
let patientNotValue02 = 0;
let room01 = 0;
let room02 = 0;
var rePatients = [0, 0, 0, 0, 0, 0];
var countPatients = [0, 0, 0, 0, 0, 0];
var readyPatients = [1, 2, 3, 4, 5];
let isAlpa1 = true;
let isAlpa2 = true;




function write_db() {
    console.log("DEBUG: Write function");
    set(ref(db, 'ROOMS'), {
        ROOM01: room01,
        ROOM02: room02,
        INCREMENT: increment
    }).then((res) => {
        console.log();
    })
        .catch((err) => {
            alert(err.message);
            console.log(err.code);
            console.log(err.message);
        })
}

/***** read data from firebase *****/
function read_db() {
    var connect_db1 = ref(db, 'DOCTOR01');
    console.log("DEBUG: Read function");
    onValue(connect_db1, (snapshot) => {
        doctor01 = snapshot.val();

    })
    var connect_db2 = ref(db, 'DOCTOR02');
    console.log("DEBUG: Read function");
    onValue(connect_db2, (snapshot) => {
        doctor02 = snapshot.val();

    })
    var connect_db3 = ref(db, 'PATIENT01');
    console.log("DEBUG: Read function");
    onValue(connect_db3, (snapshot) => {
        patientNot01 = snapshot.val();

    })
    var connect_db4 = ref(db, 'PATIENT02');
    console.log("DEBUG: Read function");
    onValue(connect_db4, (snapshot) => {
        patientNot02 = snapshot.val();

    })
    var connect_db5 = ref(db, 'CALLING');
    console.log("DEBUG: Read function");
    onValue(connect_db5, (snapshot) => {
        calling = snapshot.val();

    })
    var connect_db6 = ref(db, 'MAX');
    console.log("DEBUG: Read function");
    onValue(connect_db6, (snapshot) => {
        maxValue = snapshot.val();

    })

}

function CallME() {
    // Doctor 01==============================
    read_db();
    if (maxValue == increment) {
        increment = 1;
        room01 = 0;
        room02 = 0;
    }
    if (calling==5) {
        playcalling();
    }
    if (doctor01 == (value01 + 1)) {
        for (let i = 0; i < 6; i++) {
            if ((countPatients[i] + 5) == increment && countPatients[i] != 0) {
                room01 = rePatients[i];
                countPatients[i] = 0;
                rePatients[i] = 0;
                isAlpa1 = false;
                break;
            }

        }
        if (isAlpa1) {
            room01 = increment;
            readyPatients.shift();
            readyPatients.push(increment + 5);
            increment++;
        }
        isAlpa1 = true;
        value01 = doctor01;
        playSound();
    }
    if (patientNot01 == (patientNotValue01 + 1)) {
        for (let i = 0; i < 6; i++) {
            if (countPatients[i] == 0) {
                countPatients[i] = increment - 1;
                rePatients[i] = room01;
                break;
            }
        }
        patientNotValue01 = patientNot01;
        readyPatients.push(room01);
    }
    // Doctor 02==============================
    if (doctor02 == (value02 + 1)) {
        for (let i = 0; i < 6; i++) {
            if ((countPatients[i] + 5) == increment && countPatients[i] != 0) {
                room02 = rePatients[i];
                countPatients[i] = 0;
                rePatients[i] = 0;
                isAlpa2 = false;
                break;
            }
        }
        if (isAlpa2) {
            room02 = increment;
            readyPatients.shift();
            readyPatients.push(increment + 5);
            increment++;
        }
        isAlpa2 = true;
        value02 = doctor02;
        playSound();
    }
    if (patientNot02 == (patientNotValue02 + 1)) {
        for (let i = 0; i < 6; i++) {
            if (countPatients[i] == 0) {
                countPatients[i] = increment - 1;
                rePatients[i] = room02;
                break;
            }
        }
        readyPatients.push(room02);
        patientNotValue02 = patientNot02;
    }
    write_db();
    
    document.getElementById('value1').innerText = room01;
    document.getElementById('value2').innerText = room02;
    document.getElementById('label1').innerText = readyPatients[0];
    document.getElementById('label2').innerText = readyPatients[1];
    document.getElementById('label3').innerText = readyPatients[2];
    document.getElementById('label4').innerText = readyPatients[3];
    
}
function playSound() {
    const audio = new Audio('bell.wav');
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}
function playcalling() {
    const audio = new Audio('DoubleBell.wav');
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const navigateOne = document.getElementById('navigate-one');
    if (navigateOne) {
        navigateOne.addEventListener('click', function () {
            window.location.href = 'third.html';
        });
    }
    const navigateIndex = document.getElementById('navigate-index');
    if (navigateIndex) {
        navigateIndex.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }
});

setInterval(CallME, 500);
