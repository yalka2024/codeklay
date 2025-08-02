module.exports = {
  onFileSave(context, file) {
    // TODO: Format and lint code using AI
    context.notify('Code formatted using AI.');
  },
}; 