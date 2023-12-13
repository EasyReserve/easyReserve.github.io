import { html, nothing } from "../lib/lit-html.js";
import * as roomService from "../data/room.js";
import { getUserData } from "../util.js";

const profileTemp = (items, userData) =>html`
<link rel="stylesheet" href="/static/profile.css">
<section id="profilePage">
    <div class="userInfo">
        <div class="avatar">
            <img src="./images/profilePic.png">
        </div>
        <h2>Hello ${userData.username} <br> This is your ads:</h2>
    </div>
    <div class="board">
    
        ${items.length > 0 
        ? items.map(cardTemp)
        : html `
        <div class="no-events">
            <p>This user has no posts yet!</p>
        </div>`}
    </div>
</section>`;




const cardTemp = (item) => html`
${item.isOwner !== true ? null : html`
    <div class="eventBoard">
        <div class="event-info">
            <img src=${item.imgUrl}>
            <h2>Name: ${item.name}</h2>
            <h6>Added at: ${item.createdAt.slice(0, 10)}</h6>
            <a href="/rooms/${item.objectId}" class="details-button">Details</a>
        </div>
    </div>`}`;

export async function profileView(ctx){
    const userData = getUserData();
    const { results: rooms } = await roomService.getAll(ctx.user?.objectId);

    if (ctx.user) {
        rooms.forEach(r => r.isOwner = r.owner.objectId == ctx.user.objectId);
    }

    console.log(rooms);
    
    ctx.render(profileTemp(rooms, userData));
}