export default {
  uploadTextEditorImage(payload) {
    return this.send('post', this.apiUrl(`/text-editor/file`), payload);
  },

  getShortInfoById(payload) {
    return this.send('get', this.apiUrl(`/text-editor/short-info`), payload);
  },
};
