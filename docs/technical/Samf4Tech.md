[👈 back](/README.md)
# Technologies used on Samfundet4

This text aims to both sum up the main technologies used to develop on Samfundet4 and to get a person with minimal webdev experience up to speed on the most important concepts. There is a lot this text does not cover, which might be found in other docs linked to in the [README](/README.md).


## The Tech Stack 🥞
In web development the technical solutions that make up a website or web application are referred to as the tech stack. When talking about the tech stack we usually refer to the backend and frontend of the web application, but one should also mention that APIs make sure that the backend and the frontend communicate. 

### Backend ⚙️
#### Django 🐍🎸
For the Samfundet4 backend we use Django, which is a Python framework. This makes it easy to create websites with Python. Django is especially good for creating reusable components and has a lot of features needed for backend operation build-in. We chose Django as our framework because it has a relatively low learning curve, and because Python is widely used and familiar to many students or potential volunteers in Trondheim. 

Django has great [documentation](https://docs.djangoproject.com/en/4.2/).

You should probably read the documentation overview page to start, if you are new to web development. 
There are also good tutorials and information on [W3schools](https://www.w3schools.com/django/django_intro.php). 

### API 🌐
The backend and the frontend communicate through an Application Programming Interface (API). 

#### Django REST Framework 🐍🎸🌐
On Samfundet4 we build these APIs using the Django REST Framework, which is a toolkit for building REST APIs. It has a lot of features that among other things makes serialization and validation easy.

<!-- MULIG UNDØVENDIG:
 If you have minimal experience with web development / software development you might not know what serialization is, so here is a simple explanation. When working developing in backend a lot of the work will be to build solutions to store, move and manipulate data. This data might not always be of the same type, therefore one has to serialize and deserialize the data. Serialization converts the data into a universal datatype like JSON objects and deserialization converts the JSON objects into the original data type. Django does this for you if you have made a serializer. -->

To read more about REST APIs see this article by [IBM](https://www.ibm.com/topics/rest-apis).
Specifically for the Django REST Framework you can check out the [Django REST Framework](https://www.django-rest-framework.org/) site or here is a great YouTube video on REST APIs: [REST API Crash Course - Introduction + Full Python API Tutorial](https://www.youtube.com/watch?v=qbLc5a9jdXo&list=PLB6-c3A-N51W4K5o2_3e86k1Brg_XTn3U&index=22)

### Frontend 🎨🧭
#### React TypeScript ⚛️💙
For frontend development we use React with TypeScript. React is a JavaScript(JS) library that is used to build frontend components and TypeScript is a superset of JS, which means that it builds on JS. TypeScript adds optional static typing to JS and can therefore help to catch errors like type-errors. We use React and TypeScript because they are web technologies used extensively across the modern web. TypeScript also has a relatively low learning curve. 

To learn more about React read [here](https://react.dev/learn). An important feature of React is React-hooks, which you can read about [here](https://react.dev/learn#using-hooks) and in more detail [here](https://react.dev/reference/react). Most people find it most intuitive to start learning the useState-hook, so you might want to start with this hook. 

To learn more about TypeScript you can check out the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html ) or simple [tutorials on W3Schools](https://www.w3schools.com/typescript/typescript_intro.php). 

#### Sass 💅
When developing in frontend you will find HTML the TypeScript files. This HTML is rendered by React in the browser and has to be styled. On Samfundet4 we use Sass for styling, which is a CSS extension language. You will find that you  can write plain CSS, but the features added by Sass are extremely useful like variables and at-rules not found in plain CSS. Read more about Sass and its documentation [here](https://sass-lang.com/documentation/).

We also use [PostCSS](https://postcss.org/), this is a tool that you will find is configured in Samfundet4 and works in the background to optimise and make styling load faster. 


## Developing Samfundet4 👩‍💻
### Package managers and dependencies 🧱
If you are new to web development you might not have experience with dependencies. Dependencies are packages or modules that are required for a web development project to run properly and package managers are software that manage these packages and dependencies.

For our Python-based development, we primarily use pyenv and pipenv. Pyenv allows us to manage multiple versions of Python on the same system, while pipenv helps us create and manage backend virtual environments for our project. 

For frontend development, we use Node.js as a JavaScript runtime, and we rely on tools like npm and Yarn for managing dependencies. It might also be useful to use nvm(node version manager), which is used to install and switch between different versions of Node.js. Npm and Yarn allow us to install and manage JavaScript packages for our projects. 

We use Yarn specifically for managing Storybook and Cypress, Storybook is a tool for developing frontend components in isolation and Cypress is a tool for testing frontend components. 

To develop on the Samfundet4 project locally you will need to install all the package managers and dependencies mentioned, but you should really use [Docker](https://www.docker.com/), which is a tool described further below. In [Useful commands](/docs/useful-commands.md) you will find documentation on commands to install dependencies localy.


### Virtual environment and Docker 
#### WSL 🪟🐧
On windows machines samfundet4 has to be run in Windows Subsystem for Linux (WSL). It is not needed on a Mac because macOS is based on Unix, which is similar to Linux. The reason why we develop on Linux architecture is because of how the project will be hosted when live. 

In WSL you might have to look into installing Node.js, npm and nvm. You can look into this [here](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl). 

#### Docker 🐳
As mentioned earlier we use a tool called Docker, which allows for running environments with necessary dependencies for running the project. Hence running the project in Docker will make sure you have all the dependencies and packages needed to run the project. You can read about Docker here for and overview on this [IBM site](https://www.ibm.com/topics/docker) and will find more in-depth information in [Docker documentation]( https://docs.docker.com/get-started/overview/). 

⚠️🐳The best way to ensure that you can run the project is by using Docker. That being said, Docker is an extremely useful tool that you will benefit greatly from if you learn to use it.
 
### Formatters and linters 📜
To make the code we write on the project high quality, have a standardised format and generally readable we use the formatters and linters. This is very useful when writing code as a team. 
#### Frontend 🎨🧭
For frontend we use the formatter Prettier, which formats the code in a standardised way. 
Linters are software that analyses code to detect errors, bugs or stylistic inconsistency. Hence we use linter as tools to write better, more high quality code. In frontend we use ESlint for React and stylelint for CSS/SASS. 

To use our code format and linting rules you have to configure a JSON file locally, and of course have the tools installed in your IDE. After installing the project and getting it to run, you need to copy [this JSON file](/.vscode/settings.emil.json), paste it into the same folder, and rename it to 'settings.json'.

When installing the project for the first time you will have the option to install Prettier and ESlint in VSCode. Stylelint is easily found in VSCode extensions. 

When you push code to the main branch it will be checked automatically (by GitHub Actions tests) to see if it follows the formatting and linting rules we use. It is also useful to know that these checks can be run locally by commands in the terminal, which are found in [Useful commands](/docs/useful-commands.md). If you want you can also read the [prettier](https://prettier.io/), [eslint](https://eslint.org/) or [stylelint](https://stylelint.io/) documentation.

#### Backend ⚙️
In backend we use the Python formatter [yapf](https://pypi.org/project/yapf/) because it is a formatter that offers multiple populare Python formats and standards. The format is configured in a Python file in backend. 
For linting we use [flake8](https://flake8.pycqa.org/en/latest/) and [pylint](https://pypi.org/project/pylint/). They have similar functions, but flake8 has some more functionality. These tools are especially helpful because they can highlight code errors and can make suggestions for better code. 

LEGG til mer videre om f.eks pipeline ???
- [MyPy](https://pypi.org/project/mypy/)??
 
Andre pipeline checks...
- TypeScript compiler check
- .
- mer kommer?.

