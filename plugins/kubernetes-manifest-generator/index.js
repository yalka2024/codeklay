module.exports = {
  onCommand(context, command) {
    if (command === 'generateK8sManifest') {
      // TODO: Generate Kubernetes manifest from project config
      context.notify('Kubernetes manifest generated.');
    }
  },
}; 