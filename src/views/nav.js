import { html } from "../lib/lit-html.js";

export const navTemp = (hasUser) => html`
<nav>
    <!-- <a href="/"><img src="../../images/ER-Logo.png" alt="ER-Logo" class="er-logo"></a> -->
    <img
  src="../../images/ER-Logo.png" alt="ER-Logo" class="er-logo" onclick="window.location.href='/';" style="cursor: pointer;"/>
    <a href="/">Home</a>
    <a href="/rooms">Rooms</a>
    ${hasUser ? html`
    <a href="/host">Host</a>
    <a href="/profile">My Profile</a>
    <a href="/logout">Logout</a>` : html`
    <a href="/login">Login</a>
    <a href="/register">Register</a>`}
</nav>`;