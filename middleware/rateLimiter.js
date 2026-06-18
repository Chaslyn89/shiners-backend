<<<<<<< HEAD
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    }
});

=======
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    }
});

>>>>>>> 744bbc598b2277960450371e7b341eb0eff9b53d
module.exports = loginLimiter;