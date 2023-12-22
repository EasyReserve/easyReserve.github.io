import { html } from "../lib/lit-html.js";
import { classMap } from '../lib/directives/class-map.js'
import { repeat } from '../lib/directives/repeat.js';

import * as roomService from '../data/room.js'
import { notify } from "../notify.js";

const catalogTemp = (list, onClick) => html`
<div class="container">
        <input id="search-input" type="text" name="search" placeholder="Enter hotel name">
        <button @click=${onClick} class="button-list">Search</button>
</div>
<link rel="stylesheet" href="/static/catalog.css">
<h2>Available Rooms</h2>
${list}`;

const listTemp = (rooms) => html`${rooms.length >= 1 ? html `<section>
${repeat(rooms,  r => r.objectId, roomCard)}
</section>` : html `<p class="no-ads"> No results.</p>`}
`;

const roomCard = (room) => html`
<article class=${classMap({ "room-card": true, 'own-room': room.isOwner })}>
        <h3>${room.name}</h3>
        <p>Location: ${room.location}</p>
        <p>Beds: ${room.beds}</p>
        <p>Price: ${room.price}</p>
        <img src=${room.imgUrl} alt="room">
        <p><a class="action" href="/rooms/${room.objectId}">View Details</a></p>
        <p class="hosted-by">Hosted by: ${room.isOwner ? 'You' : room.owner.username}</p>
</article>`;

export async function catalogView(ctx) {
    ctx.render(catalogTemp(html`<p>Loading &hellip;</p>`));

    const { results: rooms } = await roomService.getAll(ctx.user?.objectId);

    if (ctx.user) {
        rooms.forEach(r => r.isOwner = r.owner.objectId == ctx.user.objectId);
    }

    ctx.render(catalogTemp(listTemp(rooms), onClick));

    async function onClick(){
        const query = document.getElementById('search-input').value.trim();
        
        if(!query){
            return notify('Please enter search term!');
        }
        const { results: rooms } = await roomService.searchQuery(query);

        ctx.render(catalogTemp(listTemp(rooms), onClick));
    }
}