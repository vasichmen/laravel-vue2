export default function can(permission) {
    return function ({ next, store, to }) {
        if (
            !store.state.auth.user.authorize.data?.user?.id ||
            !store.state.auth.user.authorize.data?.user?.permissions.includes(permission)
        ) {
            return next({
                name: 'auth_page',
                query: {
                    back_route_name: to.name,
                    back_route_params: JSON.stringify(to.params),
                    back_route_query: JSON.stringify(to.query),
                },
            });
        }
        return next();
    };


}
