
const guestBooks = document.getElementById("allGuestbooks");

window.onload = init;

function init() {
    if(guestBooks) {
        getGuestbooks();
    }
}

//Hämta guestbooks från API

async function getGuestbooks() {

    try {

        const fetchData = await fetch("http://localhost:3001/guestbook");
        const jsonData = await fetchData.json();

        renderGuestbooks(jsonData);

    } catch(error) {
        console.log(error);
    }
}

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