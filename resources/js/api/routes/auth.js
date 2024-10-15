export default {
  authAuthorize(params) {
    return this.send('post', this.apiUrl('/auth/login'), params);
  },

  authRefreshToken(refresh_token) {
    return this.send('post', this.apiUrl('/auth/refresh'), { refresh_token });
  },

  authLogout() {
    return this.send('post', this.apiUrl('/auth/logout'));
  },

  authCheckAuth() {
    return this.send('get', this.apiUrl('/auth/check'));
  },
}
