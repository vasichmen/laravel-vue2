export const auth = async ({ next, store, to }) => {
  if (! store.getters['auth/checked']) {
    await store.dispatch('auth/authCheckAuth');
  }

  if (! store.getters['auth/authorizedUserInfo']?.id) {

    return next({
      name: 'index',
      query: {
        open_modal: 'auth',
        back_route_name: to.name,
        back_route_params: JSON.stringify(to.params),
        back_route_query: JSON.stringify(to.query),
      },
    });
  }

  return next();
};
