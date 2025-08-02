module.exports = {
  onActivate(context) {
    context.log('Hello, CodePal!');
  },
  onCommand(context, command) {
    if (command === 'sayHello') {
      context.notify('Hello from your plugin!');
    }
  },
}; 