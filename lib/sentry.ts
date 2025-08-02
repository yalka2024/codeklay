import * as Sentry from '@sentry/nextjs';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      if (event.exception) {
        console.error('Sentry captured exception:', event.exception);
      }
      return event;
    },
    beforeSendTransaction(event) {
      if (event.transaction === '/api/health') {
        return null;
      }
      return event;
    },
  });
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;
export const addBreadcrumb = Sentry.addBreadcrumb;
export const setTag = Sentry.setTag;
export const setContext = Sentry.setContext;

export const withSentry = (fn: Function) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error);
      throw error;
    }
  };
};

export const measurePerformance = (name: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const transaction = Sentry.startTransaction({ name });
      try {
        const result = originalMethod.apply(this, args);
        if (result instanceof Promise) {
          return result.finally(() => transaction.finish());
        }
        transaction.finish();
        return result;
      } catch (error) {
        transaction.setStatus('internal_error');
        transaction.finish();
        throw error;
      }
    };
    return descriptor;
  };
};
