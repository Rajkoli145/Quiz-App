// Frontend data file - now serves as category structure only
// All questions are fetched from the backend API
export const quizCategories = {
  Java: {
    name: 'Java',
    color: 'from-orange-200 to-red-200',
    icon: '☕',
    subtopics: {
      'Basics & Syntax': { name: 'Basics & Syntax' },
      'Data Types & Variables': { name: 'Data Types & Variables' },
      'Operators': { name: 'Operators' },
      'Control Flow': { name: 'Control Flow' },
      'Arrays': { name: 'Arrays' },
      'Strings & StringBuilder': { name: 'Strings & StringBuilder' },
      'Methods & Recursion': { name: 'Methods & Recursion' },
      'OOP - Classes & Objects': { name: 'OOP - Classes & Objects' },
      'Constructors': { name: 'Constructors' },
      'Inheritance': { name: 'Inheritance' },
      'Polymorphism': { name: 'Polymorphism' },
      'Abstraction': { name: 'Abstraction' },
      'Encapsulation': { name: 'Encapsulation' },
      'Interfaces': { name: 'Interfaces' },
      'Exception Handling': { name: 'Exception Handling' },
      'Collections Framework': { name: 'Collections Framework' },
      'Generics': { name: 'Generics' },
      'Multithreading & Concurrency': { name: 'Multithreading & Concurrency' },
      'File I/O': { name: 'File I/O' },
      'Java 8 Features (Streams, Lambdas)': { name: 'Java 8 Features (Streams, Lambdas)' }
    }
  },
  C: {
    name: 'C',
    color: 'from-blue-200 to-indigo-200',
    icon: '🔷',
    subtopics: {
      'Basics & Syntax': { name: 'Basics & Syntax' },
      'Data Types & Variables': { name: 'Data Types & Variables' },
      'Operators': { name: 'Operators' },
      'Control Flow': { name: 'Control Flow' },
      'Functions & Recursion': { name: 'Functions & Recursion' },
      'Arrays': { name: 'Arrays' },
      'Strings & String Functions': { name: 'Strings & String Functions' },
      'Pointers': { name: 'Pointers' },
      'Structures & Unions': { name: 'Structures & Unions' },
      'Dynamic Memory Allocation': { name: 'Dynamic Memory Allocation' },
      'File Handling': { name: 'File Handling' },
      'Preprocessor Directives & Macros': { name: 'Preprocessor Directives & Macros' },
      'Bitwise Operators': { name: 'Bitwise Operators' }
    }
  },
  'C++': {
    name: 'C++',
    color: 'from-purple-200 to-pink-200',
    icon: '➕',
    subtopics: {
      'Basics & Syntax': { name: 'Basics & Syntax' },
      'Data Types & Variables': { name: 'Data Types & Variables' },
      'Operators': { name: 'Operators' },
      'Control Flow': { name: 'Control Flow' },
      'Functions & Recursion': { name: 'Functions & Recursion' },
      'Arrays': { name: 'Arrays' },
      'Strings & String Class': { name: 'Strings & String Class' },
      'Pointers & References': { name: 'Pointers & References' },
      'Classes & Objects': { name: 'Classes & Objects' },
      'Constructors & Destructors': { name: 'Constructors & Destructors' },
      'Inheritance': { name: 'Inheritance' },
      'Polymorphism': { name: 'Polymorphism' },
      'Encapsulation': { name: 'Encapsulation' },
      'Abstraction': { name: 'Abstraction' },
      'Operator Overloading': { name: 'Operator Overloading' },
      'Function Overloading': { name: 'Function Overloading' },
      'Friend Functions': { name: 'Friend Functions' },
      'Templates': { name: 'Templates' },
      'STL (Vectors, Maps, Sets, Queues, Stacks)': { name: 'STL' },
      'Exception Handling': { name: 'Exception Handling' },
      'File Handling': { name: 'File Handling' }
    }
  },
  Python: {
    name: 'Python',
    color: 'from-green-200 to-teal-200',
    icon: '🐍',
    subtopics: {
      'Basics & Syntax': { name: 'Basics & Syntax' },
      'Data Types & Variables': { name: 'Data Types & Variables' },
      'Operators': { name: 'Operators' },
      'Control Flow': { name: 'Control Flow' },
      'Functions & Recursion': { name: 'Functions & Recursion' },
      'Lists': { name: 'Lists' },
      'Tuples': { name: 'Tuples' },
      'Strings': { name: 'Strings' },
      'Dictionaries': { name: 'Dictionaries' },
      'Sets': { name: 'Sets' },
      'List Comprehensions': { name: 'List Comprehensions' },
      'Classes & Objects': { name: 'Classes & Objects' },
      'Inheritance': { name: 'Inheritance' },
      'Polymorphism': { name: 'Polymorphism' },
      'Encapsulation': { name: 'Encapsulation' },
      'Exception Handling': { name: 'Exception Handling' },
      'File Handling': { name: 'File Handling' },
      'Modules & Packages': { name: 'Modules & Packages' },
      'Iterators & Generators': { name: 'Iterators & Generators' },
      'Decorators': { name: 'Decorators' },
      'Lambda Functions': { name: 'Lambda Functions' },
      'Regular Expressions': { name: 'Regular Expressions' },
      'Python Libraries (NumPy, Pandas, Matplotlib)': { name: 'Python Libraries' }
    }
  }
};