
/***** ..codeauthor:: Muthukumar Subramanian *****/
/*****  HTML JavaScript to Write and Read on the Google Firebase *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set ,get,child, remove} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let patientName = '';
let email = ''
let queue=0;
let currentNumber = 0;
let previousNumber = 0;

// Function to handle form submission
document.querySelector('.btn').onclick = function () {
    const name = document.querySelector('.field[placeholder="Your Name"]').value;
    const queueNumber = document.querySelector('.field[placeholder="Your Queue Number"]').value;
    const emailAddress = document.querySelector('.field[placeholder="Email Adderss"]').value;

    if (name && queueNumber && emailAddress) {
        // Save data to Firebase

        set(ref(database, 'REG/'+queueNumber),{
            Number: queueNumber,
            name: name,
            emailAddress: emailAddress
        }).then(()=>{
            alert("Registration successfully");
        }).catch((error)=>{
            alert("Registration not successful"+ error);
        });
        document.querySelector('.field[placeholder="Your Name"]').value = "";
        document.querySelector('.field[placeholder="Your Queue Number"]').value = "";
        document.querySelector('.field[placeholder="Email Adderss"]').value = "";
    } else {
        alert("Please fill out all fields.");
    }
};

function getValue(number) {
    const dataRef = ref(database);
    get(child(dataRef ,`REG/${number}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            patientName = data.name;
            email = data.emailAddress;
            queue=data.Number;
            
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });

}
function Delete(currentnumber) {
    const dataRef = ref(database, `REG/${currentnumber}`);
    remove(dataRef).then(() => {
        console.log("deleting data");
    }).catch((error) => {
        console.error("Error deleting data: ", error);
    });

}
function Call() {
    getIncrementValue();
    console.log(currentNumber);
    let queueNumber = currentNumber+11;
    if (currentNumber != previousNumber) {
        getValue(queueNumber);
        console.log('Name is :');
        console.log(patientName);
        if (patientName != '') {
            sendEmail();
            console.log(email);
            Delete(queue);
            patientName = '';
            email = '';
        }
    }
    previousNumber = currentNumber;
}

function sendEmail() {
    var templateParams = {
        name: patientName,
        email: email,
        queueNumber:queue,
      };
      emailjs.send('service_dvsl3kk', 'template_vi3lkxn', templateParams).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );
}

function getIncrementValue() {
    const dbRef = ref(database, 'ROOMS/INCREMENT');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            currentNumber = snapshot.val();
            console.log("Current Increment Value: ", currentNumber);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}
setInterval(Call, 500);