import { register } from "../data/user.js";
import { html } from "../lib/lit-html.js";
import { notify } from "../notify.js";
import { submitHandler } from "../util.js";

const registerTemp = (onSubmit) => html`
<h2>Register</h2>
<form @submit=${onSubmit}>    
    <img src="https://www.cvent.com/sites/default/files/image/2021-10/hotel%20room%20with%20beachfront%20view.jpg" alt="hotelRroomRegister">
    <link rel="stylesheet" href="/static/register.css">
    <label>Email <input type="text" name="email"></label>
    <label>Username <input type="text" name="username"></label>
    <label>Password <input type="password" name="password"></label>
    <label>Repeat <input type="password" name="repass"></label>
    <button>Register</button>
</form>`;

export function registerView(ctx){
    ctx.render(registerTemp(submitHandler(onRegister)));

    async function onRegister({email, username, password, repass}){
        if(email == '' || username == '' || password == ''){
            return notify('All fields are required!')
        };
        if(password != repass){
            return notify('Passwords must match!')
        }

        await register(email, username, password);
        ctx.page.redirect('/rooms');
    }
}