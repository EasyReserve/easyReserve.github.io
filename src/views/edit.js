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
    
    <h3>Amenities</h3>
    
        <input type="checkbox" name="feat" value="wifi"> Wifi
        <input type="checkbox" name="feat" value="tv"> TV
        <input type="checkbox" name="feat" value="parking"> Parking
        <input type="checkbox" name="feat" value="fitness"> Fitness
        <input type="checkbox" name="feat" value="kitchen"> Kitchen
        <input type="checkbox" name="feat" value="washer"> Washer
        <input type="checkbox" name="feat" value="dryer"> Dryer
        <input type="checkbox" name="feat" value="air conditioning"> Air conditioning
        <input type="checkbox" name="feat" value="fireplace"> Fireplace
        <input type="checkbox" name="feat" value="jacuzzi"> Jacuzzi
        <input type="checkbox" name="feat" value="pool"> Pool
        <input type="checkbox" name="feat" value="barbecue"> Barbecue
        <input type="checkbox" name="feat" value="waterfront"> Waterfront
        <input type="checkbox" name="feat" value="ski slope"> Ski slope
        <input type="checkbox" name="feat" value="forest"> Forest
        <input type="checkbox" name="feat" value="center"> Center

    <button>Save Changes</button>
</form>`;

export async function editView(ctx) {
    const id = ctx.params.id;
    ctx.render(editTemp(ctx.data, submitHandler(onSubmit)));

    async function onSubmit({ name, location, beds, openForBooking, price, imgUrl, description, promo }) {

        beds = parseInt(beds);
        price = Number(price);

        const features = [];
        document.querySelectorAll('input[name="feat"]:checked').forEach((checkbox) => {
            features.push(checkbox.value);
        });

        openForBooking = Boolean(openForBooking);
        promo = Boolean(promo);

        if (name == '' || location == '' || Number.isNaN(beds) || price == '' || imgUrl == '' || description == '') {
            return notify('All fields are required!');
        }

        const userId = ctx.user.objectId;

        await roomService.update(id, { name, location, beds, openForBooking, price, imgUrl, description, promo, features }, userId);

        ctx.page.redirect('/rooms/' + id);
    }

}