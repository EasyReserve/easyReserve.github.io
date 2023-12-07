export function addUserNav(navTemp){
    let hasUser = null;

    return function (ctx, next){
        if(Boolean(ctx.user) !== hasUser){
            hasUser = Boolean(ctx.user);
            ctx.renderNav(navTemp(hasUser));
        }
        next();
    };
}