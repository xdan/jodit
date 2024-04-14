# Contributing

Jodit is an open-source project, and we greatly appreciate your contributions.
You can contribute by fixing bugs, reporting them, or translating the editor interface.

## TL;DR

```bash
git clone git@github.com:xdan/jodit.git
cd jodit
nvm use
npm ci
```

To work you will need to install [make](https://www.gnu.org/software/make/).

```bash
make start
```

Make code changes and add automated tests in the `test/tests/` folder.
Run:

```bash
make lint && make test
```

Fix any issues and commit your changes:

```bash
git checkout -b i/GITHUB-ISSUE-NUMBER
git add . && git commit -m "Fixed issue smt"
git push
```

Create a pull request in your repository on the GitHub interface.

## Requirement

To work on Jodit, you need the [make](https://www.gnu.org/software/make/) utility.

## Getting started

Clone the repository and install the dependencies.

```bash
git clone git@github.com:xdan/jodit.git
cd jodit
nvm use
npm ci
make start
```

The `make start` command starts the development server in debug mode,
and the default page will open automatically.
The command can be parameterized, for example, to run the build in `es2018` mode:

```sh
make start es=es2018
```

You can find other options in the `Makefile`.

## Fixing Issues and Adding Features

Before you start, here are some important points to keep in mind:

-   We expect contributions to adhere to high-quality code standards, including [coding style](#code-style) and [tests](#tests).
    Neglecting these points may slow down the acceptance of your contribution or even lead to rejection.
-   There is no guarantee that your contribution will be included in the project code.
    However, pull requests make it easy for you to keep your changes for personal use or for others who may find them useful.
-   If you need help creating a patch or implementing a feature, please submit a ticket to us on the issue tracker.

## Code style

To ensure that your code matches the project's general style, you can use Prettier:

```bash
npx prettier ./src/%YOUR_PATCHED_FILE_PATH% --write
```

More information about the code style is provided in the [guide](./JODIT-DEVELOPMENT-GUIDE.md).
It is also important to run the following command without any errors before creating a pull request:

```bash
make lint
```

We follow simple code formatting rules that your IDE or editor can help you with.

## Build

Build min files:

```bash
make build
```

Build without any plugins:

```bash
make build es=es2021 uglify=true excludePlugins="about,source,bold,image,xpath,stat,class-span,color,clean-html,file,focus,enter,backspace,media,preview,pint,redo-undo,resize-cells,search,spellcheck,table"
```

Build without some languages:

```bash
make build es=es2021 uglify=true excludeLanguages="ru,ar,cs_cz,de,es,fa,fi,fr,he,hu,id,it,ja,ko,nl,pl,pt_br,ru,tr,zh_cn,zh_tw"
```

## Tests

Before making any functional changes or fixing a bug, you need to create tests for them.
We follow the [TDD (Test-Driven Development)](<(https://en.wikipedia.org/wiki/Test-driven_development)>) methodology,
where we write automated tests first and then implement the functionality.
Maintaining a comprehensive test suite is crucial for our editor.
To run all tests, use the following command:

```sh
make test
```

or

```bash
npm test
```

In several browsers:

```bash
make test browsers Chrome,Firefox
```

This command builds the project and runs the automated tests.
If you only want to run the tests on an existing build, you can simply use:

```sh
make test-only-run
```

If you need to run a specific test, you can use the `only` method:

```js
describe.only('Test', () => {
	it.only('Test', () => {});
});
```

To see the test results, you can run the tests in watch mode:

```sh
make test-only-run browsers=Chrome singleRun=false
```

For checking tests in browser, open URL:

```
http://localhost:2000/test/test.html
```

## Creating a Pull Request

> GitHub provides excellent documentation about [pull requests](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/). If you are unsure about the process, that is the right place to start

Assuming that you would like to propose some changes, follow these steps to create a pull request:

-   Make sure to open a ticket in https://github.com/xdan/jodit describing the issue,
    feature, or problem that you want to address in your pull request.
    This step can be skipped for obvious and trivial changes (e.g., typos, documentation fixes).
-   Go to GitHub and [fork the repository](https://help.github.com/articles/fork-a-repo). The forked repository will appear in your GitHub account as `https://github.com/YOUR-USERNAME/jodit`.
-   Open your terminal and navigate to the package's folder in your development environment:

```bash
$ cd path/to/jodit
```

-   Create a new branch for your code. We use the `i/GITHUB-ISSUE-NUMBER` convention for branch names:

```bash
$ git checkout -b i/GITHUB-ISSUE-NUMBER
```

-   Make the necessary changes, ensuring that you adhere to the [code-style guidelines](#code-style) and remember to include [tests](#tests) for your changes.
-   Commit your changes using the following command:

```bash
$ git commit -m "Fixed issue smt."
```

-   Now it's time to make your changes public.
    First, you need to let git know about the fork you created by adding the remote repository:

```bash
$ git remote add my-fork https://github.com/YOUR-USERNAME/jodit
```

-   Push your changes to your forked repository:

```bash
$ git push my-fork i/GITHUB-ISSUE-NUMBER
```

-   Go to your forked repository on GitHub. Use the [pull request button](https://help.github.com/articles/about-pull-requests/) and follow the instructions provided.
