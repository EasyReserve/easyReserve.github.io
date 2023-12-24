
import { html} from "../lib/lit-html.js";
import { repeat } from '../lib/directives/repeat.js';
import * as roomService from '../data/room.js';

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

const listTemp = (rooms) => html`${rooms.length >= 1 ? html `<section>
<h2>Our promo offers</h2>
${repeat(rooms,  r => r.objectId, roomCard)}
</section>` : html `<p class="no-ads"> No results.</p>`}
`;

const roomCard = (room) => html`
<article class="room-home">
        <h3>${room.name}</h3>
        <p>Location: ${room.location}</p>
        <p>Beds: ${room.beds}</p>
        <p>Price: ${room.price}</p>
        <img src=${room.imgUrl} alt="room">
        <img src="../../images/icon-promo.png" alt="Promo Badge" class="promo-badge">
        <p><a class="action" href="/rooms/${room.objectId}">View Details</a></p>
</article>`;

export async function homeView(ctx) {
    const { results: rooms } = await roomService.getPromo();

    ctx.render(homeTemp(listTemp(rooms)));

}
