module.exports = {
  onFileSave(context, file) {
    // TODO: Trigger deployment pipeline on file save
    context.notify('Deployment triggered for recent changes.');
  },
}; 