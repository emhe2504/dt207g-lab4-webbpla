
const guestBooks = document.getElementById("allGuestbooks");
const menu = document.getElementById("menu");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

window.onload = init;

function init() {

    if (menu) { editMenu() };
    if (guestBooks) { getGuestbooks() };
    if (loginForm) { loginForm.addEventListener("submit", login) }
    if (registerForm) { registerForm.addEventListener("submit", registerAccount) }
}

//Hämta guestbooks från API
async function getGuestbooks() {

    try {

        const fetchData = await fetch("http://localhost:3001/guestbook");
        const jsonData = await fetchData.json();

        renderGuestbooks(jsonData);

    } catch (error) {
        console.log(error);
    }
}

//Skriva ut guestbooks till DOM
function renderGuestbooks(jsonData) {

    guestBooks.innerHTML = "";

    jsonData.forEach(guestbook => {
        const date = guestbook.created;
        const fixedDate = new Date(date).toLocaleDateString();

        guestBooks.innerHTML += `
        <article>
        <h3>${guestbook.title}</h3>
        <p>${guestbook.title}</p>
        <p>Skapad: ${fixedDate}</p>
        </article>`
    });
}

function editMenu() {

    if (localStorage.getItem("Guestbook-token")) {
        menu.innerHTML = `
        <li><a href="/index.html">Startsida</a></li>
        <li><a href="/add.html">Skriv i gästboken</a></li>
        <li><a href="/login.html" id="logout-button">Logga ut</a></li>`
    } else {
        menu.innerHTML = `
        <li><a href="/index.html">Startsida</a></li>
        <li><a href="/login.html" id="login-button">Logga in</a></li>`
    }

    const logoutButton = document.getElementById("logout-button");

    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("Guestbook-token");
            window.location.href = "login.html";
        })
    }
}

async function registerAccount(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const registeredEmail = document.getElementById("emailReg").value;
    const registeredPassword = document.getElementById("passwordReg").value;

    //Felmeddelanden vid tomma inputfält
    const regErrors = [];
    const errorSpot = document.getElementById("regErrors");
    errorSpot.innerHTML = "";

    if (!registeredEmail) {
        regErrors.push("Ange E-postadress")
    }
    if (!registeredPassword) {
        regErrors.push("Ange lösenord")
    }
    regErrors.forEach(error => {
        const newLi = document.createElement("li");
        newLi.textContent = error;
        errorSpot.appendChild(newLi);
    });

    let user = {
        email: registeredEmail,
        password: registeredPassword
    }

    try {

        const response = await fetch("http://localhost:3001/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }

    } catch (error) {
        console.log(error);
    }

}

async function login(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedEmail = document.getElementById("email").value;
    const addedPassword = document.getElementById("password").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("errorUl");
    errorSpot.innerHTML = "";

    if (!addedEmail) {
        errors.push("Fyll i E-postadress")
    }
    if (!addedPassword) {
        errors.push("Fyll i lösenord")
    }
    errors.forEach(error => {
        const newLi = document.createElement("li");
        newLi.textContent = error;
        errorSpot.appendChild(newLi);
    });

    let user = {
        email: addedEmail,
        password: addedPassword
    }

    try {

        const response = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            if (data.token) {
                localStorage.setItem("Guestbook-token", data.token);
                window.location.href = "index.html";
            }
        }

    } catch (error) {
        console.log(error);
    }

}