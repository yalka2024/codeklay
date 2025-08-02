module.exports = {
  onCodeReview(context, file) {
    // TODO: Provide live AI-powered code review suggestions
    return [{
      line: 1,
      message: 'Example: Consider refactoring this function.',
      severity: 'info',
    }];
  },
}; 