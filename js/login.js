let currentUser;


async function initLogin() {
    await loadDataFromServer();
    // animation();
    signUpQuery();
}

function animation() {
    setTimeout(() => {document.getElementById('preloader').classList.add('d_none')}, 1000);
}

/**
 * Success message after sign up
 */
function signUpQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if(msg) {
        document.getElementById('msg-box').innerHTML = 'Your registration was successful, please log in now!';
        document.getElementById('msg-box').classList.remove('d_none');
    }
}

/**
 * Checking if User data is correct to grant or deny access
 */
async function login(e) {
    e.preventDefault();

    let email = document.getElementById('email');
    let password = document.getElementById('password');

    users = await loadFromServer('users');
    //checking if user exists
    currentUser = users.find(u => u.email == email.value && u.password == password.value);

    if (currentUser) {
        saveUserOnServer();
        window.location.href='./summary.html?login=1';
    } else {
       showPopupMessage('popup-button');
    }

    return false
}

/**
 * Shows the popup message with animation
 */
function showPopupMessage(id) {
    let popup = document.getElementById(id);

    popup.classList.add('login_animation');
    setTimeout(function () {
        removeAnimation(popup);
    }, 3000);
}

/**
 * Removes the animation class from the popup
 * @param {string} popup 
 */
function removeAnimation(popup) {
    popup.classList.remove('login_animation');
}

/**
 * Save the current user on the server
 */
function saveUserOnServer() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

/**
 * Render password forgotten html
 */
function passwordForgotten() {
    document.getElementById('login-master').innerHTML = `
    <div class="login_main signup_main forgotten_main">
        <a class="goback" href="./index.html"><img src="./assets/img/goBack.png"></a>
        <form class="login_form forgotten_form" onsubmit="onSubmit(event)">
            <h2>I forgot my password</h2>
            <img class="margin_underline" src="./assets/img/horizontal_blue_line.png">
            <span>Don't worry! We will send you an email with the instructions to reset your password.</span>
            <input class="input_email" id="email-field" type="email" name="email" placeholder="Email" required>
            <div class="login_form_buttons login_bottom_margin">
            <button type="submit" class="login_button">Send me the email</button></div>
        </form>             
    </div>
    `;
}

/**
 * Sending email to reset password
 */
async function onSubmit(event) {
    event.preventDefault();
    if(checkIfEmailExists()) {
        let formData = new FormData(event.target); //create a FormData based on our Form Element in HTML
        let response = await action(formData);
        if(response.ok) {
          showPopupMessage('email-reset');
          setTimeout(function () {
            window.location.href = './index.html';
          }, 3000);
        }
    }
}

function action(formData) {
    const input = 'https://gruppe-392.developerakademie.net/join/send_mail.php';
    const requestInit = {
        method: 'post',
        body: formData
    };

    return fetch(
        input,
        requestInit
    );
}


/**
 * Checking if user with entered Email exists
 */
function checkIfEmailExists(){
    let email = document.getElementById('email-field');
    let user = users.find(u => u.email == email.value);
    if(user){
        return true;
    } else {
        showPopupMessage('email-failed');
    }
}


/**
 * Shows the popup "User not found" with animation
 */
function showEmailSendPopup() {
    let popup = document.getElementById('popup-button');

    popup.classList.add('login_animation');
    setTimeout(function () {
        removeAnimation(popup);
    }, 3000);
}

/**
 * Reset the password
 */
async function resetPassword(event) {
    event.preventDefault();
    let password1 = document.getElementById('password-field-1').value;
    let password2 = document.getElementById('password-field-2').value;

    if(password1 == password2){
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get('email');
        let index = users.findIndex(u => u.email == userEmail);
        users[index]['password'] = password1;
        await saveOnServer('users', users);
        showSuccessMessage();
    } else {
        showPopupMessage('password-failed');
    }
}

/**
 * Show success message and return to Log in page
 */
function showSuccessMessage() {
    showPopupMessage('password-success');
        setTimeout(function () {
            window.location.href = './index.html';
        }, 3000);
}