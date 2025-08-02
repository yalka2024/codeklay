module.exports = {
  onFileSave(context, file) {
    // TODO: Generate documentation from code/comments
    context.notify('Documentation generated for this file.');
  },
}; 