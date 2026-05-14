"use strict";

if (!localStorage.getItem("Guestbook-token")) {
    window.location.href = "login.html";
}