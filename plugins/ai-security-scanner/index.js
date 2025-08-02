module.exports = {
  onCodeReview(context, file) {
    // TODO: Use AI to scan for security vulnerabilities
    return [{
      line: 1,
      message: 'Example: Potential security issue found.',
      severity: 'high',
    }];
  },
}; 