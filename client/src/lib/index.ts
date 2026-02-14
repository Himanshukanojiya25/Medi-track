// src/lib/index.ts

import * as Api from './api';
import * as Cache from './cache';
import * as Logger from './logger';
import * as Monitoring from './monitoring';
import * as RateLimiter from './rate-limiter';
import * as Storage from './storage';
import * as Validation from './validation';

export {
  Api,
  Cache,
  Logger,
  Monitoring,
  RateLimiter,
  Storage,
  Validation
};

// Ya fir default export bhi kar sakte ho
export default {
  Api,
  Cache,
  Logger,
  Monitoring,
  RateLimiter,
  Storage,
  Validation
};