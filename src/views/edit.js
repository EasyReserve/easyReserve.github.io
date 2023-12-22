import { html } from "../lib/lit-html.js";

import * as roomService from '../data/room.js'
import { submitHandler } from "../util.js";
import { notify } from "../notify.js";

const editTemp = (room, onSubmit) => html`
<h2>Edit Room</h2>
<form @submit=${onSubmit}>
    <link rel="stylesheet" href="/static/edit.css">
    <img src=${room.imgUrl} alt="hotelRroomLogin">
    <label>Name: <input type="text" name="name" .value=${room.name} ></label>
    <label>Location: <input type="text" name="location" .value=${room.location} ></label>
    <label>Beds: <input type="number" name="beds" .value=${room.beds} ></label>
    <label>Price: <input type="number" name="price" .value=${room.price} ></label>
    <label>Description: <textarea id="description" name="description" rows="4" cols="52" .value=${room.description} ></textarea></label>
    <label>ImageURL: <input type="url" alt="room" name="imgUrl" .value=${room.imgUrl} ></label>
    <label>Open for booking: <input type="checkbox" name="openForBooking" .checked=${room.openForBooking} ></label>   
    <label>Promo price: <input type="checkbox" name="promo" .checked=${room.promo} ></label>

    <button>Save Changes</button>
</form>`;

export async function editView(ctx) {
    const id = ctx.params.id;
    ctx.render(editTemp(ctx.data, submitHandler(onSubmit)));

    async function onSubmit({ name, location, beds, openForBooking, price, imgUrl, description, promo}) {
        beds = parseInt(beds);
        price = Number(price)

        openForBooking = Boolean(openForBooking);
        promo = Boolean(promo);

        if(name == '' || location == '' || Number.isNaN(beds) || price == '' || imgUrl == '' || description == ''){
            return notify('All fields are required!');
        }

        const userId = ctx.user.objectId;
        
        await roomService.update(id, {name, location, beds, openForBooking, price, imgUrl, description, promo}, userId);

        ctx.page.redirect('/rooms/' + id);
    }
}