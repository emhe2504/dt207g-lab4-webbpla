
const guestBooks = document.getElementById("allGuestbooks");
const menu = document.getElementById("menu");

window.onload = init;

function init() {

    if (menu) { editMenu() };
    if (guestBooks) { getGuestbooks() }
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
    console.log(jsonData);

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
        <li><a href="/about.html">Logga ut</a></li>`
    } else {
        menu.innerHTML = `
        <li><a href="/index.html">Startsida</a></li>
        <li><a href="/about.html">Logga in</a></li>`
    }
}