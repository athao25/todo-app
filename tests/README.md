# Testing Documentation

This directory contains comprehensive testing infrastructure for the Todo application, including end-to-end tests, API testing, and Postman collections.

## Directory Structure

```
tests/
├── README.md                           # This documentation
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Test dependencies
├── e2e/                                # End-to-end tests
│   ├── api/                            # API-specific tests
│   │   └── todo-api-tests.spec.ts      # API test specifications
│   └── ui/                             # User interface tests
│       └── todo-smoke-tests.spec.ts    # UI test specifications
├── pages/                              # Page Object Model
│   ├── basePage.ts                     # Base page class
│   ├── todoPage.ts                     # Todo page object
│   └── page_fixtures.ts                # Playwright fixtures
├── api-client/                         # API client utilities
│   └── todoApiClient.ts                # API client for testing
├── fixtures/                           # Test data and fixtures
│   ├── test-data.ts                    # Test data constants
│   └── todo-fixtures.ts                # Advanced fixtures
├── postman/                            # Postman collections
│   ├── Todo_API_Collection.postman_collection.json
│   ├── Local_Environment.postman_environment.json
│   ├── Development_Environment.postman_environment.json
│   ├── Staging_Environment.postman_environment.json
│   └── Production_Environment.postman_environment.json
└── config/                             # Environment configurations
    ├── .env.local                      # Local development environment
    ├── .env.production                 # Production environment (Render)
    └── .env.example                    # Environment template
```

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (if not already installed)
npx playwright install
```

### Run Playwright Tests

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:ui          # UI tests only
npm run test:api         # API tests only

# Run tests against different environments
npm run test:e2e:local      # Local development
npm run test:e2e:staging    # Staging environment
npm run test:e2e:production # Production environment

# Run with browser visible
npm run test:headed

# Run with UI mode for debugging
npm run test:ui-mode
```

## Postman API Testing

### Import Postman Files

1. **Import Collection**: Import `postman/Todo_API_Collection.postman_collection.json`
2. **Import Environments**: Import the environment files for your target environment:
   - `Local_Environment.postman_environment.json` - For local development
   - `Development_Environment.postman_environment.json` - For dev environment
   - `Staging_Environment.postman_environment.json` - For staging
   - `Production_Environment.postman_environment.json` - For production

### Postman Collection Features

The Postman collection includes comprehensive API testing:

#### **Health Check**
- ✅ API health status verification

#### **Todo CRUD Operations**
- ✅ Create new todos
- ✅ Get all todos
- ✅ Get todo by ID
- ✅ Update existing todos
- ✅ Delete todos

#### **Validation Tests**
- ✅ Empty title validation
- ✅ Whitespace-only title validation
- ✅ Maximum length validation (250 characters)
- ✅ Exceeding maximum length validation

#### **Edge Cases & Special Characters**
- ✅ Special characters (`!@#$%^&*()`)
- ✅ Unicode characters and emojis (📝 ✅ 🚀)
- ✅ International characters (Ñoël, café, 北京, москва)

#### **Error Handling**
- ✅ Non-existent resource handling (404 responses)
- ✅ Invalid request validation (400 responses)

#### **Automatic Cleanup**
- ✅ Cleans up test data after execution
- ✅ Dynamic variables for data management

### Environment Configuration

Each environment file contains:
- `base_url` - API base URL
- `api_version` - API version
- `environment` - Environment identifier
- `timeout` - Request timeout settings
- `api_key` - Authentication keys (where applicable)
- Dynamic variables for test data management

## Testing Framework Architecture

### Page Object Model (POM)

The testing framework uses a sophisticated Page Object Model pattern:

#### **Base Page** (`pages/basePage.ts`)
```typescript
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async goto(base_url: string) {
    await this.page.goto(base_url);
  }
}
```

#### **Todo Page** (`pages/todoPage.ts`)
Comprehensive page object with methods for:
- Navigation and page loading
- Todo creation and management
- Filtering and bulk operations
- Assertion helpers and validation
- Time display testing

#### **API Client** (`api-client/todoApiClient.ts`)
Robust API client featuring:
- Full CRUD operations
- Response validation helpers
- Error handling utilities
- Test data management
- Assertion methods

### Page Fixtures Pattern

The framework implements the Checkly-recommended page fixtures pattern:

```typescript
// pages/page_fixtures.ts
interface TestFixtures {
  todoPage: TodoPage;
  todoApiClient: TodoApiClient;
}

export const test = base.extend<TestFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigateToApp();
    await use(todoPage);
  },
  
  todoApiClient: async ({ request }, use) => {
    const todoApiClient = new TodoApiClient(request);
    await todoApiClient.deleteAllTodos(); // Setup
    await use(todoApiClient);
    await todoApiClient.deleteAllTodos(); // Cleanup
  },
});
```

### Usage in Tests

```typescript
import { test, expect } from '../pages/page_fixtures';

test('should create a new todo', async ({ todoPage, todoApiClient }) => {
  // Page object automatically navigated and ready
  await todoPage.addTodo('Test Todo');
  await todoPage.expectTodoCount(1);
  
  // API client automatically set up with clean data
  const response = await todoApiClient.getAllTodos();
  expect(response.data).toHaveLength(1);
});
```

## Advanced Testing Features

### Test Data Management

```typescript
// fixtures/test-data.ts
export const TestTodos = {
  valid: [
    { title: 'Complete project documentation' },
    { title: 'Review pull request' },
    { title: 'Deploy to staging' }
  ],
  edge_cases: [
    { title: 'Special chars: !@#$%^&*()' },
    { title: 'Unicode: 📝 Todo with emojis ✅ 🚀' },
    { title: 'X'.repeat(250) } // Max length
  ]
};
```

### Multiple Test Fixtures

The framework provides specialized fixtures for different scenarios:

```typescript
// Clean database environment
export const testWithCleanDb = test.extend<TodoFixtures>({...});

// Pre-populated test data
export const testWithData = test.extend<TodoFixtures>({...});

// API-only testing (no UI)
export const apiTest = base.extend<Pick<TodoFixtures, 'todoApiClient'>>({...});

// Performance testing with large datasets
export const performanceTest = test.extend<TodoFixtures & { performanceData: void }>({...});

// Mobile viewport testing
export const mobileTest = test.extend<TodoFixtures>({...});
```

### Comprehensive Test Coverage

#### **UI Tests** (`e2e/ui/todo-smoke-tests.spec.ts`)
- Application loading and navigation
- Todo creation and management
- Input validation and error handling
- Filtering and bulk operations
- Data persistence and reload testing
- Responsive design (mobile/tablet)
- Time display formatting
- Network error handling

#### **API Tests** (`e2e/api/todo-api-tests.spec.ts`)
- Health check verification
- Complete CRUD operations
- Data validation and constraints
- Special characters and Unicode support
- Concurrent operations testing
- Performance testing with large datasets
- Error handling for edge cases

## Environment Configuration

### Environment Files

Environment files in `tests/config/` contain:
- `BASE_URL` - Frontend application URL
- `API_URL` - Backend API URL  
- `ENVIRONMENT` - Environment identifier

### Dynamic Environment Management

```bash
# Update service URLs automatically
npm run test:update-urls

# Use flexible environment script
node tests/scripts/test-env.js staging --headed
node tests/scripts/test-env.js production --ui
```

## TypeScript Configuration

The testing framework uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Naming Conventions

The project follows TypeScript best practices:
- **camelCase** for files: `todoPage.ts`, `basePage.ts`, `todoApiClient.ts`
- **kebab-case** for test specs: `todo-smoke-tests.spec.ts`
- **PascalCase** for classes: `TodoPage`, `TodoApiClient`, `BasePage`

## CI/CD Integration

Tests automatically run in GitHub Actions:
- Triggered after successful deployment
- Runs against staging environment
- Uploads test reports as artifacts
- Fails deployment pipeline if tests fail
- Supports parallel execution across environments

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run test` | Run all tests |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui-mode` | Interactive UI mode |
| `npm run test:e2e:local` | Test against localhost |
| `npm run test:e2e:staging` | Test against staging |
| `npm run test:e2e:production` | Test against production |
| `npm run test:update-urls` | Update service URLs |
| `npm run test:report` | Open test report |

## Best Practices

### Page Object Model
- ✅ Encapsulate page interactions
- ✅ Use descriptive method names
- ✅ Implement wait strategies
- ✅ Provide assertion helpers

### Test Organization
- ✅ Group related tests in describe blocks
- ✅ Use meaningful test descriptions
- ✅ Implement proper setup/teardown
- ✅ Handle test data cleanup

### Data Management
- ✅ Use fixtures for consistent test data
- ✅ Implement dynamic data generation
- ✅ Clean up after tests
- ✅ Isolate test scenarios

### API Testing
- ✅ Test all CRUD operations
- ✅ Validate response structures
- ✅ Handle error scenarios
- ✅ Test edge cases and validation

## Troubleshooting

### Common Issues

#### Environment Not Found
```bash
# Ensure environment files exist
ls tests/config/

# Create missing environment file
cp tests/config/.env.example tests/config/.env.local
```

#### Connection Timeouts
```bash
# Verify service URLs are accessible
curl -I https://your-api-url/api/health

# Update URLs if needed
npm run test:update-urls
```

#### Test Failures
```bash
# Open detailed test report
npm run test:report

# Run specific test with debug info
npx playwright test todo-smoke-tests.spec.ts --debug
```

#### Postman Import Issues
1. Ensure you're importing the collection JSON file, not the environment file
2. Import environments separately after importing the collection
3. Select the appropriate environment before running requests

### Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test file in debug mode  
npx playwright test e2e/ui/todo-smoke-tests.spec.ts --debug

# Generate trace for failed tests
npx playwright test --trace on
```

### Test Reports

Playwright generates comprehensive reports:
- HTML reports with screenshots and videos
- JUnit XML for CI/CD integration
- Trace files for detailed debugging
- Performance metrics and timing data

## Contributing

When adding new tests:

1. Follow the established Page Object Model pattern
2. Use the page fixtures for consistent setup
3. Add appropriate assertions and error handling
4. Update this README with new features
5. Ensure tests work across all environments
6. Add corresponding Postman requests for API changes

For detailed implementation examples, see existing test files in the `e2e/` directory.