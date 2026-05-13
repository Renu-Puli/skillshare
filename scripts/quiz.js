class QuizManager {
    constructor() {
        this.storage = window.storageManager;
        this.auth = window.authManager;
        
        this.quizBody = document.getElementById('quiz-body');
        this.quizTitle = document.getElementById('quiz-title');
        this.progressFill = document.getElementById('progress-fill');
        this.submitBtn = document.getElementById('submit-quiz');
        this.prevBtn = document.getElementById('prev-q');
        this.nextBtn = document.getElementById('next-q');
        this.clearBtn = document.getElementById('clear-q');
        this.questionNav = document.getElementById('question-nav');
        this.timerDisplay = document.getElementById('quiz-timer');
        this.answeredCountDisplay = document.getElementById('answered-count');
        
        this.currentSkill = null;
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.userAnswers = {};
        this.timerInterval = null;
        this.timeLeft = 25 * 60; // 25 minutes
        
        this.questionsDatabase = {
            'JavaScript': [
                { q: "What is the output of 'typeof NaN'?", options: ["number", "string", "undefined", "object"], correct: 0 },
                { q: "Which of the following is not a reserved word in JavaScript?", options: ["interface", "throws", "program", "short"], correct: 2 },
                { q: "What is the output of 'console.log(0.1 + 0.2 === 0.3)'?", options: ["true", "false", "undefined", "TypeError"], correct: 1 },
                { q: "Which method is used to remove the last element from an array?", options: ["shift()", "pop()", "push()", "unshift()"], correct: 1 },
                { q: "What is the correct way to check if a variable is an array?", options: ["typeof arr === 'array'", "arr instanceof Array", "Array.isArray(arr)", "Both B and C"], correct: 3 },
                { q: "What is the result of '1' + 2 + 3?", options: ["6", "123", "15", "NaN"], correct: 1 },
                { q: "What is the result of 1 + 2 + '3'?", options: ["6", "123", "33", "NaN"], correct: 2 },
                { q: "Which statement is used to stop a loop?", options: ["exit", "stop", "break", "return"], correct: 2 },
                { q: "What does 'use strict' do?", options: ["Enforces stricter parsing and error handling", "Makes the code run faster", "Allows using future JS features", "Nothing"], correct: 0 },
                { q: "What is a closure in JavaScript?", options: ["A way to close the browser tab", "A function that has access to its outer scope", "A type of loop", "A built-in object"], correct: 1 },
                { q: "What is the purpose of the 'bind' method?", options: ["To merge two arrays", "To create a new function with a specific 'this' value", "To attach an event listener", "To copy an object"], correct: 1 },
                { q: "Which of these is not a falsy value?", options: ["0", "''", "[]", "null"], correct: 2 },
                { q: "What is the output of 'console.log(typeof null)'?", options: ["null", "undefined", "object", "string"], correct: 2 },
                { q: "How do you create a promise in JavaScript?", options: ["new Promise((resolve, reject) => {})", "Promise.create()", "new async Promise()", "makePromise()"], correct: 0 },
                { q: "What is the 'Event Loop' in JavaScript?", options: ["A loop that runs through events in an array", "The mechanism that handles asynchronous callbacks", "A specific type of 'for' loop", "A CSS animation tool"], correct: 1 },
                { q: "Which keyword is used to inherit a class?", options: ["implements", "inherits", "extends", "super"], correct: 2 },
                { q: "What is the difference between '==' and '==='?", options: ["No difference", "'==' checks value, '===' checks value and type", "'===' is only for objects", "'==' is faster"], correct: 1 },
                { q: "What is the output of '[] == ![]'?", options: ["true", "false", "undefined", "Error"], correct: 0 },
                { q: "How do you define a constant variable?", options: ["var", "let", "const", "constant"], correct: 2 },
                { q: "What is the purpose of 'Object.freeze()'?", options: ["To make an object immutable", "To delete an object", "To copy an object", "To hide properties"], correct: 0 },
                { q: "What is the purpose of the 'reduce' method on arrays?", options: ["To make the array smaller", "To execute a reducer function on each element and return a single value", "To sort the array", "To remove elements"], correct: 1 },
                { q: "Which function is used to parse a string into an integer?", options: ["parse()", "toInt()", "parseInt()", "Number.parse()"], correct: 2 },
                { q: "What is the result of 'console.log(typeof function(){})'?", options: ["function", "object", "undefined", "code"], correct: 0 },
                { q: "What is a 'dead zone' in JavaScript?", options: ["A part of the memory that is never used", "The period between variable hoisting and initialization", "A line of code that is never reached", "An error in the compiler"], correct: 1 },
                { q: "Which of these is used for deep cloning an object?", options: ["Object.assign()", "{...obj}", "JSON.parse(JSON.stringify(obj))", "Object.create()"], correct: 2 },
                { q: "What is 'hoisting'?", options: ["A way to lift weights in JS", "Variable and function declarations are moved to the top of their scope", "A method for uploading files", "A type of data structure"], correct: 1 },
                { q: "What does 'this' refer to in a global context?", options: ["The function itself", "The window (or global) object", "undefined", "null"], correct: 1 },
                { q: "What is the output of 'Boolean('false')'?", options: ["true", "false", "undefined", "Error"], correct: 0 },
                { q: "How do you detect the browser name using JS?", options: ["browser.name", "window.userAgent", "navigator.appName", "navigator.userAgent"], correct: 3 },
                { q: "What is the result of 'undefined == null'?", options: ["true", "false", "Error", "NaN"], correct: 0 },
                { q: "What is the result of 'undefined === null'?", options: ["true", "false", "Error", "NaN"], correct: 1 },
                { q: "Which method adds one or more elements to the end of an array?", options: ["push()", "append()", "add()", "insert()"], correct: 0 },
                { q: "Which method adds one or more elements to the beginning of an array?", options: ["unshift()", "prepend()", "start()", "pushFront()"], correct: 0 },
                { q: "What is the purpose of 'async/await'?", options: ["To make code run synchronously", "To handle promises in a more readable way", "To create a new thread", "To delay execution"], correct: 1 },
                { q: "What is the output of 'console.log(!!0)'?", options: ["true", "false", "undefined", "Error"], correct: 1 },
                { q: "Which operator is used to check the type of a variable?", options: ["typeOf", "instanceOf", "typeof", "is"], correct: 2 },
                { q: "What is the output of 'console.log(2 + '2')'?", options: ["4", "22", "NaN", "Error"], correct: 1 },
                { q: "What is the output of 'console.log(2 - '2')'?", options: ["0", "NaN", "Error", "22"], correct: 0 },
                { q: "How do you call a function named 'myFunction'?", options: ["call myFunction()", "myFunction()", "start myFunction()", "run myFunction"], correct: 1 },
                { q: "What is the purpose of 'Object.keys()'?", options: ["To get the values of an object", "To get the keys of an object as an array", "To lock an object", "To delete an object"], correct: 1 },
                { q: "Which of the following is a primitive data type?", options: ["Object", "Array", "String", "Date"], correct: 2 },
                { q: "What is the use of 'setTimeout()'?", options: ["To stop execution", "To execute code after a specific delay", "To measure execution time", "To repeat code"], correct: 1 },
                { q: "What is the result of 'typeof []'?", options: ["array", "object", "list", "undefined"], correct: 1 },
                { q: "What is the result of '3 > 2 > 1'?", options: ["true", "false", "undefined", "Error"], correct: 1 },
                { q: "Which array method creates a new array with all elements that pass a test?", options: ["map()", "filter()", "every()", "some()"], correct: 1 },
                { q: "What is the result of 'Array(3).fill(0)'?", options: ["[0, 0, 0]", "[0, 3]", "[3, 3, 3]", "Error"], correct: 0 },
                { q: "What is the result of '10 / 0'?", options: ["0", "NaN", "Infinity", "Error"], correct: 2 },
                { q: "How do you round a number to the nearest integer?", options: ["Math.rnd()", "Math.round()", "Math.ceil()", "Math.floor()"], correct: 1 },
                { q: "What does 'NaN' stand for?", options: ["Not a Number", "New and Null", "Null and Negative", "None"], correct: 0 },
                { q: "Which property is used to get the length of a string?", options: ["size", "count", "length", "index"], correct: 2 }
            ],
            'React': [
                { q: "What is the virtual DOM in React?", options: ["A direct copy of the real DOM", "An in-memory representation of the real DOM", "A CSS styling tool", "A database engine"], correct: 1 },
                { q: "What is the purpose of 'key' prop in lists?", options: ["To style elements", "To uniquely identify elements for efficient re-rendering", "To sort the list", "To bind data"], correct: 1 },
                { q: "Which hook is used to manage state in a functional component?", options: ["useEffect", "useContext", "useState", "useReducer"], correct: 2 },
                { q: "What is the 'Children' prop?", options: ["A way to pass data to child components", "A special prop that allows components to be nested", "An array of all child components", "None of the above"], correct: 1 },
                { q: "What is the difference between useMemo and useCallback?", options: ["No difference", "useMemo returns a value, useCallback returns a function", "useCallback is for state, useMemo is for effects", "useMemo is faster"], correct: 1 },
                { q: "What is 'lifting state up' in React?", options: ["Moving state to a higher-level component", "Increasing the performance of state", "Using Redux", "Deleting unused state"], correct: 0 },
                { q: "What is a 'Pure Component'?", options: ["A component without props", "A component that renders the same output for the same props and state", "A functional component", "A component that doesn't use hooks"], correct: 1 },
                { q: "How do you handle side effects in functional components?", options: ["setState", "componentDidMount", "useEffect", "useSideEffect"], correct: 2 },
                { q: "What is 'Prop Drilling'?", options: ["A way to optimize props", "Passing props through multiple levels of components", "Using tools to inspect props", "Deleting unnecessary props"], correct: 1 },
                { q: "What is the purpose of 'useContext'?", options: ["To manage global state without prop drilling", "To handle DOM events", "To create new components", "To fetch data"], correct: 0 },
                { q: "What is a 'Fragment' in React?", options: ["A part of a component", "A way to group multiple elements without adding an extra node to the DOM", "A type of hook", "An error in the code"], correct: 1 },
                { q: "What is the 'Strict Mode' in React?", options: ["A mode that prevents all errors", "A tool for highlighting potential problems in an application", "A faster way to render", "A security feature"], correct: 1 },
                { q: "How can you optimize performance for a large list in React?", options: ["Use more state", "Use windowing or virtualization", "Render everything at once", "Disable hooks"], correct: 1 },
                { q: "What is 'Concurrent Mode'?", options: ["Running multiple React apps at once", "A set of new features that help React apps stay responsive", "A way to use multiple threads", "None of the above"], correct: 1 },
                { q: "What is the purpose of 'useRef'?", options: ["To store state", "To persist values between renders without causing re-renders", "To reference other components", "To handle API calls"], correct: 1 },
                { q: "What is 'Higher-Order Component' (HOC)?", options: ["A component with many props", "A function that takes a component and returns a new component", "A component that renders other components", "A complex class component"], correct: 1 },
                { q: "What are 'Portals' used for?", options: ["To navigate between pages", "To render children into a DOM node that exists outside the hierarchy of the parent component", "To fetch data from external APIs", "To optimize image loading"], correct: 1 },
                { q: "What is 'Lazy Loading' in React?", options: ["Slow rendering", "Loading components only when they are needed", "Using a lot of memory", "None of the above"], correct: 1 },
                { q: "What is the use of 'Error Boundaries'?", options: ["To prevent all errors", "To catch JavaScript errors anywhere in their child component tree", "To debug the code", "To show the console log"], correct: 1 },
                { q: "What is 'Reconciliation'?", options: ["The process of merging two states", "The algorithm React uses to diff one tree with another", "A way to handle errors", "A styling technique"], correct: 1 },
                { q: "How do you update state based on the previous state?", options: ["setState(newState)", "setState(prevState => newState)", "this.state = newState", "update(state)"], correct: 1 },
                { q: "What is the 'Effect' hook used for?", options: ["To change the theme", "To synchronize a component with an external system", "To create animations", "To manage local state"], correct: 1 },
                { q: "What is 'Shadow DOM' vs 'Virtual DOM'?", options: ["They are the same", "Shadow DOM is for encapsulation, Virtual DOM is for performance", "Shadow DOM is faster", "Virtual DOM is a browser feature"], correct: 1 },
                { q: "What is the purpose of 'displayName' property?", options: ["To show the user name", "To provide a name for a component in debugging tools", "To style the component", "None of the above"], correct: 1 },
                { q: "What is 'Controlled Component'?", options: ["A component controlled by the user", "A component where React handles the form data", "A component with many event listeners", "A component that doesn't change"], correct: 1 },
                { q: "What is 'Uncontrolled Component'?", options: ["A component that crashes", "A component where the DOM handles the form data", "A component without state", "None of the above"], correct: 1 },
                { q: "What is 'Render Prop'?", options: ["A prop that is a string", "A technique for sharing code between components using a prop whose value is a function", "A way to style components", "None of the above"], correct: 1 },
                { q: "What is 'Forward Ref'?", options: ["Moving to the next page", "A technique for automatically passing a ref through a component to one of its children", "A way to reference state", "None of the above"], correct: 1 },
                { q: "What is the benefit of using 'Redux' with React?", options: ["Makes the app smaller", "Provides a predictable state container for large applications", "Makes the app faster", "Simplifies CSS"], correct: 1 },
                { q: "What is 'Context API'?", options: ["A way to access the browser context", "A way to share data that can be considered 'global' for a tree of components", "A tool for translation", "None of the above"], correct: 1 },
                { q: "What is 'SSR' (Server Side Rendering)?", options: ["Rendering components on the client", "Rendering components on the server and sending HTML to the client", "Using a database on the server", "None of the above"], correct: 1 },
                { q: "What is 'Hydration'?", options: ["Adding water to the server", "The process of attaching event listeners to static HTML sent by the server", "Clearing the cache", "None of the above"], correct: 1 },
                { q: "What is 'Static Site Generation' (SSG)?", options: ["Generating pages at runtime", "Generating pages at build time", "Creating static images", "None of the above"], correct: 1 },
                { q: "What is the use of 'useLayoutEffect'?", options: ["To handle animations", "Fires synchronously after all DOM mutations", "To manage state", "None of the above"], correct: 1 },
                { q: "What is 'React Fiber'?", options: ["A new styling engine", "A complete rewrite of React's core algorithm", "A way to use threads", "None of the above"], correct: 1 },
                { q: "What is 'Profiler' API?", options: ["To show user profile", "To measure the rendering performance of a React tree", "To debug state", "None of the above"], correct: 1 },
                { q: "What is 'JSX' transformed into?", options: ["HTML", "React.createElement() calls", "WebAssembly", "Native code"], correct: 1 },
                { q: "What is the purpose of 'suspense'?", options: ["To delay rendering until some condition is met (like data fetching)", "To show a spinner", "To handle errors", "All of the above"], correct: 0 },
                { q: "What is 'Batching' in React?", options: ["Grouping multiple state updates into a single re-render", "Sending data in batches", "Sorting components", "None of the above"], correct: 0 },
                { q: "What is 'Event Delegation' in React?", options: ["React attaches event listeners to the root node instead of individual elements", "Passing events to child components", "Stopping event propagation", "None of the above"], correct: 0 },
                { q: "How do you optimize a React app?", options: ["Memoization", "Code splitting", "Virtualization", "All of the above"], correct: 3 },
                { q: "What is 'SyntheticEvent'?", options: ["A fake event", "A cross-browser wrapper around the browser’s native event", "A custom event system", "None of the above"], correct: 1 },
                { q: "What is the 'Key' property used for by React's diffing algorithm?", options: ["To identify elements that have changed, been added, or been removed", "To encrypt data", "To sort arrays", "None of the above"], correct: 0 },
                { q: "What is the difference between 'Element' and 'Component'?", options: ["An element is a plain object describing a component instance or DOM node", "A component is a function or class that returns an element", "Both A and B", "None of the above"], correct: 2 },
                { q: "What is 'State' in React?", options: ["An object that determines how a component renders and behaves", "A global variable", "A CSS property", "None of the above"], correct: 0 },
                { q: "What is 'Props' in React?", options: ["Read-only inputs passed to a component", "Local state of a component", "Global settings", "None of the above"], correct: 0 },
                { q: "What is 'Hooks' in React?", options: ["Functions that let you 'hook into' React state and lifecycle features from function components", "Ways to attach components", "CSS tricks", "None of the above"], correct: 0 },
                { q: "What is 'React Router'?", options: ["A tool for routing in React apps", "A way to fetch data", "A state management library", "None of the above"], correct: 0 },
                { q: "What is 'Redux Toolkit'?", options: ["The official, opinionated, batteries-included toolset for efficient Redux development", "A new version of React", "A styling library", "None of the above"], correct: 0 },
                { q: "What is 'React Testing Library'?", options: ["A tool for testing React components in a way that resembles how they are used", "A built-in React feature", "A way to measure performance", "None of the above"], correct: 0 }
            ],
            'Python': [
                { q: "What is the correct file extension for Python files?", options: [".pt", ".py", ".pyt", ".pyth"], correct: 1 },
                { q: "How do you create a variable with the numeric value 5?", options: ["x = 5", "x = int(5)", "Both A and B", "None of the above"], correct: 2 },
                { q: "What is the correct way to create a function in Python?", options: ["function myFunc():", "def myFunc():", "create myFunc():", "myFunc():"], correct: 1 },
                { q: "How do you start a for loop in Python?", options: ["for x in y:", "for x to y:", "for (x; y)", "None of the above"], correct: 0 },
                { q: "What is the correct way to output 'Hello' in Python?", options: ["print('Hello')", "echo('Hello')", "system.out('Hello')", "console.log('Hello')"], correct: 0 },
                { q: "Which of the following is used for comments in Python?", options: ["//", "/* */", "#", "--"], correct: 2 },
                { q: "What is the output of 2 ** 3?", options: ["6", "8", "9", "5"], correct: 1 },
                { q: "Which collection is ordered, changeable, and allows duplicate members?", options: ["Set", "Tuple", "List", "Dictionary"], correct: 2 },
                { q: "Which collection is ordered and unchangeable?", options: ["Set", "Tuple", "List", "Dictionary"], correct: 1 },
                { q: "How do you insert an item at a specific index in a list?", options: ["list.add()", "list.insert()", "list.push()", "list.append()"], correct: 1 },
                { q: "What is the output of 'Hello' + 'World'?", options: ["HelloWorld", "Hello World", "Error", "None"], correct: 0 },
                { q: "Which keyword is used to handle exceptions in Python?", options: ["catch", "except", "error", "handle"], correct: 1 },
                { q: "How do you get the length of a list in Python?", options: ["list.length()", "len(list)", "list.size()", "count(list)"], correct: 1 },
                { q: "What is a lambda function in Python?", options: ["A large function", "An anonymous function", "A function that returns nothing", "None of the above"], correct: 1 },
                { q: "Which statement is used to exit a loop?", options: ["exit", "stop", "break", "return"], correct: 2 },
                { q: "What is the purpose of the 'pass' statement?", options: ["To skip a loop iteration", "A null operation to fulfill syntax requirements", "To finish a function", "None of the above"], correct: 1 },
                { q: "Which of these is not a Python data type?", options: ["list", "tuple", "stack", "dictionary"], correct: 2 },
                { q: "How do you define a class in Python?", options: ["class MyClass:", "define MyClass:", "new MyClass:", "MyClass = class()"], correct: 0 },
                { q: "What is the output of bool([])?", options: ["True", "False", "None", "Error"], correct: 1 },
                { q: "Which operator is used for floor division?", options: ["/", "//", "%", "**"], correct: 1 },
                { q: "How do you open a file for writing in Python?", options: ["open('file.txt', 'r')", "open('file.txt', 'w')", "open('file.txt', 'a')", "open('file.txt', 'x')"], correct: 1 },
                { q: "What is the purpose of the 'self' keyword?", options: ["To refer to the global scope", "To refer to the current instance of a class", "To refer to the parent class", "None of the above"], correct: 1 },
                { q: "Which method is used to remove whitespace from both ends of a string?", options: ["strip()", "trim()", "cut()", "clear()"], correct: 0 },
                { q: "How do you convert a string to lowercase?", options: ["lower()", "down()", "toLower()", "casefold()"], correct: 0 },
                { q: "What is the output of 'python'[1:4]?", options: ["pyt", "yth", "tho", "pyth"], correct: 1 },
                { q: "Which library is used for numerical computations in Python?", options: ["Pandas", "Matplotlib", "NumPy", "Scikit-learn"], correct: 2 },
                { q: "What is a 'decorator' in Python?", options: ["A way to style code", "A function that takes another function and extends its behavior", "A type of class", "None of the above"], correct: 1 },
                { q: "How do you install a package in Python?", options: ["npm install", "pip install", "python install", "gem install"], correct: 1 },
                { q: "What is the result of 10 // 3?", options: ["3.33", "3", "4", "0"], correct: 1 },
                { q: "Which keyword is used to import a module?", options: ["require", "import", "using", "include"], correct: 1 },
                { q: "What is 'PEP 8'?", options: ["A performance tool", "A style guide for Python code", "A new version of Python", "None of the above"], correct: 1 },
                { q: "How do you create a set in Python?", options: ["set = {}", "set = []", "set = ()", "set = set()"], correct: 3 },
                { q: "What is the output of type(10.5)?", options: ["int", "float", "number", "complex"], correct: 1 },
                { q: "How do you check if a key exists in a dictionary?", options: ["key in dict", "dict.has(key)", "dict.exists(key)", "key exists dict"], correct: 0 },
                { q: "What is the purpose of 'if __name__ == \"__main__\":'?", options: ["To check if the script is running as the main program", "To initialize variables", "To handle errors", "None of the above"], correct: 0 },
                { q: "Which of the following is mutable?", options: ["String", "Tuple", "List", "Integer"], correct: 2 },
                { q: "How do you start a while loop?", options: ["while (x < y):", "while x < y:", "do while x < y:", "while x < y"], correct: 1 },
                { q: "What is the output of 'abc' * 3?", options: ["abcabcabc", "abc3", "Error", "None"], correct: 0 },
                { q: "Which method returns all the keys of a dictionary?", options: ["keys()", "get_keys()", "all()", "list()"], correct: 0 },
                { q: "What is the purpose of the 'yield' keyword?", options: ["To return a value and continue the function", "To pause a generator function", "Both A and B", "None of the above"], correct: 2 },
                { q: "Which of the following is a way to handle multi-threading in Python?", options: ["threading module", "multiprocessing module", "asyncio", "All of the above"], correct: 3 },
                { q: "What is the difference between 'is' and '=='?", options: ["No difference", "'is' checks identity, '==' checks equality", "'==' is faster", "None of the above"], correct: 1 },
                { q: "How do you find the minimum value in a list?", options: ["min(list)", "list.min()", "minimum(list)", "list.low()"], correct: 0 },
                { q: "What is 'list comprehension'?", options: ["A way to understand lists", "A concise way to create lists", "A type of list", "None of the above"], correct: 1 },
                { q: "Which of these is used for data analysis in Python?", options: ["Requests", "Pandas", "BeautifulSoup", "Flask"], correct: 1 },
                { q: "How do you concatenate two lists?", options: ["list1 + list2", "list1.join(list2)", "list1.add(list2)", "None of the above"], correct: 0 },
                { q: "What is 'Global Interpreter Lock' (GIL)?", options: ["A security feature", "A mechanism that limits Python to one thread at a time", "A type of variable", "None of the above"], correct: 1 },
                { q: "How do you use a parent class method in a child class?", options: ["super().method()", "parent.method()", "this.method()", "None of the above"], correct: 0 },
                { q: "Which method is used to sort a list in place?", options: ["sort()", "sorted()", "order()", "arrange()"], correct: 0 },
                { q: "What is the output of 5 % 2?", options: ["2.5", "1", "0", "2"], correct: 1 }
            ],
            'HTML/CSS': [
                { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Management", "None"], correct: 0 },
                { q: "Which HTML element is used for the largest heading?", options: ["<heading>", "<h6>", "<h1>", "<head>"], correct: 2 },
                { q: "What is the correct HTML element for inserting a line break?", options: ["<break>", "<lb>", "<br>", "<line>"], correct: 2 },
                { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"], correct: 0 },
                { q: "Where in an HTML document is the correct place to refer to an external style sheet?", options: ["In the <body> section", "At the end of the document", "In the <head> section", "None"], correct: 2 },
                { q: "Which HTML tag is used to define an internal style sheet?", options: ["<script>", "<css>", "<style>", "<design>"], correct: 2 },
                { q: "Which HTML attribute is used to define inline styles?", options: ["font", "styles", "class", "style"], correct: 3 },
                { q: "Which is the correct CSS syntax?", options: ["body {color: black;}", "{body:color=black;}", "body:color=black;", "{body;color:black;}"], correct: 0 },
                { q: "How do you insert a comment in a CSS file?", options: ["// this is a comment", "/* this is a comment */", "' this is a comment", "// this is a comment //"], correct: 1 },
                { q: "Which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "cellspacing"], correct: 2 },
                { q: "How do you add a background color for all <h1> elements?", options: ["h1.all {background-color: #FFFFFF;}", "all.h1 {background-color: #FFFFFF;}", "h1 {background-color: #FFFFFF;}", "None"], correct: 2 },
                { q: "Which CSS property is used to change the text color of an element?", options: ["text-color", "color", "fgcolor", "font-color"], correct: 1 },
                { q: "Which CSS property controls the text size?", options: ["font-style", "text-style", "font-size", "text-size"], correct: 2 },
                { q: "What is the correct CSS syntax for making all the <p> elements bold?", options: ["p {font-weight:bold;}", "p {text-size:bold;}", "<p style='font-size:bold;'>", "p {font-style:bold;}"], correct: 0 },
                { q: "How do you display hyperlinks without an underline?", options: ["a {text-decoration:none;}", "a {underline:none;}", "a {decoration:no-underline;}", "a {text-decoration:no-underline;}"], correct: 0 },
                { q: "How do you make each word in a text start with a capital letter?", options: ["text-transform:capitalize", "text-style:capitalize", "You can't do that with CSS", "transform:capitalize"], correct: 0 },
                { q: "Which property is used to change the font of an element?", options: ["font-family", "font-style", "font-weight", "font-variant"], correct: 0 },
                { q: "How do you make the text bold?", options: ["font:bold;", "font-weight:bold;", "style:bold;", "weight:bold;"], correct: 1 },
                { q: "Which property is used to create a border around an element?", options: ["border", "margin", "padding", "outline"], correct: 0 },
                { q: "How do you change the left margin of an element?", options: ["padding-left:", "margin-left:", "indent-left:", "space-left:"], correct: 1 },
                { q: "Which property is used to change the space between the content and the border?", options: ["margin", "spacing", "padding", "border-spacing"], correct: 2 },
                { q: "How do you select an element with a specific ID in CSS?", options: [".id", "#id", "*id", "@id"], correct: 1 },
                { q: "How do you select elements with a specific class in CSS?", options: [".class", "#class", "*class", "@class"], correct: 0 },
                { q: "How do you select all <p> elements inside a <div> element?", options: ["div p", "div.p", "div + p", "div > p"], correct: 0 },
                { q: "What is the default value of the position property?", options: ["absolute", "relative", "fixed", "static"], correct: 3 },
                { q: "Which property is used to change the z-order of an element?", options: ["z-index", "order", "index", "layer"], correct: 0 },
                { q: "How do you center an element horizontally using flexbox?", options: ["justify-content:center;", "align-items:center;", "text-align:center;", "margin:auto;"], correct: 0 },
                { q: "How do you center an element vertically using flexbox?", options: ["justify-content:center;", "align-items:center;", "text-align:center;", "vertical-align:middle;"], correct: 1 },
                { q: "What does the 'box-sizing: border-box;' property do?", options: ["Includes padding and border in the element's total width and height", "Adds a border around the box", "Makes the box circular", "None"], correct: 0 },
                { q: "Which CSS property is used to make a grid container?", options: ["display:grid;", "layout:grid;", "grid-template:column;", "None"], correct: 0 },
                { q: "How do you make a responsive layout without media queries?", options: ["Using Flexbox", "Using CSS Grid with auto-fit/fill", "Both A and B", "None"], correct: 2 },
                { q: "What is the purpose of the <meta> tag?", options: ["To define metadata about the HTML document", "To link external scripts", "To style the page", "None"], correct: 0 },
                { q: "Which HTML element is used to define important text?", options: ["<important>", "<strong>", "<i>", "<b>"], correct: 1 },
                { q: "Which HTML element is used to define emphasized text?", options: ["<italic>", "<em>", "<i>", "<emphasis>"], correct: 1 },
                { q: "What is the correct HTML for creating a hyperlink?", options: ["<a>http://google.com</a>", "<a href='http://google.com'>Google</a>", "<a url='http://google.com'>Google</a>", "None"], correct: 1 },
                { q: "Which character is used to indicate an end tag?", options: ["^", "*", "/", "<"], correct: 2 },
                { q: "How can you open a link in a new tab?", options: ["target='_blank'", "target='new'", "target='_tab'", "None"], correct: 0 },
                { q: "Which element is used to create an unordered list?", options: ["<ol>", "<ul>", "<li>", "<list>"], correct: 1 },
                { q: "Which element is used to create an ordered list?", options: ["<ol>", "<ul>", "<li>", "<list>"], correct: 0 },
                { q: "What is the correct HTML for making a checkbox?", options: ["<checkbox>", "<input type='check'>", "<input type='checkbox'>", "<check>"], correct: 2 },
                { q: "What is the correct HTML for making a text input field?", options: ["<input type='text'>", "<textfield>", "<input type='textfield'>", "<text>"], correct: 0 },
                { q: "What is the correct HTML for making a drop-down list?", options: ["<list>", "<input type='dropdown'>", "<select>", "<dropdown>"], correct: 2 },
                { q: "Which HTML element is used to specify a footer for a document or section?", options: ["<bottom>", "<footer>", "<section-footer>", "None"], correct: 1 },
                { q: "Which HTML element is used to specify a header for a document or section?", options: ["<top>", "<head>", "<header>", "None"], correct: 2 },
                { q: "What is the correct HTML for inserting an image?", options: ["<img alt='MyImage'>image.gif</img>", "<image src='image.gif' alt='MyImage'>", "<img src='image.gif' alt='MyImage'>", "None"], correct: 2 },
                { q: "Which property is used to change the background image?", options: ["background-image", "bg-image", "image-background", "None"], correct: 0 },
                { q: "How do you make a list that lists its items with squares?", options: ["list-type:square;", "list-style-type:square;", "type:square;", "None"], correct: 1 },
                { q: "Which CSS property is used to specify the transparency of an element?", options: ["opacity", "transparency", "filter", "None"], correct: 0 },
                { q: "What is the correct HTML for adding a background color?", options: ["<body bg='yellow'>", "<body style='background-color:yellow;'>", "<background>yellow</background>", "None"], correct: 1 },
                { q: "Which HTML element defines the title of a document?", options: ["<head>", "<meta>", "<title>", "None"], correct: 2 }
            ]
        };

        this.init();
    }

    init() {
        if (this.submitBtn) this.submitBtn.onclick = () => this.handleSubmit();
        if (this.prevBtn) this.prevBtn.onclick = () => this.navigate(-1);
        if (this.nextBtn) this.nextBtn.onclick = () => this.navigate(1);
        if (this.clearBtn) this.clearBtn.onclick = () => this.clearOption();
    }

    startQuiz(skill) {
        this.currentSkill = skill;
        this.currentIndex = 0;
        this.userAnswers = {};
        
        const dbQuestions = this.questionsDatabase[skill] || [];
        let allQuestions = [...dbQuestions];
        
        // Ensure uniqueness and at least 25 questions
        const uniquePool = [];
        const seen = new Set();
        
        allQuestions.forEach(q => {
            if (!seen.has(q.q)) {
                seen.add(q.q);
                uniquePool.push(q);
            }
        });

        if (uniquePool.length < 25) {
            const needed = 25 - uniquePool.length;
            const generated = this.generateDefaultQuestions(skill, needed);
            generated.forEach(q => {
                if (!seen.has(q.q)) {
                    seen.add(q.q);
                    uniquePool.push(q);
                }
            });
        }
        
        // Pick exactly 25 randomized unique questions
        this.currentQuestions = this.shuffleArray(uniquePool).slice(0, 25);
        
        this.startTimer();
        this.renderQuiz();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timeLeft = 25 * 60; // reset to 25 mins
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                alert("Time is up! Submitting your answers.");
                this.handleSubmit(true);
            }
        }, 1000);
    }

    updateTimerDisplay() {
        if (!this.timerDisplay) return;
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // Change color if less than 5 mins left
        if (this.timeLeft < 300) {
            this.timerDisplay.style.color = '#ef4444'; // Red
        }
    }

    generateDefaultQuestions(skill, count) {
        const templates = [
            (i) => ({ q: `Q${i}: What is a core concept of ${skill}?`, options: ["Concept A", "Concept B", "Concept C", "Concept D"], correct: Math.floor(Math.random() * 4) }),
            (i) => ({ q: `Q${i}: Which tool is most commonly used with ${skill}?`, options: ["Tool 1", "Tool 2", "Tool 3", "Tool 4"], correct: Math.floor(Math.random() * 4) }),
            (i) => ({ q: `Q${i}: How do you debug an issue in ${skill}?`, options: ["Method X", "Method Y", "Method Z", "Method W"], correct: Math.floor(Math.random() * 4) }),
            (i) => ({ q: `Q${i}: What is the best practice for performance in ${skill}?`, options: ["Practice Alpha", "Practice Beta", "Practice Gamma", "Practice Delta"], correct: Math.floor(Math.random() * 4) }),
            (i) => ({ q: `Q${i}: What is an advanced feature of ${skill}?`, options: ["Feature I", "Feature II", "Feature III", "Feature IV"], correct: Math.floor(Math.random() * 4) })
        ];
        
        const generated = [];
        for (let i = 1; i <= count; i++) {
            const template = templates[i % templates.length];
            generated.push(template(i));
        }
        return generated;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentQuestions.length) {
            this.saveCurrentAnswer();
            this.currentIndex = newIndex;
            this.renderQuiz();
        }
    }

    saveCurrentAnswer() {
        const selected = document.querySelector(`input[name="quiz-option"]:checked`);
        if (selected) {
            this.userAnswers[this.currentIndex] = parseInt(selected.value);
        }
    }

    clearOption() {
        const options = document.querySelectorAll(`input[name="quiz-option"]`);
        options.forEach(opt => opt.checked = false);
        delete this.userAnswers[this.currentIndex];
        this.renderSidebar();
    }

    renderQuiz() {
        const q = this.currentQuestions[this.currentIndex];
        const total = this.currentQuestions.length;
        this.quizTitle.innerText = `${this.currentSkill} Quiz (${this.currentIndex + 1}/${total})`;
        
        // Update progress bar
        if (this.progressFill) {
            const progress = ((this.currentIndex + 1) / total) * 100;
            this.progressFill.style.width = `${progress}%`;
        }

        // Render Main Question Area
        this.quizBody.innerHTML = `
            <div class="quiz-question-item active animate-fade-in">
                <p class="question-text">${this.currentIndex + 1}. ${this.escapeHtml(q.q)}</p>
                <div class="options-grid">
                    ${q.options.map((opt, optIndex) => `
                        <label class="option-label">
                            <input type="radio" name="quiz-option" value="${optIndex}" 
                                ${this.userAnswers[this.currentIndex] === optIndex ? 'checked' : ''}
                                onchange="window.quizManager.saveCurrentAnswer(); window.quizManager.renderSidebar();">
                            <span class="option-text">${this.escapeHtml(opt)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // Render Sidebar
        this.renderSidebar();

        // Update Buttons Visibility
        this.prevBtn.style.display = this.currentIndex === 0 ? 'none' : 'block';
        
        if (this.currentIndex === total - 1) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.classList.remove('hidden');
        } else {
            this.nextBtn.style.display = 'block';
            this.submitBtn.classList.add('hidden');
        }
    }

    renderSidebar() {
        if (!this.questionNav) return;
        
        const answeredCount = Object.keys(this.userAnswers).length;
        if (this.answeredCountDisplay) {
            this.answeredCountDisplay.innerText = `${answeredCount}/${this.currentQuestions.length} Answered`;
        }

        this.questionNav.innerHTML = this.currentQuestions.map((_, index) => {
            const isAnswered = this.userAnswers.hasOwnProperty(index);
            const isActive = index === this.currentIndex;
            return `
                <div class="nav-item ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}" 
                     onclick="window.quizManager.jumpToQuestion(${index})">
                    ${index + 1}
                </div>
            `;
        }).join('');
    }

    jumpToQuestion(index) {
        this.saveCurrentAnswer();
        this.currentIndex = index;
        this.renderQuiz();
    }

    handleSubmit(force = false) {
        if (!force && !confirm("Are you sure you want to submit your assessment?")) return;
        
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.saveCurrentAnswer();
        let score = 0;
        const total = this.currentQuestions.length;

        for (let i = 0; i < total; i++) {
            if (this.userAnswers[i] === this.currentQuestions[i].correct) {
                score++;
            }
        }

        this.processResults(score);
    }

    processResults(score) {
        const percentage = (score / this.currentQuestions.length) * 100;
        let level = 'Beginner';
        if (percentage >= 80) level = 'Expert';
        else if (percentage >= 50) level = 'Intermediate';

        const currentUser = this.auth.getCurrentUser();
        const attempts = this.storage.getItem('skillshare_quiz_attempts') || [];
        
        const newAttempt = {
            id: this.storage.generateId(),
            userId: currentUser.id,
            skill: this.currentSkill,
            score,
            total: this.currentQuestions.length,
            level,
            timestamp: new Date().toISOString()
        };

        attempts.push(newAttempt);
        this.storage.setItem('skillshare_quiz_attempts', attempts);

        // Update overall user level based on best performance
        this.updateOverallLevel(currentUser, level);

        alert(`Quiz Completed!\nYour Score: ${score}/${this.currentQuestions.length}\nLevel Achieved: ${level}`);
        window.location.href = 'index.html'; // Redirect back to profile
    }

    updateOverallLevel(user, newLevel) {
        const users = this.storage.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            const currentLevel = users[userIndex].level || 'Beginner';
            const levels = ['Beginner', 'Intermediate', 'Expert'];
            
            // Only upgrade, don't downgrade level based on one quiz
            if (levels.indexOf(newLevel) > levels.indexOf(currentLevel)) {
                users[userIndex].level = newLevel;
                this.storage.saveUsers(users);
                this.auth.saveUser(users[userIndex]); // Update session
            }
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize and attach to window
window.quizManager = new QuizManager();
