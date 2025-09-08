const mongoose = require('mongoose');
const Category = require('../models/Category.cjs');
require('dotenv').config();

const quizData = {
  java: {
    name: 'Java',
    key: 'java',
    color: 'from-orange-200 to-red-200',
    icon: '☕',
    description: 'Object-oriented programming language',
    subtopics: {
      'Basics & Syntax': {
        name: 'Basics & Syntax',
        questions: [
          {
            id: 'java-basics-1',
            question: 'What is the correct way to declare the main method in Java?',
            options: [
              'public static void main(String[] args)',
              'public void main(String[] args)',
              'public static main(String[] args)',
              'static void main(String[] args)'
            ],
            correctAnswer: 0,
            explanation: 'The main method must be public, static, void, and take a String array as parameter.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-2',
            question: 'Which of the following is NOT a valid Java identifier?',
            options: ['myVariable', '_count', '2ndValue', '$price'],
            correctAnswer: 2,
            explanation: 'Java identifiers cannot start with a digit.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-3',
            question: 'What is the file extension for Java source files?',
            options: ['.java', '.class', '.jar', '.jvm'],
            correctAnswer: 0,
            explanation: 'Java source files have .java extension, compiled files have .class extension.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-4',
            question: 'Which keyword is used to define a class in Java?',
            options: ['class', 'Class', 'define', 'struct'],
            correctAnswer: 0,
            explanation: 'The "class" keyword is used to define a class in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-5',
            question: 'What is the correct syntax for single-line comments in Java?',
            options: ['/* comment */', '// comment', '# comment', '<!-- comment -->'],
            correctAnswer: 1,
            explanation: 'Single-line comments in Java start with //.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-6',
            question: 'Which of these is a reserved keyword in Java?',
            options: ['main', 'string', 'public', 'method'],
            correctAnswer: 2,
            explanation: '"public" is a reserved keyword in Java used for access modifiers.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-7',
            question: 'What does JVM stand for?',
            options: ['Java Virtual Machine', 'Java Variable Method', 'Java Version Manager', 'Java Vector Model'],
            correctAnswer: 0,
            explanation: 'JVM stands for Java Virtual Machine, which executes Java bytecode.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-8',
            question: 'Which method is called when a Java program starts?',
            options: ['start()', 'begin()', 'main()', 'run()'],
            correctAnswer: 2,
            explanation: 'The main() method is the entry point of a Java program.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-9',
            question: 'What is the correct way to print "Hello World" in Java?',
            options: [
              'System.out.println("Hello World");',
              'print("Hello World");',
              'console.log("Hello World");',
              'echo "Hello World";'
            ],
            correctAnswer: 0,
            explanation: 'System.out.println() is used to print output in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-10',
            question: 'Which of the following is case-sensitive in Java?',
            options: ['Keywords only', 'Variable names only', 'Everything', 'Nothing'],
            correctAnswer: 2,
            explanation: 'Java is completely case-sensitive - keywords, variables, methods, etc.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-11',
            question: 'What is the default package in Java?',
            options: ['java.lang', 'java.util', 'default', 'No package'],
            correctAnswer: 3,
            explanation: 'If no package is declared, the class belongs to the default (unnamed) package.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-12',
            question: 'Which symbol is used to terminate statements in Java?',
            options: ['.', ',', ';', ':'],
            correctAnswer: 2,
            explanation: 'Semicolon (;) is used to terminate statements in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-13',
            question: 'What is bytecode in Java?',
            options: [
              'Source code',
              'Compiled code that runs on JVM',
              'Machine code',
              'Assembly code'
            ],
            correctAnswer: 1,
            explanation: 'Bytecode is platform-independent compiled code that runs on the JVM.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-14',
            question: 'Which command compiles a Java source file?',
            options: ['java', 'javac', 'compile', 'build'],
            correctAnswer: 1,
            explanation: 'javac is the Java compiler command.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-15',
            question: 'What is the correct way to import a class in Java?',
            options: [
              'include java.util.Scanner;',
              'import java.util.Scanner;',
              'using java.util.Scanner;',
              'require java.util.Scanner;'
            ],
            correctAnswer: 1,
            explanation: 'The "import" keyword is used to import classes in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-16',
            question: 'Which of these is NOT a primitive data type in Java?',
            options: ['int', 'boolean', 'String', 'char'],
            correctAnswer: 2,
            explanation: 'String is a class, not a primitive data type in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-17',
            question: 'What is the range of byte data type in Java?',
            options: ['-128 to 127', '0 to 255', '-256 to 255', '0 to 127'],
            correctAnswer: 0,
            explanation: 'byte is 8-bit signed integer with range -128 to 127.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-18',
            question: 'Which access modifier makes a member accessible only within the same class?',
            options: ['public', 'protected', 'private', 'default'],
            correctAnswer: 2,
            explanation: 'private access modifier restricts access to the same class only.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-19',
            question: 'What does the "static" keyword mean in Java?',
            options: [
              'The member belongs to the class, not instance',
              'The member cannot be changed',
              'The member is private',
              'The member is final'
            ],
            correctAnswer: 0,
            explanation: 'static members belong to the class rather than any specific instance.',
            difficulty: 'easy'
          },
          {
            id: 'java-basics-20',
            question: 'Which of these is the correct way to declare a constant in Java?',
            options: [
              'const int MAX = 100;',
              'final int MAX = 100;',
              'static int MAX = 100;',
              'readonly int MAX = 100;'
            ],
            correctAnswer: 1,
            explanation: 'The "final" keyword is used to declare constants in Java.',
            difficulty: 'easy'
          }
        ]
      },
      'Data Types & Variables': {
        name: 'Data Types & Variables',
        questions: [
          {
            id: 'java-datatypes-1',
            question: 'What is the size of int data type in Java?',
            options: ['2 bytes', '4 bytes', '8 bytes', '16 bytes'],
            correctAnswer: 1,
            explanation: 'int data type in Java is 32-bit (4 bytes) signed integer.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-2',
            question: 'Which of these is a valid way to declare a variable in Java?',
            options: ['int 2num = 5;', 'int num-2 = 5;', 'int num2 = 5;', 'int #num = 5;'],
            correctAnswer: 2,
            explanation: 'Variable names must start with letter, underscore, or dollar sign.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-3',
            question: 'What is the default value of boolean variable in Java?',
            options: ['true', 'false', 'null', '0'],
            correctAnswer: 1,
            explanation: 'Default value of boolean in Java is false.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-4',
            question: 'Which data type would you use to store a single character?',
            options: ['String', 'char', 'Character', 'byte'],
            correctAnswer: 1,
            explanation: 'char data type stores a single 16-bit Unicode character.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-5',
            question: 'What is the range of short data type in Java?',
            options: ['-32,768 to 32,767', '-128 to 127', '0 to 65,535', '-2,147,483,648 to 2,147,483,647'],
            correctAnswer: 0,
            explanation: 'short is 16-bit signed integer with range -32,768 to 32,767.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-6',
            question: 'Which keyword is used to declare a variable that cannot be reassigned?',
            options: ['const', 'final', 'static', 'immutable'],
            correctAnswer: 1,
            explanation: 'final keyword makes a variable constant in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-7',
            question: 'What happens when you try to assign a larger data type to a smaller one?',
            options: ['Automatic conversion', 'Compilation error', 'Runtime error', 'Data loss'],
            correctAnswer: 1,
            explanation: 'Java requires explicit casting for narrowing conversions.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-8',
            question: 'Which of these is NOT a primitive data type in Java?',
            options: ['int', 'float', 'String', 'double'],
            correctAnswer: 2,
            explanation: 'String is a reference type, not a primitive data type.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-9',
            question: 'What is the size of double data type in Java?',
            options: ['4 bytes', '8 bytes', '16 bytes', '32 bytes'],
            correctAnswer: 1,
            explanation: 'double is 64-bit (8 bytes) floating-point number.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-10',
            question: 'Which suffix is used for long literals in Java?',
            options: ['l', 'L', 'Both A and B', 'lg'],
            correctAnswer: 2,
            explanation: 'Both l and L can be used, but L is preferred for clarity.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-11',
            question: 'What is the default value of int variable in Java?',
            options: ['null', '0', '1', 'undefined'],
            correctAnswer: 1,
            explanation: 'Default value of int in Java is 0.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-12',
            question: 'Which data type has the largest range in Java?',
            options: ['int', 'long', 'float', 'double'],
            correctAnswer: 3,
            explanation: 'double has the largest range among numeric types.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-13',
            question: 'What is type casting in Java?',
            options: ['Converting one data type to another', 'Creating new data types', 'Deleting variables', 'Copying variables'],
            correctAnswer: 0,
            explanation: 'Type casting converts one data type to another.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-14',
            question: 'Which of these requires explicit casting?',
            options: ['int to long', 'float to double', 'double to int', 'char to int'],
            correctAnswer: 2,
            explanation: 'Converting from larger to smaller type requires explicit casting.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-15',
            question: 'What is the wrapper class for int in Java?',
            options: ['Int', 'Integer', 'Number', 'Numeric'],
            correctAnswer: 1,
            explanation: 'Integer is the wrapper class for primitive int.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-16',
            question: 'Which operator is used for string concatenation in Java?',
            options: ['+', '&', '.', '++'],
            correctAnswer: 0,
            explanation: 'The + operator is used for string concatenation in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-17',
            question: 'What is autoboxing in Java?',
            options: ['Automatic type casting', 'Converting primitive to wrapper', 'Creating objects', 'Memory management'],
            correctAnswer: 1,
            explanation: 'Autoboxing automatically converts primitive to wrapper class.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-18',
            question: 'Which data type would you use for currency calculations?',
            options: ['float', 'double', 'BigDecimal', 'int'],
            correctAnswer: 2,
            explanation: 'BigDecimal is recommended for precise decimal calculations.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-19',
            question: 'What is the difference between float and double?',
            options: ['No difference', 'float is 32-bit, double is 64-bit', 'float is integer, double is decimal', 'float is faster'],
            correctAnswer: 1,
            explanation: 'float is 32-bit, double is 64-bit floating-point number.',
            difficulty: 'easy'
          },
          {
            id: 'java-datatypes-20',
            question: 'Which keyword is used to create a variable that belongs to the class?',
            options: ['static', 'final', 'public', 'private'],
            correctAnswer: 0,
            explanation: 'static keyword creates class-level variables.',
            difficulty: 'easy'
          }
        ]
      },
      'Operators': {
        name: 'Operators',
        questions: [
          {
            id: 'java-operators-1',
            question: 'What is the result of 10 % 3 in Java?',
            options: ['3', '1', '0', '10'],
            correctAnswer: 1,
            explanation: 'The modulo operator % returns the remainder of division. 10 % 3 = 1.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-2',
            question: 'Which operator is used for logical AND in Java?',
            options: ['&', '&&', 'AND', 'and'],
            correctAnswer: 1,
            explanation: '&& is the logical AND operator in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-3',
            question: 'What does the ++ operator do?',
            options: ['Adds 2', 'Increments by 1', 'Multiplies by 2', 'Concatenates'],
            correctAnswer: 1,
            explanation: 'The ++ operator increments the value by 1.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-4',
            question: 'Which operator is used for logical OR in Java?',
            options: ['|', '||', 'OR', 'or'],
            correctAnswer: 1,
            explanation: '|| is the logical OR operator in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-5',
            question: 'What does the -- operator do?',
            options: ['Subtracts 2', 'Decrements by 1', 'Divides by 2', 'Negates'],
            correctAnswer: 1,
            explanation: 'The -- operator decrements the value by 1.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-6',
            question: 'Which operator is used for equality comparison?',
            options: ['=', '==', '===', 'equals'],
            correctAnswer: 1,
            explanation: '== is used for equality comparison in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-7',
            question: 'What is the difference between = and == operators?',
            options: ['No difference', '= assigns, == compares', '== assigns, = compares', 'Both are same'],
            correctAnswer: 1,
            explanation: '= is assignment operator, == is comparison operator.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-8',
            question: 'Which operator is used for not equal comparison?',
            options: ['!=', '<>', '!==', 'not'],
            correctAnswer: 0,
            explanation: '!= is the not equal operator in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-9',
            question: 'What does the ?: operator represent?',
            options: ['Conditional operator', 'Assignment operator', 'Logical operator', 'Arithmetic operator'],
            correctAnswer: 0,
            explanation: '?: is the ternary/conditional operator in Java.',
            difficulty: 'medium'
          },
          {
            id: 'java-operators-10',
            question: 'Which operator has the highest precedence?',
            options: ['*', '+', '()', '='],
            correctAnswer: 2,
            explanation: 'Parentheses () have the highest precedence in Java.',
            difficulty: 'medium'
          },
          {
            id: 'java-operators-11',
            question: 'What is the result of true && false?',
            options: ['true', 'false', 'null', 'error'],
            correctAnswer: 1,
            explanation: 'Logical AND returns true only when both operands are true.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-12',
            question: 'What is the result of true || false?',
            options: ['true', 'false', 'null', 'error'],
            correctAnswer: 0,
            explanation: 'Logical OR returns true when at least one operand is true.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-13',
            question: 'Which operator is used for bitwise AND?',
            options: ['&', '&&', 'AND', 'and'],
            correctAnswer: 0,
            explanation: 'Single & is used for bitwise AND operation.',
            difficulty: 'medium'
          },
          {
            id: 'java-operators-14',
            question: 'What does the << operator do?',
            options: ['Left shift', 'Right shift', 'Less than', 'Assignment'],
            correctAnswer: 0,
            explanation: '<< is the left shift operator in Java.',
            difficulty: 'medium'
          },
          {
            id: 'java-operators-15',
            question: 'Which operator is used for instanceof checking?',
            options: ['instanceof', 'typeof', 'is', 'check'],
            correctAnswer: 0,
            explanation: 'instanceof operator checks if an object is an instance of a class.',
            difficulty: 'medium'
          },
          {
            id: 'java-operators-16',
            question: 'What is the result of 5 / 2 in Java (integer division)?',
            options: ['2.5', '2', '3', 'error'],
            correctAnswer: 1,
            explanation: 'Integer division truncates the decimal part, so 5/2 = 2.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-17',
            question: 'Which operator is used for string concatenation?',
            options: ['+', '&', '.', '++'],
            correctAnswer: 0,
            explanation: 'The + operator is overloaded for string concatenation in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-18',
            question: 'What does the ! operator do?',
            options: ['Factorial', 'Logical NOT', 'Not equal', 'Assignment'],
            correctAnswer: 1,
            explanation: '! is the logical NOT operator in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-19',
            question: 'Which operator is used for greater than or equal?',
            options: ['>=', '=>', '>', '=='],
            correctAnswer: 0,
            explanation: '>= is the greater than or equal operator.',
            difficulty: 'easy'
          },
          {
            id: 'java-operators-20',
            question: 'What is operator precedence?',
            options: ['Order of execution', 'Type of operator', 'Number of operands', 'Operator position'],
            correctAnswer: 0,
            explanation: 'Operator precedence determines the order in which operators are evaluated.',
            difficulty: 'medium'
          }
        ]
      },
      'Control Flow': {
        name: 'Control Flow',
        questions: [
          {
            id: 'java-control-1',
            question: 'Which statement is used to exit from a loop?',
            options: ['exit', 'break', 'stop', 'return'],
            correctAnswer: 1,
            explanation: 'The break statement is used to exit from a loop.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-2',
            question: 'What is the correct syntax for a for loop?',
            options: [
              'for(int i=0; i<10; i++)',
              'for(int i=0, i<10, i++)',
              'for(int i=0: i<10: i++)',
              'for int i=0; i<10; i++'
            ],
            correctAnswer: 0,
            explanation: 'The correct syntax uses semicolons to separate the three parts.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-3',
            question: 'Which keyword is used to skip the current iteration in a loop?',
            options: ['skip', 'continue', 'next', 'pass'],
            correctAnswer: 1,
            explanation: 'The continue statement skips the current iteration and moves to the next.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-4',
            question: 'Which loop is guaranteed to execute at least once?',
            options: ['for', 'while', 'do-while', 'foreach'],
            correctAnswer: 2,
            explanation: 'do-while loop checks condition after execution, so it runs at least once.',
            difficulty: 'medium'
          },
          {
            id: 'java-control-5',
            question: 'What is the syntax for a while loop?',
            options: ['while(condition) {}', 'while condition {}', 'while(condition);', 'while: condition {}'],
            correctAnswer: 0,
            explanation: 'while loop syntax requires parentheses around condition and curly braces for body.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-6',
            question: 'Which statement is used in switch cases?',
            options: ['case', 'when', 'if', 'condition'],
            correctAnswer: 0,
            explanation: 'case statement is used to define different cases in a switch statement.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-7',
            question: 'What happens if you forget break in a switch case?',
            options: ['Compilation error', 'Runtime error', 'Fall-through to next case', 'Nothing'],
            correctAnswer: 2,
            explanation: 'Without break, execution continues to the next case (fall-through).',
            difficulty: 'medium'
          },
          {
            id: 'java-control-8',
            question: 'Which keyword is used for the default case in switch?',
            options: ['default', 'else', 'otherwise', 'final'],
            correctAnswer: 0,
            explanation: 'default keyword is used for the default case in switch statements.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-9',
            question: 'What is an enhanced for loop also called?',
            options: ['Advanced loop', 'For-each loop', 'Iterator loop', 'Collection loop'],
            correctAnswer: 1,
            explanation: 'Enhanced for loop is also called for-each loop.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-10',
            question: 'Which loop should you use when you know the exact number of iterations?',
            options: ['while', 'do-while', 'for', 'foreach'],
            correctAnswer: 2,
            explanation: 'for loop is ideal when you know the exact number of iterations.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-11',
            question: 'What is the syntax for enhanced for loop?',
            options: ['for(type var : collection)', 'for(var in collection)', 'for(type var in collection)', 'for each(var : collection)'],
            correctAnswer: 0,
            explanation: 'Enhanced for loop syntax: for(type variable : collection).',
            difficulty: 'medium'
          },
          {
            id: 'java-control-12',
            question: 'Which statement is used for conditional execution?',
            options: ['if', 'when', 'condition', 'check'],
            correctAnswer: 0,
            explanation: 'if statement is used for conditional execution in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-13',
            question: 'What is the alternative to multiple if-else statements?',
            options: ['switch', 'case', 'when', 'select'],
            correctAnswer: 0,
            explanation: 'switch statement is an alternative to multiple if-else statements.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-14',
            question: 'Can you use strings in switch statements in Java?',
            options: ['Yes, from Java 7+', 'No, never', 'Yes, always', 'Only with equals()'],
            correctAnswer: 0,
            explanation: 'String switch statements are supported from Java 7 onwards.',
            difficulty: 'medium'
          },
          {
            id: 'java-control-15',
            question: 'What is a nested loop?',
            options: ['Loop inside another loop', 'Loop with conditions', 'Loop with break', 'Loop with continue'],
            correctAnswer: 0,
            explanation: 'Nested loop is a loop placed inside another loop.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-16',
            question: 'Which keyword exits from the innermost loop only?',
            options: ['break', 'continue', 'return', 'exit'],
            correctAnswer: 0,
            explanation: 'break exits only from the innermost loop in nested loops.',
            difficulty: 'medium'
          },
          {
            id: 'java-control-17',
            question: 'What is the difference between break and continue?',
            options: ['No difference', 'break exits loop, continue skips iteration', 'continue exits loop, break skips iteration', 'Both exit loops'],
            correctAnswer: 1,
            explanation: 'break exits the loop completely, continue skips current iteration only.',
            difficulty: 'medium'
          },
          {
            id: 'java-control-18',
            question: 'Can you have an if statement without else?',
            options: ['Yes', 'No', 'Only with return', 'Only in methods'],
            correctAnswer: 0,
            explanation: 'else clause is optional in if statements.',
            difficulty: 'easy'
          },
          {
            id: 'java-control-19',
            question: 'What is the ternary operator syntax?',
            options: ['condition ? true : false', 'if condition then true else false', 'condition true false', 'condition -> true : false'],
            correctAnswer: 0,
            explanation: 'Ternary operator syntax: condition ? valueIfTrue : valueIfFalse.',
            difficulty: 'medium'
          },
          {
            id: 'java-control-20',
            question: 'Which loop executes the body first, then checks condition?',
            options: ['for', 'while', 'do-while', 'foreach'],
            correctAnswer: 2,
            explanation: 'do-while loop executes the body first, then checks the condition.',
            difficulty: 'easy'
          }
        ]
      },
      'Arrays': {
        name: 'Arrays',
        questions: [
          {
            id: 'java-array-1',
            question: 'What is the correct way to declare an array in Java?',
            options: [
              'int arr[] = new int[5];',
              'int[] arr = new int[5];',
              'Both A and B',
              'None of the above'
            ],
            correctAnswer: 2,
            explanation: 'Both syntaxes are valid in Java for array declaration.',
            difficulty: 'easy'
          },
          {
            id: 'java-array-2',
            question: 'What is the default value of elements in an integer array in Java?',
            options: ['null', '0', '1', 'undefined'],
            correctAnswer: 1,
            explanation: 'Integer arrays are initialized with 0 by default in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-array-3',
            question: 'How do you find the length of an array in Java?',
            options: ['array.size()', 'array.length()', 'array.length', 'array.count()'],
            correctAnswer: 2,
            explanation: 'In Java, array.length is a field, not a method.',
            difficulty: 'easy'
          }
        ]
      },
      'Strings & StringBuilder': {
        name: 'Strings & StringBuilder',
        questions: [
          {
            id: 'java-strings-1',
            question: 'Which method is used to find the length of a string?',
            options: ['size()', 'length()', 'count()', 'len()'],
            correctAnswer: 1,
            explanation: 'The length() method returns the number of characters in a string.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-2',
            question: 'What is the difference between String and StringBuilder?',
            options: [
              'No difference',
              'StringBuilder is mutable, String is immutable',
              'String is mutable, StringBuilder is immutable',
              'Both are mutable'
            ],
            correctAnswer: 1,
            explanation: 'StringBuilder is mutable and efficient for string concatenation, while String is immutable.',
            difficulty: 'medium'
          },
          {
            id: 'java-strings-3',
            question: 'Which method converts a string to uppercase?',
            options: ['toUpper()', 'upperCase()', 'toUpperCase()', 'upper()'],
            correctAnswer: 2,
            explanation: 'The toUpperCase() method converts all characters to uppercase.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-4',
            question: 'Which method is used to compare strings for equality?',
            options: ['==', 'equals()', 'compare()', 'match()'],
            correctAnswer: 1,
            explanation: 'equals() method compares string content, == compares references.',
            difficulty: 'medium'
          },
          {
            id: 'java-strings-5',
            question: 'What does the substring() method do?',
            options: ['Replaces characters', 'Extracts part of string', 'Converts to lowercase', 'Finds character position'],
            correctAnswer: 1,
            explanation: 'substring() method extracts a portion of the string.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-6',
            question: 'Which method finds the index of a character in a string?',
            options: ['find()', 'search()', 'indexOf()', 'locate()'],
            correctAnswer: 2,
            explanation: 'indexOf() method returns the index of first occurrence of a character.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-7',
            question: 'What is string concatenation?',
            options: ['Joining strings', 'Splitting strings', 'Comparing strings', 'Reversing strings'],
            correctAnswer: 0,
            explanation: 'String concatenation is the process of joining two or more strings.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-8',
            question: 'Which is more efficient for multiple string concatenations?',
            options: ['String', 'StringBuilder', 'StringBuffer', 'Both A and B'],
            correctAnswer: 1,
            explanation: 'StringBuilder is more efficient for multiple concatenations as it is mutable.',
            difficulty: 'medium'
          },
          {
            id: 'java-strings-9',
            question: 'What does the trim() method do?',
            options: ['Removes spaces from middle', 'Removes leading/trailing spaces', 'Converts to lowercase', 'Shortens string length'],
            correctAnswer: 1,
            explanation: 'trim() method removes leading and trailing whitespace.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-10',
            question: 'Which method splits a string into an array?',
            options: ['split()', 'divide()', 'separate()', 'break()'],
            correctAnswer: 0,
            explanation: 'split() method divides a string into an array based on a delimiter.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-11',
            question: 'What is the difference between StringBuilder and StringBuffer?',
            options: ['No difference', 'StringBuilder is synchronized', 'StringBuffer is synchronized', 'StringBuffer is faster'],
            correctAnswer: 2,
            explanation: 'StringBuffer is synchronized (thread-safe), StringBuilder is not.',
            difficulty: 'medium'
          },
          {
            id: 'java-strings-12',
            question: 'Which method replaces characters in a string?',
            options: ['change()', 'replace()', 'substitute()', 'modify()'],
            correctAnswer: 1,
            explanation: 'replace() method replaces occurrences of characters or substrings.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-13',
            question: 'How do you check if a string contains a substring?',
            options: ['includes()', 'contains()', 'has()', 'find()'],
            correctAnswer: 1,
            explanation: 'contains() method checks if a string contains a specified substring.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-14',
            question: 'What does charAt() method return?',
            options: ['String', 'char', 'int', 'boolean'],
            correctAnswer: 1,
            explanation: 'charAt() method returns the character at the specified index.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-15',
            question: 'Which method checks if string starts with a prefix?',
            options: ['beginsWith()', 'startsWith()', 'prefixWith()', 'starts()'],
            correctAnswer: 1,
            explanation: 'startsWith() method checks if string begins with specified prefix.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-16',
            question: 'What is string immutability?',
            options: ['Strings can be changed', 'Strings cannot be changed once created', 'Strings are always null', 'Strings are numbers'],
            correctAnswer: 1,
            explanation: 'String immutability means strings cannot be modified after creation.',
            difficulty: 'medium'
          },
          {
            id: 'java-strings-17',
            question: 'Which method converts string to character array?',
            options: ['toArray()', 'toCharArray()', 'getChars()', 'chars()'],
            correctAnswer: 1,
            explanation: 'toCharArray() method converts string to character array.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-18',
            question: 'What does isEmpty() method check?',
            options: ['If string is null', 'If string length is 0', 'If string has spaces', 'If string is uppercase'],
            correctAnswer: 1,
            explanation: 'isEmpty() method returns true if string length is 0.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-19',
            question: 'Which method compares strings ignoring case?',
            options: ['equals()', 'equalsIgnoreCase()', 'compareIgnoreCase()', 'matchIgnoreCase()'],
            correctAnswer: 1,
            explanation: 'equalsIgnoreCase() method compares strings without considering case.',
            difficulty: 'easy'
          },
          {
            id: 'java-strings-20',
            question: 'What is the return type of compareTo() method?',
            options: ['boolean', 'int', 'String', 'char'],
            correctAnswer: 1,
            explanation: 'compareTo() method returns int: negative, zero, or positive value.',
            difficulty: 'medium'
          }
        ]
      },
      'Methods & Recursion': {
        name: 'Methods & Recursion',
        questions: [
          {
            id: 'java-methods-1',
            question: 'What keyword is used to define a method in Java?',
            options: ['function', 'method', 'def', 'No specific keyword'],
            correctAnswer: 3,
            explanation: 'Java uses access modifiers and return types, no specific "method" keyword.',
            difficulty: 'easy'
          },
          {
            id: 'java-methods-2',
            question: 'What is recursion?',
            options: [
              'A loop that runs forever',
              'A method calling itself',
              'A method with no return value',
              'A static method'
            ],
            correctAnswer: 1,
            explanation: 'Recursion is when a method calls itself to solve a problem.',
            difficulty: 'medium'
          },
          {
            id: 'java-methods-3',
            question: 'What is method overloading?',
            options: [
              'Having too many methods',
              'Methods with same name but different parameters',
              'Methods that call themselves',
              'Methods with no return type'
            ],
            correctAnswer: 1,
            explanation: 'Method overloading allows multiple methods with the same name but different parameters.',
            difficulty: 'medium'
          }
        ]
      },
      'OOP - Classes & Objects': {
        name: 'OOP - Classes & Objects',
        questions: [
          {
            id: 'java-oop-1',
            question: 'Which keyword is used to create a class in Java?',
            options: ['class', 'Class', 'new', 'object'],
            correctAnswer: 0,
            explanation: 'The "class" keyword is used to define a class in Java.',
            difficulty: 'easy'
          },
          {
            id: 'java-oop-2',
            question: 'What is encapsulation?',
            options: [
              'Hiding implementation details',
              'Creating multiple methods with same name',
              'Inheriting properties from parent class',
              'Creating objects'
            ],
            correctAnswer: 0,
            explanation: 'Encapsulation is the concept of hiding internal implementation details.',
            difficulty: 'medium'
          },
          {
            id: 'java-oop-3',
            question: 'Which operator is used to create an object?',
            options: ['create', 'new', 'object', 'instance'],
            correctAnswer: 1,
            explanation: 'The "new" operator is used to create objects in Java.',
            difficulty: 'easy'
          }
        ]
      },
      'Constructors': {
        name: 'Constructors',
        questions: [
          {
            id: 'java-constructor-1',
            question: 'What is a constructor in Java?',
            options: [
              'A method that destroys objects',
              'A special method called when object is created',
              'A method that returns a value',
              'A static method'
            ],
            correctAnswer: 1,
            explanation: 'Constructor is a special method automatically called when an object is created.',
            difficulty: 'easy'
          },
          {
            id: 'java-constructor-2',
            question: 'Can a constructor have a return type?',
            options: ['Yes, always', 'No, never', 'Only void', 'Only int'],
            correctAnswer: 1,
            explanation: 'Constructors cannot have a return type, not even void.',
            difficulty: 'medium'
          }
        ]
      },
      'Inheritance': {
        name: 'Inheritance',
        questions: [
          {
            id: 'java-inheritance-1',
            question: 'Which keyword is used to inherit a class in Java?',
            options: ['inherits', 'extends', 'implements', 'super'],
            correctAnswer: 1,
            explanation: 'The extends keyword is used for class inheritance.',
            difficulty: 'easy'
          },
          {
            id: 'java-inheritance-2',
            question: 'What is the maximum number of classes a Java class can extend?',
            options: ['1', '2', '3', 'Unlimited'],
            correctAnswer: 0,
            explanation: 'Java supports single inheritance - a class can extend only one class.',
            difficulty: 'medium'
          }
        ]
      },
      'Polymorphism': {
        name: 'Polymorphism',
        questions: [
          {
            id: 'java-polymorphism-1',
            question: 'What is polymorphism?',
            options: [
              'Having multiple forms',
              'Having single form',
              'Creating objects',
              'Destroying objects'
            ],
            correctAnswer: 0,
            explanation: 'Polymorphism means having multiple forms - same method behaving differently.',
            difficulty: 'medium'
          }
        ]
      },
      'Abstraction': {
        name: 'Abstraction',
        questions: [
          {
            id: 'java-abstraction-1',
            question: 'Which keyword is used to create an abstract class?',
            options: ['abstract', 'virtual', 'interface', 'final'],
            correctAnswer: 0,
            explanation: 'The abstract keyword is used to create abstract classes.',
            difficulty: 'easy'
          }
        ]
      },
      'Encapsulation': {
        name: 'Encapsulation',
        questions: [
          {
            id: 'java-encapsulation-1',
            question: 'Which access modifier provides the most restrictive access?',
            options: ['public', 'protected', 'default', 'private'],
            correctAnswer: 3,
            explanation: 'Private access modifier restricts access to within the same class only.',
            difficulty: 'medium'
          }
        ]
      },
      'Interfaces': {
        name: 'Interfaces',
        questions: [
          {
            id: 'java-interface-1',
            question: 'Which keyword is used to implement an interface?',
            options: ['extends', 'implements', 'interface', 'abstract'],
            correctAnswer: 1,
            explanation: 'The implements keyword is used to implement interfaces.',
            difficulty: 'easy'
          }
        ]
      },
      'Exception Handling': {
        name: 'Exception Handling',
        questions: [
          {
            id: 'java-exception-1',
            question: 'Which block is used to handle exceptions?',
            options: ['try-catch', 'if-else', 'switch-case', 'for-loop'],
            correctAnswer: 0,
            explanation: 'try-catch blocks are used for exception handling.',
            difficulty: 'easy'
          }
        ]
      },
      'Collections Framework': {
        name: 'Collections Framework',
        questions: [
          {
            id: 'java-collections-1',
            question: 'Which interface is the root of the collection hierarchy?',
            options: ['List', 'Set', 'Collection', 'Map'],
            correctAnswer: 2,
            explanation: 'Collection interface is the root of the collection hierarchy.',
            difficulty: 'medium'
          }
        ]
      },
      'Generics': {
        name: 'Generics',
        questions: [
          {
            id: 'java-generics-1',
            question: 'What symbol is used to denote generics in Java?',
            options: ['[]', '()', '<>', '{}'],
            correctAnswer: 2,
            explanation: 'Angle brackets <> are used to denote generics.',
            difficulty: 'easy'
          }
        ]
      },
      'Multithreading & Concurrency': {
        name: 'Multithreading & Concurrency',
        questions: [
          {
            id: 'java-thread-1',
            question: 'Which class is used to create threads in Java?',
            options: ['Thread', 'Process', 'Task', 'Run'],
            correctAnswer: 0,
            explanation: 'Thread class is used to create and manage threads.',
            difficulty: 'easy'
          }
        ]
      },
      'File I/O': {
        name: 'File I/O',
        questions: [
          {
            id: 'java-io-1',
            question: 'Which package contains file I/O classes?',
            options: ['java.file', 'java.io', 'java.util', 'java.lang'],
            correctAnswer: 1,
            explanation: 'java.io package contains file input/output classes.',
            difficulty: 'easy'
          }
        ]
      },
      'Java 8 Features (Streams, Lambdas)': {
        name: 'Java 8 Features (Streams, Lambdas)',
        questions: [
          {
            id: 'java-lambda-1',
            question: 'What symbol is used for lambda expressions?',
            options: ['->', '=>', '==>', '->'],
            correctAnswer: 0,
            explanation: 'The -> symbol is used for lambda expressions.',
            difficulty: 'medium'
          }
        ]
      }
    }
  },
  c: {
    name: 'C',
    key: 'c',
    color: 'from-blue-200 to-indigo-200',
    icon: '🔷',
    description: 'Procedural programming language',
    subtopics: {
      'Basics & Syntax': {
        name: 'Basics & Syntax',
        questions: [
          {
            id: 'c-basics-1',
            question: 'Which header file is required for printf() function?',
            options: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'],
            correctAnswer: 1,
            explanation: 'stdio.h (standard input/output) header file contains printf() function declaration.',
            difficulty: 'easy'
          },
          {
            id: 'c-basics-2',
            question: 'What is the correct syntax for main function in C?',
            options: ['int main()', 'void main()', 'int main(void)', 'All of the above'],
            correctAnswer: 3,
            explanation: 'All three syntaxes are valid, though int main() is preferred for standard compliance.',
            difficulty: 'easy'
          }
        ]
      },
      'Data Types & Variables': {
        name: 'Data Types & Variables',
        questions: [
          {
            id: 'c-datatypes-1',
            question: 'What is the size of int in C?',
            options: ['Always 4 bytes', 'Always 2 bytes', 'Depends on system', 'Always 8 bytes'],
            correctAnswer: 2,
            explanation: 'The size of int depends on the system architecture.',
            difficulty: 'medium'
          }
        ]
      },
      'Operators': {
        name: 'Operators',
        questions: [
          {
            id: 'c-operators-1',
            question: 'Which operator is used for modulus in C?',
            options: ['%', 'mod', '//', '\\'],
            correctAnswer: 0,
            explanation: 'The % operator is used for modulus operation in C.',
            difficulty: 'easy'
          }
        ]
      },
      'Control Flow': {
        name: 'Control Flow',
        questions: [
          {
            id: 'c-control-1',
            question: 'Which statement is used to exit from a loop in C?',
            options: ['exit', 'break', 'stop', 'return'],
            correctAnswer: 1,
            explanation: 'The break statement is used to exit from a loop.',
            difficulty: 'easy'
          }
        ]
      },
      'Functions & Recursion': {
        name: 'Functions & Recursion',
        questions: [
          {
            id: 'c-functions-1',
            question: 'What is the return type of main function in C?',
            options: ['void', 'int', 'char', 'float'],
            correctAnswer: 1,
            explanation: 'The main function typically returns an int value.',
            difficulty: 'easy'
          }
        ]
      },
      'Arrays': {
        name: 'Arrays',
        questions: [
          {
            id: 'c-arrays-1',
            question: 'How do you declare an array of 10 integers in C?',
            options: ['int arr[10]', 'int arr(10)', 'array int arr[10]', 'int[10] arr'],
            correctAnswer: 0,
            explanation: 'Arrays are declared using square brackets with the size.',
            difficulty: 'easy'
          }
        ]
      },
      'Strings & String Functions': {
        name: 'Strings & String Functions',
        questions: [
          {
            id: 'c-strings-1',
            question: 'Which function is used to find string length in C?',
            options: ['length()', 'strlen()', 'size()', 'len()'],
            correctAnswer: 1,
            explanation: 'strlen() function returns the length of a string.',
            difficulty: 'easy'
          }
        ]
      },
      'Pointers': {
        name: 'Pointers',
        questions: [
          {
            id: 'c-pointers-1',
            question: 'What does the & operator do in C?',
            options: ['Logical AND', 'Address of operator', 'Bitwise AND', 'Reference operator'],
            correctAnswer: 1,
            explanation: 'The & operator returns the memory address of a variable.',
            difficulty: 'medium'
          },
          {
            id: 'c-pointers-2',
            question: 'What does the * operator do with pointers?',
            options: ['Multiplication', 'Dereference', 'Address of', 'Declaration'],
            correctAnswer: 1,
            explanation: 'The * operator dereferences a pointer to access the value.',
            difficulty: 'medium'
          }
        ]
      },
      'Structures & Unions': { name: 'Structures & Unions', questions: [] },
      'Dynamic Memory Allocation': { name: 'Dynamic Memory Allocation', questions: [] },
      'File Handling': { name: 'File Handling', questions: [] },
      'Preprocessor Directives & Macros': { name: 'Preprocessor Directives & Macros', questions: [] },
      'Bitwise Operators': { name: 'Bitwise Operators', questions: [] }
    }
  },
  'cpp': {
    name: 'C++',
    key: 'cpp',
    color: 'from-purple-200 to-pink-200',
    icon: '➕',
    description: 'Object-oriented extension of C',
    subtopics: {
      'Basics & Syntax': {
        name: 'Basics & Syntax',
        questions: [
          {
            id: 'cpp-basics-1',
            question: 'Which header file is required for cout in C++?',
            options: ['<stdio.h>', '<iostream>', '<conio.h>', '<stdlib.h>'],
            correctAnswer: 1,
            explanation: 'iostream header file contains cout and cin declarations.',
            difficulty: 'easy'
          },
          {
            id: 'cpp-basics-2',
            question: 'What is the scope resolution operator in C++?',
            options: ['::', '->', '.', '&'],
            correctAnswer: 0,
            explanation: ':: is the scope resolution operator used to access global variables or class members.',
            difficulty: 'easy'
          }
        ]
      },
      'Data Types & Variables': {
        name: 'Data Types & Variables',
        questions: [
          {
            id: 'cpp-datatypes-1',
            question: 'Which data type is used for boolean values in C++?',
            options: ['boolean', 'bool', 'Boolean', 'BOOL'],
            correctAnswer: 1,
            explanation: 'bool is the data type for boolean values in C++.',
            difficulty: 'easy'
          }
        ]
      },
      'Operators': {
        name: 'Operators',
        questions: [
          {
            id: 'cpp-operators-1',
            question: 'Which operator is used for insertion in C++?',
            options: ['<<', '>>', '<-', '->'],
            correctAnswer: 0,
            explanation: 'The << operator is used for insertion (output) in C++.',
            difficulty: 'easy'
          }
        ]
      },
      'Control Flow': {
        name: 'Control Flow',
        questions: [
          {
            id: 'cpp-control-1',
            question: 'Which loop is guaranteed to execute at least once?',
            options: ['for', 'while', 'do-while', 'foreach'],
            correctAnswer: 2,
            explanation: 'do-while loop checks condition after execution, so it runs at least once.',
            difficulty: 'medium'
          }
        ]
      },
      'Functions & Recursion': {
        name: 'Functions & Recursion',
        questions: [
          {
            id: 'cpp-functions-1',
            question: 'What is function overloading in C++?',
            options: [
              'Functions with same name but different parameters',
              'Functions that call themselves',
              'Functions with no return type',
              'Functions with multiple return types'
            ],
            correctAnswer: 0,
            explanation: 'Function overloading allows multiple functions with same name but different parameters.',
            difficulty: 'medium'
          }
        ]
      },
      'Arrays': {
        name: 'Arrays',
        questions: [
          {
            id: 'cpp-arrays-1',
            question: 'How do you declare a dynamic array in C++?',
            options: ['int arr[]', 'int* arr = new int[size]', 'array<int> arr', 'int arr[size]'],
            correctAnswer: 1,
            explanation: 'Dynamic arrays are created using new operator with pointer.',
            difficulty: 'medium'
          }
        ]
      },
      'Strings & String Class': {
        name: 'Strings & String Class',
        questions: [
          {
            id: 'cpp-strings-1',
            question: 'Which header is needed for string class in C++?',
            options: ['<string.h>', '<string>', '<cstring>', '<strings>'],
            correctAnswer: 1,
            explanation: '<string> header is needed for C++ string class.',
            difficulty: 'easy'
          }
        ]
      },
      'Pointers & References': {
        name: 'Pointers & References',
        questions: [
          {
            id: 'cpp-pointers-1',
            question: 'What is the difference between pointer and reference?',
            options: [
              'No difference',
              'Pointer can be reassigned, reference cannot',
              'Reference can be reassigned, pointer cannot',
              'Both are same'
            ],
            correctAnswer: 1,
            explanation: 'Pointers can be reassigned to point to different objects, references cannot.',
            difficulty: 'medium'
          }
        ]
      },
      'Classes & Objects': {
        name: 'Classes & Objects',
        questions: [
          {
            id: 'cpp-class-1',
            question: 'What is the default access specifier for class members in C++?',
            options: ['public', 'private', 'protected', 'default'],
            correctAnswer: 1,
            explanation: 'In C++ classes, members are private by default.',
            difficulty: 'medium'
          },
          {
            id: 'cpp-class-2',
            question: 'Which operator is used to access class members through object?',
            options: ['::', '->', '.', '&'],
            correctAnswer: 2,
            explanation: 'The dot (.) operator is used to access class members through an object.',
            difficulty: 'easy'
          }
        ]
      },
      'Constructors & Destructors': { name: 'Constructors & Destructors', questions: [] },
      'Inheritance': { name: 'Inheritance', questions: [] },
      'Polymorphism': { name: 'Polymorphism', questions: [] },
      'Encapsulation': { name: 'Encapsulation', questions: [] },
      'Abstraction': { name: 'Abstraction', questions: [] },
      'Operator Overloading': { name: 'Operator Overloading', questions: [] },
      'Function Overloading': { name: 'Function Overloading', questions: [] },
      'Friend Functions': { name: 'Friend Functions', questions: [] },
      'Templates': { name: 'Templates', questions: [] },
      'STL (Vectors, Maps, Sets, Queues, Stacks)': { name: 'STL', questions: [] },
      'Exception Handling': { name: 'Exception Handling', questions: [] },
      'File Handling': { name: 'File Handling', questions: [] }
    }
  },
  python: {
    name: 'Python',
    key: 'python',
    color: 'from-green-200 to-teal-200',
    icon: '🐍',
    description: 'High-level interpreted language',
    subtopics: {
      'Basics & Syntax': {
        name: 'Basics & Syntax',
        questions: [
          {
            id: 'python-basics-1',
            question: 'Which function is used to display output in Python?',
            options: ['echo()', 'print()', 'display()', 'show()'],
            correctAnswer: 1,
            explanation: 'print() function is used to display output in Python.',
            difficulty: 'easy'
          },
          {
            id: 'python-basics-2',
            question: 'How do you create a comment in Python?',
            options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'],
            correctAnswer: 2,
            explanation: 'Hash (#) symbol is used for single-line comments in Python.',
            difficulty: 'easy'
          }
        ]
      },
      'Data Types & Variables': {
        name: 'Data Types & Variables',
        questions: [
          {
            id: 'python-datatypes-1',
            question: 'Which function is used to check the type of a variable?',
            options: ['typeof()', 'type()', 'datatype()', 'vartype()'],
            correctAnswer: 1,
            explanation: 'type() function returns the type of a variable in Python.',
            difficulty: 'easy'
          }
        ]
      },
      'Operators': {
        name: 'Operators',
        questions: [
          {
            id: 'python-operators-1',
            question: 'Which operator is used for exponentiation in Python?',
            options: ['^', '**', 'pow', 'exp'],
            correctAnswer: 1,
            explanation: 'The ** operator is used for exponentiation in Python.',
            difficulty: 'easy'
          }
        ]
      },
      'Control Flow': {
        name: 'Control Flow',
        questions: [
          {
            id: 'python-control-1',
            question: 'Which keyword is used for conditional statements in Python?',
            options: ['if', 'when', 'condition', 'check'],
            correctAnswer: 0,
            explanation: 'The if keyword is used for conditional statements.',
            difficulty: 'easy'
          }
        ]
      },
      'Functions & Recursion': {
        name: 'Functions & Recursion',
        questions: [
          {
            id: 'python-functions-1',
            question: 'Which keyword is used to define a function in Python?',
            options: ['function', 'def', 'define', 'func'],
            correctAnswer: 1,
            explanation: 'The def keyword is used to define functions in Python.',
            difficulty: 'easy'
          }
        ]
      },
      'Lists': {
        name: 'Lists',
        questions: [
          {
            id: 'python-list-1',
            question: 'How do you create an empty list in Python?',
            options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
            correctAnswer: 0,
            explanation: 'Square brackets [] are used to create an empty list in Python.',
            difficulty: 'easy'
          },
          {
            id: 'python-list-2',
            question: 'Which method adds an element to the end of a list?',
            options: ['add()', 'append()', 'insert()', 'push()'],
            correctAnswer: 1,
            explanation: 'append() method adds an element to the end of a list.',
            difficulty: 'easy'
          }
        ]
      },
      'Tuples': {
        name: 'Tuples',
        questions: [
          {
            id: 'python-tuple-1',
            question: 'How do you create a tuple in Python?',
            options: ['tuple = []', 'tuple = ()', 'tuple = {}', 'tuple = ""'],
            correctAnswer: 1,
            explanation: 'Parentheses () are used to create tuples in Python.',
            difficulty: 'easy'
          }
        ]
      },
      'Strings': {
        name: 'Strings',
        questions: [
          {
            id: 'python-strings-1',
            question: 'Which method converts a string to lowercase?',
            options: ['toLower()', 'lowercase()', 'lower()', 'downcase()'],
            correctAnswer: 2,
            explanation: 'The lower() method converts a string to lowercase.',
            difficulty: 'easy'
          }
        ]
      },
      'Dictionaries': {
        name: 'Dictionaries',
        questions: [
          {
            id: 'python-dict-1',
            question: 'How do you create an empty dictionary in Python?',
            options: ['dict = []', 'dict = ()', 'dict = {}', 'dict = ""'],
            correctAnswer: 2,
            explanation: 'Curly braces {} are used to create an empty dictionary in Python.',
            difficulty: 'easy'
          },
          {
            id: 'python-dict-2',
            question: 'Which method returns all keys in a dictionary?',
            options: ['keys()', 'getKeys()', 'allKeys()', 'keyList()'],
            correctAnswer: 0,
            explanation: 'keys() method returns all keys in a dictionary.',
            difficulty: 'easy'
          }
        ]
      },
      'Sets': { name: 'Sets', questions: [] },
      'List Comprehensions': { name: 'List Comprehensions', questions: [] },
      'Classes & Objects': { name: 'Classes & Objects', questions: [] },
      'Inheritance': { name: 'Inheritance', questions: [] },
      'Polymorphism': { name: 'Polymorphism', questions: [] },
      'Encapsulation': { name: 'Encapsulation', questions: [] },
      'Exception Handling': { name: 'Exception Handling', questions: [] },
      'File Handling': { name: 'File Handling', questions: [] },
      'Modules & Packages': { name: 'Modules & Packages', questions: [] },
      'Iterators & Generators': { name: 'Iterators & Generators', questions: [] },
      'Decorators': { name: 'Decorators', questions: [] },
      'Lambda Functions': { name: 'Lambda Functions', questions: [] },
      'Regular Expressions': { name: 'Regular Expressions', questions: [] },
      'Python Libraries (NumPy, Pandas, Matplotlib)': { name: 'Python Libraries', questions: [] }
    }
  }
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    // Insert new categories
    for (const [key, categoryData] of Object.entries(quizData)) {
      const category = new Category({
        name: categoryData.name,
        key: categoryData.key,
        color: categoryData.color,
        icon: categoryData.icon,
        description: categoryData.description,
        subtopics: new Map(Object.entries(categoryData.subtopics))
      });
      
      await category.save();
      console.log(`Seeded category: ${categoryData.name}`);
    }
    
    console.log('Database seeding completed successfully!');
    
    // Display statistics
    const categories = await Category.find({});
    console.log('\n=== SEEDING STATISTICS ===');
    categories.forEach(category => {
      const totalQuestions = Array.from(category.subtopics.values())
        .reduce((total, subtopic) => total + subtopic.questions.length, 0);
      console.log(`${category.name}: ${category.subtopics.size} subtopics, ${totalQuestions} questions`);
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, quizData };
