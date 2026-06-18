#!/usr/bin/env node

/**
 * Code Structure Validation
 * Validates that all required files exist and have correct exports
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let validationResults = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: [],
};

function validateFile(filePath, description) {
  validationResults.total++;
  const fullPath = path.join(__dirname, filePath);

  try {
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.trim().length === 0) {
      throw new Error(`File is empty: ${filePath}`);
    }

    validationResults.passed++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } catch (error) {
    validationResults.failed++;
    validationResults.errors.push(error.message);
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
  }
}

function validateExport(filePath, exportName, description) {
  validationResults.total++;
  const fullPath = path.join(__dirname, filePath);

  try {
    const content = fs.readFileSync(fullPath, 'utf8');

    const exportPatterns = [
      new RegExp(`module\\.exports\\s*=.*${exportName}`),
      new RegExp(`export\\s+(default\\s+)?${exportName}`),
      new RegExp(`module\\.exports\\.${exportName}`),
    ];

    const hasExport = exportPatterns.some(pattern => pattern.test(content));

    if (!hasExport) {
      throw new Error(`Export "${exportName}" not found in ${filePath}`);
    }

    validationResults.passed++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } catch (error) {
    validationResults.failed++;
    validationResults.errors.push(error.message);
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
  }
}

console.log(`\n${colors.blue}=== BACKEND STRUCTURE VALIDATION ===${colors.reset}\n`);

console.log(`${colors.yellow}Models:${colors.reset}`);
validateFile('src/models/user.model.js', 'User Model');
validateFile('src/models/card.model.js', 'Card Model');
validateFile('src/models/transaction.model.js', 'Transaction Model');
validateFile('src/models/route.model.js', 'Route Model');
validateFile('src/models/notification.model.js', 'Notification Model');

console.log(`\n${colors.yellow}Controllers:${colors.reset}`);
validateFile('src/controllers/auth.controller.js', 'Auth Controller');
validateFile('src/controllers/card.controller.js', 'Card Controller');
validateFile('src/controllers/transaction.controller.js', 'Transaction Controller');
validateFile('src/controllers/route.controller.js', 'Route Controller');
validateFile('src/controllers/notification.controller.js', 'Notification Controller');
validateFile('src/controllers/user.controller.js', 'User Controller');

console.log(`\n${colors.yellow}Routes:${colors.reset}`);
validateFile('src/routes/auth.routes.js', 'Auth Routes');
validateFile('src/routes/card.routes.js', 'Card Routes');
validateFile('src/routes/transaction.routes.js', 'Transaction Routes');
validateFile('src/routes/route.routes.js', 'Route Routes');
validateFile('src/routes/notification.routes.js', 'Notification Routes');
validateFile('src/routes/user.routes.js', 'User Routes');
validateFile('src/routes/payment.routes.js', 'Payment Routes');
validateFile('src/routes/recharge.routes.js', 'Recharge Routes');

console.log(`\n${colors.yellow}Middleware:${colors.reset}`);
validateFile('src/middleware/auth.middleware.js', 'Auth Middleware');
validateFile('src/middleware/error.middleware.js', 'Error Middleware');

console.log(`\n${colors.yellow}Configuration:${colors.reset}`);
validateFile('src/config/db.js', 'Database Config');
validateFile('src/app.js', 'Express App');
validateFile('.env', '.env File');

console.log(`\n${colors.blue}=== FRONTEND SERVICES VALIDATION ===${colors.reset}\n`);

const frontendPath = '../src/services/api';

console.log(`${colors.yellow}API Services:${colors.reset}`);
try {
  const apiDir = path.join(__dirname, frontendPath);
  if (fs.existsSync(apiDir)) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.js'));
    console.log(`Found ${files.length} service files:`);
    
    const expectedServices = [
      'apiClient.js',
      'authservice.js',
      'cardservice.js',
      'transactionservice.js',
      'rechargeservice.js',
      'userservice.js',
      'routeservice.js',
      'notificationservice.js',
    ];

    for (const service of expectedServices) {
      validationResults.total++;
      const fullPath = path.join(apiDir, service);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0) {
        validationResults.passed++;
        console.log(`${colors.green}✓${colors.reset} ${service}`);
      } else {
        validationResults.failed++;
        console.log(`${colors.red}✗${colors.reset} ${service}`);
      }
    }
  }
} catch (error) {
  console.log(`${colors.red}Error checking frontend services: ${error.message}${colors.reset}`);
}

// Summary
console.log(`\n${colors.blue}=== VALIDATION SUMMARY ===${colors.reset}`);
console.log(`Total Checks: ${validationResults.total}`);
console.log(`${colors.green}Passed: ${validationResults.passed}${colors.reset}`);
if (validationResults.failed > 0) {
  console.log(`${colors.red}Failed: ${validationResults.failed}${colors.reset}`);
}
console.log(
  `Success Rate: ${((validationResults.passed / validationResults.total) * 100).toFixed(2)}%\n`
);

if (validationResults.failed === 0) {
  console.log(`${colors.green}✓ All files and structure validated successfully!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}✗ Some validation checks failed!${colors.reset}\n`);
  process.exit(1);
}
