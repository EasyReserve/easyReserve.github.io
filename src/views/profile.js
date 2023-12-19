import { html } from "../lib/lit-html.js";
import { getUserData } from "../util.js";
import * as roomService from "../data/room.js";
import * as resServire from '../data/reservation.js'

const profileTemp = (items, userData, reservationTemplates, ownReservationsTemp) => html`
<link rel="stylesheet" href="/static/profile.css">
<h3 id="host">Requests about your rooms:</h3>
<h3 id="owner">Your own room requests:</h3>
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
        : html`
            <div class="no-events">
                <p>This user has no posts yet!</p>
            </div>`}

            ${reservationTemplates.length >= 1 ? reservationTemplates : html`<h4>No requests yet!</h4>`} 
            ${ownReservationsTemp.length >= 1 ? ownReservationsTemp : html`<h4 id="own">You dont have any reservations!</h4>`} 
            
    </div>
</section>`;

const resTemp = (reservation) => html`
<div class="reservation-card ${getStatusClass(reservation.status)}">
    <p>Hosted by: ${reservation.owner.username}</p>
    <p>Start Date: ${reservation.startDate.iso.slice(0, 10)}</p>
    <p>End Date: ${reservation.endDate.iso.slice(0, 10)}</p>
    <p>You ${reservation.status} this request!</p>
    <a href="/rooms/${reservation.room.objectId}" class="details-requests">Details</a>
</div>`;

const ownResTemp = (reservation) => html`
  <div class="own-reservation-card ${getStatusClass(reservation.status)}">
    <p>Hosted by: You</p>
    <p>Start Date: ${reservation.startDate.iso.slice(0, 10)}</p>
    <p>End Date: ${reservation.endDate.iso.slice(0, 10)}</p>
    <p>Status: ${reservation.status}</p>
    <a href="/rooms/${reservation.room.objectId}" class="details-requests-own">Details</a>
  </div>`;

function getStatusClass(status) {
    switch (status) {
        case 'waiting':
            return 'waiting-status';
        case 'accepted':
            return 'accepted-status';
        case 'rejected':
            return 'rejected-status';
        default:
            return '';
    }
}

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

const oneDay = 24 * 60 * 60 * 1000;

export async function profileView(ctx) {
    const userData = getUserData();
    const { results: rooms } = await roomService.getAll(ctx.user?.objectId);

    const hostReservations = await resServire.getByHost(userData.objectId);
    const reservationTemplates = hostReservations.results.map(r => resTemp(r));


    const ownReservations = await resServire.getByOwner(userData.objectId)

    const filteredOwnReservations = ownReservations.results.filter( async (r) => {
        const isNotWaiting = r.status !== 'waiting';
        const isOlderThanOneDay = Date.now() - new Date(r.updatedAt).getTime() > oneDay;

        if (isNotWaiting && isOlderThanOneDay) {
            console.log(r.objectId);
            await resServire.deleteById(r.objectId);
            return false; 
        }

        return true;
    });


    const ownReservationsTemp = filteredOwnReservations.map(r => ownResTemp(r));


    if (ctx.user) {
        rooms.forEach(r => r.isOwner = r.owner.objectId == ctx.user.objectId);
    }

    ctx.render(profileTemp(rooms, userData, reservationTemplates, ownReservationsTemp));
}
