import { html } from "../lib/lit-html.js";

import * as roomService from '../data/room.js'
import { submitHandler } from "../util.js";
import { notify } from "../notify.js";

const createTemp = (onSubmit) => html`
<h2>Host Room</h2>
<form @submit=${onSubmit}>
    <img src="https://cdn.loewshotels.com/loewshotels.com-2466770763/cms/cache/v2/5f5a6e0d12749.jpg/1920x1080/fit/80/86e685af18659ee9ecca35c465603812.jpg" alt="hotelRroom">
    <link rel="stylesheet" href="/static/create.css">
    <label>Name: <input type="text" name="name"></label>
    <label>Location: <input type="text" name="location"></label>
    <label>Beds: <input type="number" name="beds"></label>
    <label>Price: <input type="number" name="price"></label>
    <label>Description: <textarea id="description" name="description" rows="4" cols="52"></textarea></label>
    <label>ImageURL: <input type="url" alt="room" name="imgUrl"></label>
    <label>Open for booking: <input type="checkbox" name="openForBooking"></label>
    <button>Create Room</button>
</form>`;

export async function createView(ctx) {
    ctx.render(createTemp(submitHandler(onSubmit)));

    async function onSubmit({ name, location, beds, openForBooking, price, imgUrl, description }) {
        beds = parseInt(beds);
        price = Number(price)

        openForBooking = Boolean(openForBooking);


        if(name == '' || location == '' || Number.isNaN(beds) || price == '' || imgUrl == '' || description == ''){
            return notify('All fields are required!');
        }

        const userId = ctx.user?.objectId;
        
        const result = await roomService.create({name, location, beds, openForBooking, price, imgUrl, description}, userId);

        ctx.page.redirect('/rooms/' + result.objectId);
    }
}