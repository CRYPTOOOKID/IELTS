# Logger Utility Guide

## Overview
The logger utility (`src/utils/logger.js`) controls console output based on the environment:
- **Development**: Shows all console logs (normal behavior)
- **Production**: Suppresses all console logs (clean production environment)

## Usage

### Import the Logger
```javascript
import logger from '../utils/logger';
// or
import { logger } from '../utils/logger';
```

### Replace Console Methods
Instead of using `console.log`, `console.warn`, `console.error`, use the logger:

```javascript
// Old way (shows in production)
console.log('Debug message');
console.warn('Warning message');
console.error('Error message');

// New way (only shows in development)
logger.log('Debug message');
logger.warn('Warning message');
logger.error('Error message');
logger.info('Info message');
```

### Benefits
- **Clean Production**: No console clutter in production builds
- **Development-Friendly**: All logs still show during local development
- **Easy Migration**: Simple find-and-replace to update existing code

### Already Updated Files
- `src/components/Auth/AuthContext.jsx` - Uses logger for AWS config warnings

### Next Steps
To update other files, simply:
1. Import the logger utility
2. Replace `console.log` with `logger.log`
3. Replace `console.warn` with `logger.warn`
4. Replace `console.error` with `logger.error`

This ensures your production site stays clean while maintaining debugging capabilities during development. 


old

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Favicons - Using the new SPINTA logo -->
    <link rel="icon" type="image/x-icon" href="/logo.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/logo.ico" />
    
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://cognito-idp.us-east-1.amazonaws.com https://xguxnr9iu0.execute-api.us-east-1.amazonaws.com https://jjsmfiikybhgha37vrlcpipu2y.appsync-api.us-east-1.amazonaws.com https://generativelanguage.googleapis.com https://api.deepseek.com https://yeo707lcq4.execute-api.us-east-1.amazonaws.com https://8l1em9gvy7.execute-api.us-east-1.amazonaws.com https://80yhq8e9rl.execute-api.us-east-1.amazonaws.com https://h5gf4jspy7.execute-api.us-east-1.amazonaws.com;">
    <title>Spinta</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
