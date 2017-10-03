# Frontend Project Template

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A template for creating a frontend project that uses the following:

- [Browserify](http://browserify.org/)
- [Bulma](http://bulma.io/)
- [StandardJS](https://standardjs.com/)
- [Surge](https://surge.sh/)
- [live-server](https://www.npmjs.com/package/live-server)

### Installation

```bash
cp CNAME.sample CNAME
yarn
```

Inside of the `CNAME` file, [change the subdomain](https://surge.sh/help/adding-a-custom-domain) to your own if you would like to use Surge.

### Getting Started

To develop on the project:

```bash
npm start
```

To build the project to a `dist/` folder:

```bash
npm run build
```

To test out the build with live-server:

```bash
npm run prod
```

To lint, build, and deploy:

```bash
npm run deploy
```

### Creating a Pre-Commit Hook

Don't push up sad, un-linted code. Before committing, we'll be adding a hook so that our code must pass a linting test.

Start by running the following commands from the root directory of this project:

```bash
touch .git/hooks/pre-commit
chmod u+x .git/hooks/pre-commit
```

Then copy the following into that file:

```bash
#!/bin/sh
# Ensure all javascript files staged for commit pass standard code style
git diff --name-only --cached --relative | grep '\.jsx\?$' | xargs npm run lint
if [ $? -ne 0 ]; then exit 1; fi
```
