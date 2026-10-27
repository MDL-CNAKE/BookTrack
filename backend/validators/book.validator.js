const { z } = require('zod');
const { text, googleId, page } = require('./common.validator');

const searchQuery = z.object({
  q: text('q').trim().min(1, 'q is required').max(200, 'q must be at most 200 characters'),
  page: page.default(1),
});

const googleIdParams = z.object({ googleId });

module.exports = { searchQuery, googleIdParams };
