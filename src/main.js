
const guestBooks = document.getElementById("allGuestbooks");
const menu = document.getElementById("menu");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const guestbookForm = document.getElementById("guestbookForm");

window.onload = init;

function init() {

    if (menu) { editMenu() };
    if (guestBooks) { getGuestbooks() };
    if (loginForm) { loginForm.addEventListener("submit", login) };
    if (registerForm) { registerForm.addEventListener("submit", registerAccount) };
    if (guestbookForm) { guestbookForm.addEventListener("submit", addGuestbook) };
}

//Hämta guestbooks från API
async function getGuestbooks() {

    try {

        const fetchData = await fetch("https://dt207g-lab4-webbtj.onrender.com/guestbook");
        const jsonData = await fetchData.json();

        renderGuestbooks(jsonData);

    } catch (error) {
        console.log(error);
    }
}

//Skriva ut guestbooks till DOM
function renderGuestbooks(jsonData) {

    guestBooks.innerHTML = "";

    //Sortera data från API, nyare inlägg överst (_id innehåller också tid)
    const sortedData = jsonData.sort((a, b) => b._id.localeCompare(a._id));

    sortedData.forEach(guestbook => {
        const date = guestbook.created;
        const fixedDate = new Date(date).toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        guestBooks.innerHTML += `
        <article>
        <h3>${guestbook.title}</h3>
        <p>${guestbook.thoughts}</p>
        <p>Skapad: ${fixedDate}</p>
        </article>`
    });
}

//Ändra meny beroende på om inloggad eller utloggad
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

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("Guestbook-token");
            window.location.href = "login.html";
        })
    }
}

//Registrera konto
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

        const response = await fetch("https://dt207g-lab4-webbtj.onrender.com/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })


        const data = await response.json();

        if (response.ok) {
            console.log(data);

            const regOK = document.getElementById("regOK");
            regOK.textContent = data.message;

            document.getElementById("emailReg").value = "";
            document.getElementById("passwordReg").value = "";
        } else {
            console.log(data.message);

            const regOK = document.getElementById("regOK");
            regOK.textContent = data.message;
        }

    } catch (error) {
        console.log(error);
    }

}

//Logga in på registerat konto
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

        const response = await fetch("https://dt207g-lab4-webbtj.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        const data = await response.json();

        //Felmeddelande om fel epost eller lösen angetts
        if (!response.ok) {
            const errorMessage = data.message;
            const errorSpot = document.getElementById("loginError");
            errorSpot.textContent = errorMessage;
            return;

        } else {
            errorSpot.textContent = "";
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

async function addGuestbook(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedTitle = document.getElementById("title").value;
    const addedThoughts = document.getElementById("thoughts").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("errorUl");
    errorSpot.innerHTML = "";

    if (!addedTitle) {
        errors.push("Fyll i titel")
    }
    if (!addedThoughts) {
        errors.push("Fyll i någon tanke")
    }
    errors.forEach(error => {
        const newLi = document.createElement("li");
        newLi.textContent = error;
        errorSpot.appendChild(newLi);
    });

    let guestbook = {
        title: addedTitle,
        thoughts: addedThoughts
    }

    const token = localStorage.getItem("Guestbook-token");

    try {

        const response = await fetch("https://dt207g-lab4-webbtj.onrender.com/guestbook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(guestbook)
        })

        const data = await response.json();

        //Felmeddelande om fel titel eller lösen angetts
        if (!response.ok) {
            console.log(data.message);
            /**
             * const errorMessage = data.message;
            const errorSpot = document.getElementById("loginError");
            errorSpot.textContent = errorMessage;
             */
            return;

        } else {
            console.log(data);
            document.getElementById("title").value = "";
            document.getElementById("thoughts").value = "";
            window.location.href = "index.html";
        }

    } catch (error) {
        console.log(error);
    }

}