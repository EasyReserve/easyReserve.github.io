import { html, nothing } from "../lib/lit-html.js";
import { repeat } from "../lib/directives/repeat.js";
import * as roomService from "../data/room.js";
import * as reservationService from "../data/reservation.js";
import { submitHandler } from "../util.js";
import { notify } from "../notify.js";
//${repeat(room.reservations, r => r.objectId, reservationCard, onAccept, onReject)} 


const detailsTemp = (room, hasUser, onDelete, onBook, onAccept, onReject) => html`
<link rel="stylesheet" href="/static/details.css">
<h2>${room.name}</h2>
<p id="location">Location: ${room.location}</p>
<p id="beds">Beds: ${room.beds}</p>
<p id="price">Price: ${room.price}</p>
<p id="description">${room.description}</p>
<img src=${room.imgUrl} alt="room">
${room.isOwner ? html`
<a href="/edit/${room.objectId}" id="editBtn">Edit</a>
<a @click=${onDelete} href="javascript:void(0)" id="deleteBtn">Delete</a>` : nothing}
${hasUser && !room.isOwner ? reservationForm(onBook) : nothing}
${hasUser && room.isOwner ? html`
<ul>
    ${repeat(room.reservations, r => r.objectId, (res) => reservationCard(res, onAccept, onReject))}
</ul>` : nothing}`;

const reservationForm = (onSubmit) => html`
<form @submit=${onSubmit} class="calendar">
    <label>From <input type="date" name="startDate"></label>
    <label>To <input type="date" name="endDate"></label>
    <button>Request reservation</button>    
</form>`;

const reservationCard = (res, onAccept, onReject) => html`
<li>
    Requested by: ${res.owner.username} <br>
    From: ${res.startDate.toISOString().slice(0, 10)}<br>
    To: ${res.endDate.toISOString().slice(0, 10)}<br>
    <a @click=${onAccept} href="javascript:void(0)" class="accept-link">Accept</a>
    <a @click=${onReject} href="javascript:void(0)" class="reject-link">Reject</a>
</li>`;


export async function detailsView(ctx) {
    const id = ctx.params.id;
    const room = ctx.data;

    const hasUser = Boolean(ctx.user);
    room.isOwner = room.owner?.objectId === ctx.user?.objectId;
    room.reservations = [];

    if (hasUser) {
        const result = await reservationService.getByRoomId(id);
        room.reservations = result.results;
    }

    ctx.render(detailsTemp(ctx.data, hasUser, onDelete, submitHandler(book), onAccept, onReject));

    async function onDelete() {
        const conf = confirm('Are you sure to delete this offer?');
        if (conf) {
            await roomService.deleteById(id);
            ctx.page.redirect('/rooms');
        }
    }
    async function onAccept() {
        const reservation = await reservationService.getByRoomId(ctx.params.id);
        const reservationId = reservation.results[0].objectId;
        let status = 'accepted';
        notify('Accepted')
        await reservationService.update(reservationId, status);
    }

    async function onReject() {
        const reservation = await reservationService.getByRoomId(ctx.params.id);
        const reservationId = reservation.results[0].objectId;
        let status = 'rejected';
        notify('Rejected');
        await reservationService.update(reservationId, status);
    }

    async function book({ startDate, endDate }) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        if (Number.isNaN(startDate.getDate())) {
            return notify('Invalid starting date!')
        }
        if (Number.isNaN(endDate.getDate())) {
            return notify('Invalid ending date!')
        }

        if (endDate <= startDate) {
            return notify('Ending date must be after starting date!');
        }

        const reservationData = {
            startDate,
            endDate,
            room: id,
            host: ctx.data.owner.objectId
        };

        const result = await reservationService.create(reservationData, ctx.user.objectId);
        ctx.page.redirect('/rooms/' + id);
    }
}