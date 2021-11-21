// Custom Configuration Options

// Set the environment variable SKIP_API_DOCS=1 to skip Rush Stack API docs.
//
// Specifically:
//   - Avoid generating the files in docs/api/**
//   - Do not include the data/api_nav.json sidebar file
//   - Suppress the "API" top navbar item
//
// This setting can be helpful for quick iterations on site config, as it
// drops the startup time of "rushx start" significantly.
const SKIP_API_DOCS = process.env.SKIP_API_DOCS === '1';

module.exports = {
    SKIP_API_DOCS
};
