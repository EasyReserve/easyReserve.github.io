import { login } from "../data/user.js";
import { html } from "../lib/lit-html.js";
import { notify } from "../notify.js";
import { submitHandler } from "../util.js";

const loginTemp = (onSubmit) => html`
<h2>Login</h2>
<form @submit=${onSubmit}>
    <link rel="stylesheet" href="/static/login.css">
    <img src="https://sthotelsmalta.com/wp-content/uploads/2022/06/modern-luxury-bedroom-suite-and-bathroom-with-working-table-scaled.jpg" alt="hotelRroomLogin">
    <label>Email <input type="text" name="email"></label>
    <label>Password <input type="password" name="password"></label>
    <button>Login</button>
</form>`;

export function loginView(ctx){
    ctx.render(loginTemp(submitHandler(onLogin)));

    async function onLogin({email, password}){
        if(email == '' || password == ''){
            return notify('All fields are required!')
        };

        await login(email, password);
        ctx.page.redirect('/rooms');
    }
}