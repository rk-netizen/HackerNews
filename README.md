## What it does

- Shows top and new stories from Hacker News
- Search through stories by title, author, or URL
- Click story titles to read full articles
- Load more stories as you scroll down

## How to run it

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

## Tech stuff I used

- **Angular 20** - with the new signals feature
- **TypeScript** - for type safety
- **Tailwind CSS** - for quick styling
- **Jest** - for testing (switched from Karma)

## Testing

Run all tests:

```bash
npm test
```

You can also use VS Code's built-in Jest test runner to run specific tests.

## Project structure

```
src/app/
  core/         # API services and data models
  features/     # Main components showing posts
  shared/       # Reusable UI components and pipes
```
