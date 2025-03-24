# CLAUDE.md - GeoHeim Frontend Project Guidelines

## Build/Test/Lint Commands
```bash
# Start local server (using simple HTTP server)
python -m http.server 8000

# Validate JavaScript
eslint *.js

# Run a specific test
node tests/test_name.js
```

## Code Style Guidelines
- **Tech Stack**: Pure JavaScript, HTML, CSS (no frameworks)
- **File Structure**: Separate files for HTML, CSS, and JS
- **API Calls**: Use fetch API for data requests, EventSource for SSE streams
- **Naming**: camelCase for variables/functions, lowercase-hyphen for filenames
- **Authentication**: Basic authentication skipped for initial development
- **DOM Manipulation**: Use vanilla JS methods (querySelector, createElement)
- **Error Handling**: Try/catch blocks for API calls with user-friendly messages
- **Event Handling**: Use event delegation where appropriate
- **IDs Format**: Follow API specs for prefixed UUIDs (chat-XXX, pet-XXX)
- **Pagination**: Implement cursor-based pagination using provided timestamps
- **Comments**: Document complex logic and API integrations