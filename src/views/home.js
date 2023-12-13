
import { html } from "../lib/lit-html.js";

const homeTemp = (list) => html`
    <h1>Welcome to Easy Reserve!</h1>
    <img src="https://www.redrockresort.com/wp-content/uploads/2020/12/RR-Standard-2-Queen.jpg" alt="hotelRroom">
    <link rel="stylesheet" href="/static/home.css">
    <p id="firstP">Find accommodation in many locations across the country. <a href="/rooms">Browse catalog</a></p>
    <p id="secondP">Have a room to offer? <a href="/host">Place an ad right now!</a></p>
    <footer>
    <p id="foot">Mehmed Ayt &copy; 2023-2024</p>
    </footer>
    ${list}
`;

export function homeView(ctx) {
    ctx.render(homeTemp());
}
