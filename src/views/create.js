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
    <label>Promo price: <input type="checkbox" name="promo"></label>
    
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

    <button>Create Room</button>
</form>`;

export async function createView(ctx) {
    ctx.render(createTemp(submitHandler(onSubmit)));

    async function onSubmit({ name, location, beds, openForBooking, price, imgUrl, description , promo}) {
        beds = parseInt(beds);
        price = Number(price);

        const features = [];
        document.querySelectorAll('input[name="feat"]:checked').forEach((checkbox) => {
            features.push(checkbox.value);
        });

        openForBooking = Boolean(openForBooking);
        promo = Boolean(promo);


        if(name == '' || location == '' || Number.isNaN(beds) || price == '' || imgUrl == '' || description == ''){
            return notify('All fields are required!');
        }

        const userId = ctx.user?.objectId;
        
        const result = await roomService.create({name, location, beds, openForBooking, price, imgUrl, description, promo, features}, userId);

        ctx.page.redirect('/rooms/' + result.objectId);
    }
}