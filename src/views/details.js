import { html, nothing } from "../lib/lit-html.js";
import { repeat } from "../lib/directives/repeat.js";
import * as roomService from "../data/room.js";
import * as reservationService from "../data/reservation.js";
import { submitHandler } from "../util.js";
import { notify } from "../notify.js";

const emoji = {
    'wifi': "fa-solid fa-wifi",
    'tv': "fa-solid fa-tv",
    'parking': "fa-solid fa-square-parking",
    'fitness': "fa-solid fa-dumbbell",
    'kitchen': "fa-solid fa-kitchen-set",
    'washer': "fa-solid fa-soap",
    'dryer': "fa-solid fa-shirt",
    'air conditioning': "fa-solid fa-fan",
    'fireplace': "fa-solid fa-fire",
    'jacuzzi': "fa-solid fa-hot-tub-person",
    'pool': "fa-solid fa-person-swimming",
    'barbecue': "fa-solid fa-utensils",
    'waterfront': "fa-solid fa-ship",
    'ski slope': "fa-solid fa-person-skiing",
    'forest': "fa-solid fa-tree",
    'center': "fa-solid fa-city"
}

const detailsTemp = (room, hasUser, onDelete, onBook, onAccept, onReject, selectedFeatures) => html`
<link rel="stylesheet" href="/static/details.css">
<h2>${room.name}</h2>
<p id="location"><i class="fa-solid fa-location-dot"></i> Location: ${room.location}</p>
<p id="beds"><i class="fa-solid fa-bed"></i> Beds: ${room.beds}</p>
<p id="price"><i class="fa-solid fa-coins"></i> Price: ${room.price} &#36;</p>
<p id="description">${room.description}</p>
<img id="head-img" src=${room.imgUrl} alt="room">

${selectedFeatures ? html`
        <h3 id="amenities-head">Amenities</h3>
        <ul id="amenities">
            ${selectedFeatures.map(feature => html`
                <li id="amenities-li"><i class=${emoji[feature]}></i>
                    ${feature}
                </li>
            `)}
        </ul>
    ` : nothing}

${room.isOwner ? html`
<a href="/edit/${room.objectId}" id="editBtn">Edit</a>
<a @click=${onDelete} href="javascript:void(0)" id="deleteBtn">Delete</a>` : nothing}

${hasUser && !room.isOwner ? reservationForm(onBook) : nothing}

${hasUser && room.isOwner ? html`

<ul>
    ${repeat(room.reservations, r => r.objectId, (res) => reservationCard(res, onAccept, onReject))}
</ul>` : nothing}`;

const reservationForm = (onSubmit) => html`
    <h3 id="calendar-head">Make your reservation NOW<h3>
<form @submit=${onSubmit} class="calendar">
    <label>From <input type="date" name="startDate"></label>
    <label>To <input type="date" name="endDate"></label>
    <button>Request reservation</button>    
</form>`;

const reservationCard = (res, onAccept, onReject) => {
    if (res.status === 'waiting') {
        return html`
        <h3 id="requests">Requests</h3>
            <li id="request-list">
                Requested by: ${res.owner.username} <br>
                From: ${res.startDate.toISOString().slice(0, 10)}<br>
                To: ${res.endDate.toISOString().slice(0, 10)}<br>
                <a @click=${onAccept} href="javascript:void(0)" class="accept-link">Accept</a>
                <a @click=${onReject} href="javascript:void(0)" class="reject-link">Reject</a>
            </li>`;
    } else {
        return html`
        <h3 id="requests">Requests</h3>
            <li id="request-list">
                Requested by: ${res.owner.username} <br>
                From: ${res.startDate.toISOString().slice(0, 10)}<br>
                To: ${res.endDate.toISOString().slice(0, 10)}<br>
                <p>You have ${res.status === 'accepted' ? 'accepted' : 'rejected'} this request!</p>
            </li>`;
    }
};

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

    ctx.render(detailsTemp(ctx.data, hasUser, onDelete, submitHandler(book), onAccept, onReject, room.features));


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

        const reservationForm = document.querySelector('.calendar');
        reservationForm.reset();

        notify('Your request was send!')
        const result = await reservationService.create(reservationData, ctx.user.objectId);
        ctx.page.redirect('/rooms/' + id);
    }
}