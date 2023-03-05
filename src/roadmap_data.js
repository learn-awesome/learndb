export const roadmap_data = {
    start: {label: "Computer and Internet Basics"},
    blocks: [
        {	
            label: "Learn Golang Basics", 					
            group1: [
                {
                    label: "Basic Syntax", 
                    desc: `
# Basic Syntax

Learn about the basic syntax of Go, such as how the go programs are executed, package imports, main function, and so on. Visit the resources listed below

### Resources:
- READ: [Go Tutorial: Getting started](https://go.dev/doc/tutorial/getting-started)
- READ: [Go by Example: Hello World](https://gobyexample.com/hello-world)
- READ: [W3schools : Go Syntax](https://www.w3schools.com/go/go_syntax.php)
                    `
                },
                {
                    label: "Variables and declaration",
                    desc: `
# Variables in Go

Variable is the name given to a memory location to store a value of a specific [type](https://golangbot.com/types/). Go provides multiple ways to declare and use variables.

### Resources:
- READ: [Go Variables](https://go.dev/tour/basics/8)
- READ: [Go by Example: Variables](https://gobyexample.com/variables)
- READ: [w3schools Go variables](https://www.w3schools.com/go/go_variables.php)
                    `
                },
                {
                    label: "Data types",
                    desc: `
# Data Types

Go is a statically typed programming language, which means each variable has a type defined at first and can only hold values with that type. There are two categories of types in Go: basics types and composite types.

To learn more about types in Go, visit these resources :

### Resources:
- READ: [Basic data types](https://www.w3schools.com/go/go_data_types.php)
- READ: [Tour of Go: types](https://go.dev/tour/basics/11)
- READ: [Go types with examples](https://golangbyexample.com/all-data-types-in-golang-with-examples/)
                    `
                },
            ],
            group2: [
                {
                    label: "Conditional statements: if, switch",
                    desc: `
# Conditional Statements

Conditional statements are used to run code only if a certain condition is true; go supports :

- \`if\` statements
- \`if / else\` statements
- \`switch\` \`case\` statements

### Resources:
- READ: [Effective Go: if statement](https://go.dev/doc/effective_go#if)
- READ: [Basic conditional patterns](https://yourbasic.org/golang/if-else-statement/)
- READ: [Go by Example: If-Else](https://gobyexample.com/if-else)
- READ: [Golang programs if else](https://www.golangprograms.com/golang-if-else-statements.html)
- READ: [Golang programs switch case](https://www.golangprograms.com/golang-switch-case-statements.html)
                    `
                },
                {
                    label: "Looping: for, range",
                    desc: `
# For Loop

Go has only one looping construct, the \`for\` loop. The basic \`for\` loop has three components separated by semicolons:

- the init statement: executed before the first iteration
- the condition expression: evaluated before every iteration
- the post statement: executed at the end of every iteration

### Resources:
- READ: [For Loop in Golang](https://go.dev/tour/flowcontrol/1)
- READ: [Effective Go: For loop](https://go.dev/doc/effective_go#for)
- READ: [Go by Example: For loop](https://gobyexample.com/for)
- READ: [5 basic for loop patterns](https://yourbasic.org/golang/for-loop/)

# Range

\`Range\` is used with \`For Loops\` to iterate over each element in arrays, strings and other data structures .

### Resources:
- READ: [Go Ranges](https://go.dev/tour/moretypes/16)
- READ: [Go by Example: Range](https://gobyexample.com/range)
- READ: [Go ranges basic patterns](https://yourbasic.org/golang/for-loop-range-array-slice-map-channel/)
                    `
                },
                {
                    label: "Errors, Panic, Recover",
                    desc: `
# Errors/Panic/Recover

In lieu of adding exception handlers, the Go creators exploited Go’s ability to return multiple values. The most commonly used Go technique for issuing errors is to return the error as the last value in a return.

A panic typically means something went unexpectedly wrong. Mostly used to fail fast on errors that shouldn’t occur during normal operation, or that we aren’t prepared to handle gracefully.

Panic recovery in Go depends on a feature of the language called deferred functions. Go has the ability to guarantee the execution of a function at the moment its parent function returns. This happens regardless of whether the reason for the parent function’s return is a return statement, the end of the function block, or a panic.

### Resources:
- READ: [Error handling and Go](https://go.dev/blog/error-handling-and-go)
- READ: [Go Defer, Panic and Recover](https://go.dev/blog/defer-panic-and-recover)
- READ: [Effective error handling in Go](https://earthly.dev/blog/golang-errors/)
                    `
                },
            ],
            group3: [
                {
                    label: "Functions, multiple/named returns",
                    desc: `
# Functions

Discover how functions work in Go, the list of resources below will cover :

- How to define and call functions in Go?
- Named returns in Go?
- Handle multiple return types.
- Different types of functions in Go.

### Resources:
- READ: [Go by Example: Functions](https://gobyexample.com/functions)
- READ: [Functions in go](https://www.golangprograms.com/go-language/functions.html)

                    `
                },
                {
                    label: "Packages, imports and exports",
                    desc: `
# Packages

Packages are the most powerful part of the Go language. The purpose of a package is to design and maintain a large number of programs by grouping related features together into single units so that they can be easy to maintain and understand and independent of the other package programs. This modularity allows them to share and reuse. In Go language, every package is defined with a different name and that name is close to their functionality like “strings” package and it contains methods and functions that only related to strings.

### Resources:
- READ: [How to create a package in Go](https://www.golang-book.com/books/intro/11)
- READ: [How to manage external dependencies in Go](https://go.dev/doc/modules/managing-dependencies)
- EXPLORE: [Go Packages explorer](https://pkg.go.dev/)
- Official Website: [Standard library](https://pkg.go.dev/std)
- READ: [Packages in Golang](https://www.geeksforgeeks.org/packages-in-golang/)
- READ: [Go Packages](https://www.programiz.com/golang/packages)

                    `
                },
                {
                    label: "Type casting, Type inference",
                    desc: `
# Type Casting

Go doesn't support automatic type conversion, but it allows type casting, which is the process of explicitly changing the variable type. To learn more about typecasting, visit these resources :

### Resources:
- READ: [Geeks for Geeks: Type casting](https://www.geeksforgeeks.org/type-casting-or-type-conversion-in-golang/)
- READ: [Tour of Go: Type Casting Basics](https://go.dev/tour/basics/13)
- READ: [Go Docs: Type Casting](https://golangdocs.com/type-casting-in-golang)

# Type Inference

Type inference gives go the capability to detect the type of a value without being explicitly indicated , hence the possibility to declare variables without providing its type at first 

### Resources:
- READ: [Go Variables: Type Inference](https://www.callicoder.com/golang-variables-zero-values-type-inference/#type-inference)
- READ: [Tour of Go: Type Inference](https://go.dev/tour/basics/14)
                    `
                },
                {
                    label: "Arrays, Slices, Maps",
                    desc: `
# Arrays

In Go an \`array\` is a collection of elements of the same type with a **fixed** size defined when the array is created.

### Resources:
- Official Website: [Go Arrays](https://go.dev/tour/moretypes/6)
- READ: [Effective Go: Arrays](https://go.dev/doc/effective_go#arrays)
- WATCH: [Learn Go Programming - Arrays (by freeCodeCamp on YouTube)](https://youtu.be/YS4e4q9oBaU?t=6473)

# Slices

Slices are similar to arrays but are more powerful and flexible. Like arrays, slices are also used to store multiple values of the same type in a single variable. However, unlike arrays, the length of a slice can grow and shrink as you see fit.

### Resources:

- Official Website: [Go Slices](https://go.dev/tour/moretypes/7)
- READ: [Effective Go: Slices](https://go.dev/doc/effective_go#slices)
- READ: [Slices in Go](https://www.w3schools.com/go/go_slices.php)
- WATCH: [Learn Go Programming - Slices (by freeCodeCamp on YouTube)](https://youtu.be/YS4e4q9oBaU?t=6473)

# Maps

Maps are the data structure in Go, where we use whenever we want to have mappings between key:value pairs. They have flexibility in terms of removing or adding elements into them. Maps do not allow duplicate entries while data are kept unordered.

### Resources:

- Official Website: [Go Maps](https://go.dev/tour/moretypes/19)
- READ: [Effective Go: Maps](https://go.dev/doc/effective_go#maps)
- READ: [Maps in Go](https://www.w3schools.com/go/go_maps.php)
- WATCH: [Golang Tutorial #15 - Maps (by Tech With Tim on YouTube)](https://www.youtube.com/watch?v=yJE2RC37BF4)
                    `
                },
                {
                    label: "make(), structs",
                    desc: `
# Make

Golang's built-in function make, helps us create and initialize slices, maps and channels, depending on the arguments that are provided to the function.

### Resources: 
- READ: [Effective Go: Allocation with make](https://go.dev/doc/effective_go#allocation_make)
- READ: [Create a slice with make](https://www.golangprograms.com/how-to-create-slice-using-make-function-in-golang.html)
- READ: [Create a map with make](https://www.golangprograms.com/golang-package-examples/how-to-create-map-using-the-make-function-in-go.html)
- READ: [Create a channel with make](https://www.programiz.com/golang/channel#channel)

# Structs

Structs are user-defined types that help us create a collection of data describing a single entity.

### Resources: 
- Official Website: [Go Structs](https://go.dev/tour/moretypes/2)
- READ: [Go by Example: Structs](https://gobyexample.com/structs)
- WATCH: [Structs in Go](https://www.youtube.com/watch?v=NMTN543WVQY)
                    `
                },
            ]
        },
        
    
        
        {
            label: "Go Deeper", 
            group1: [
                {
                    label: "Go Modules",
                    desc: `
# Modules

Go modules are a group of related packages that are versioned and distributed together. They specify the requirements of our project, list all the required dependencies, and help us keep track of the specific versions of installed dependencies.  

Modules are identified by a module path that is declared in the first line of the go.mod file in our project.  

### Resources:
- Official Website: [Go Modules](https://go.dev/blog/using-go-modules)
- WATCH: [Go Modules](https://www.youtube.com/watch?v=9cV1KESTJRc)
- READ: [DigitalOcean: How to use Go Modules](https://www.digitalocean.com/community/tutorials/how-to-use-go-modules)
- WATCH: [Go Modules Explained in 5 Minutes (by Golang Dojo on YouTube)](https://youtu.be/7xSxIwWJ9R4)
- READ: [How to create a module in Go](https://go.dev/doc/tutorial/create-module)
- READ: [How to use modules in Go](https://go.dev/blog/using-go-modules)
- READ: [How to modify existing projects to use Go modules](https://jfrog.com/blog/converting-projects-for-go-modules/)
                    `
                },
                {
                    label: "Marshalling and unmarshalling JSON",
                    desc: `
# Working with json

JSON (JavaScript Object Notation) is a simple data interchange format. Syntactically it resembles the objects and lists of JavaScript. It is most commonly used for communication between web back-ends and JavaScript programs running in the browser, but it is used in many other places, too.

### Resources:
- Official Website: [JSON](https://go.dev/blog/json)
- READ: [Guide to JSON in Golang](https://www.sohamkamani.com/golang/json/)
- READ: [JSON to GO](https://mholt.github.io/json-to-go/)
                    `
                },
            ],
            group2: [
                {
                    label: "Types, type assertions, switches",
                    desc: `
# Types and type assertions

Type assertions in Golang provide access to the exact type of variable of an interface.

### Resources:
- Official Website: [Types Assertions](https://go.dev/tour/methods/15)
- READ: [Type Assertion](https://www.geeksforgeeks.org/type-assertions-in-golang/)

                    `
                },
                {
                    label: "Interfaces, context",
                    desc: `
# Interfaces

An interface in Go, is a type that defines a set of methods. If we have a type (e.g. struct) that implements that set of methods, then we have a type that implements this interface.

### Resources:

- Official Website: [Go Interfaces](https://go.dev/tour/methods/9)
- READ: [Effective Go: Interfaces](https://go.dev/doc/effective_go#interfaces)
- READ: [Go by Example: Interfaces](https://gobyexample.com/interfaces)
- WATCH: [Golang Tutorial #22 - Interfaces (by Tech With Tim on YouTube)](https://www.youtube.com/watch?v=lh_Uv2imp14)
- WATCH: [Learn Go Interfaces](https://www.youtube.com/watch?v=KB3ysH8cupY)
- WATCH: [Understanding Go Interfaces](https://www.youtube.com/watch?v=qJKQZKGZgf0)

# Context

The \`context\` package provides a standard way to solve the problem of managing the state during a request. The package satisfies the need for request-scoped data and provides a standardized way to handle: Deadlines, Cancellation Signals, etc.

### Resources:
- Official Website: [Go Context](https://pkg.go.dev/context)
- READ: [Go by Example: Context](https://gobyexample.com/context)
- READ: [Digital Ocean: How to Use Contexts in Go](https://www.digitalocean.com/community/tutorials/how-to-use-contexts-in-go)
- WATCH: [Context in Go](https://www.youtube.com/watch?v=LSzR0VEraWw)
- WATCH: [Understanding Contexts in Go](https://youtu.be/h2RdcrMLQAo)

                    `
                },
            ],
            group3: [
                {
                    label: "Goroutines, channels",
                    desc: `
# Goroutines  

Goroutines allow us to write concurrent programs in Go. Things like web servers handling thousands of requests or a website rendering new pages while also concurrently making network requests are a few example of concurrency.  

In Go, each of these concurrent tasks are called \`Goroutines\`.  

### Resources:
- Official Website: [Goroutines](https://go.dev/tour/concurrency/1)
- READ: [Effective Go: Goroutines](https://go.dev/doc/effective_go#goroutines)
- READ: [Goroutines in Golang](https://www.geeksforgeeks.org/goroutines-concurrency-in-golang)
- WATCH: [GoRoutines](https://www.youtube.com/watch?v=LvgVSSpwND8)
- WATCH: [Understanding Concurrency](https://www.youtube.com/watch?v=V-0ifUKCkBI)
- READ: [Go by Example: Goroutines](https://gobyexample.com/goroutines)
- WATCH: [Golang Goroutine Basics You MUST Learn! (by Golang Dojo on YouTube)](https://youtu.be/oHIbeTmmTaA)

# Channels

Channels are the pipes that connect concurrent goroutines. You can send values into channels from one goroutine and receive those values into another goroutine.

Channels are a typed conduit through which you can send and receive values with the channel operator, \`<-\` .

### Resources:
- Official Website: [Channels](https://go.dev/tour/concurrency/2)
- READ: [Effective Go: Channels](https://go.dev/doc/effective_go#channels)
- READ: [Go by Example: Channels](https://gobyexample.com/channels)
- READ: [Channels in Golang](https://golangbot.com/channels/)
- WATCH: [Channels](https://www.youtube.com/watch?v=e4bu9g-bYtg)
- READ: [GeeksForGeeks: Channel in Golang](https://www.geeksforgeeks.org/channel-in-golang/)
- WATCH: [Golang Channel Basics You must Know!](https://youtu.be/LgCmPHqAuf4)

                    `
                },
                {
                    label: "Buffer, Select",
                    desc: `
# Buffer

The \`buffer\` belongs to the byte package of the Go language, and we can use these package to manipulate the byte of the string.  

### Resources:
- Official Website: [Buffer Examples](https://pkg.go.dev/bytes#example-Buffer)
- READ: [Buffer](https://www.educba.com/golang-buffer/)
- WATCH: [Buffers in Golang](https://www.youtube.com/watch?v=NoDRq6Twkts)

# Select

The \`select\` statement lets a goroutine wait on multiple communication operations.

A \`select\` blocks until one of its cases can run, then it executes that case. It chooses one at random if multiple are ready. The \`select\` statement is just like switch statement, but in the select statement, case statement refers to communication, i.e. sent or receive operation on the channel.

### Resources:
- Official Website: [Select](https://go.dev/tour/concurrency/5)
- READ: [Go by Example: Select](https://gobyexample.com/select)
- READ: [Select in Golang](https://www.geeksforgeeks.org/select-statement-in-go-language/)
- WATCH: [Select Statement](https://www.youtube.com/watch?v=1c7ttSJDMAI)

                    `
                },
                {
                    label: "Mutex",
                    desc: `
# Mutex

Go allows us to run code concurrently using goroutines. However, when concurrent processes access the same piece of data, it can lead to [race conditions](https://www.sohamkamani.com/golang/data-races/). Mutexes are data structures provided by the [sync](https://pkg.go.dev/sync/) package. They can help us place a lock on different sections of data so that only one goroutine can access it at a time.

- READ: [Using a Mutex in Go with Examples](https://www.sohamkamani.com/golang/mutex/)

                    `
                },
            ]
        },

        {
            label: "Applications",
            group1: [
                {
                    label: "Logging",
                    desc: `
# Logging

Go has built-in features to make it easier for programmers to implement logging. Third parties have also built additional tools to make logging easier.

### Resources:
- READ: [Logging in Go: Choosing a System and Using it](https://www.honeybadger.io/blog/golang-logging/)
- READ: [Logging in Golang – How to Start](https://www.loggly.com/use-cases/logging-in-golang-how-to-start/)
                    `
                },
                {
                    label: "Building CLIs",
                    desc: `
# Building CLI Applications

Command line interfaces (CLIs), unlike graphical user interfaces (GUIs), are text-only. Cloud and infrastructure applications are primarily CLI-based due to their easy automation and remote capabilities.

Go applications are built into a single self contained binary making installing Go applications trivial; specifically, programs written in Go run on any system without requiring any existing libraries, runtimes, or dependencies. And programs written in Go have an immediate startup time—similar to C or C++ but unobtainable with other programming languages.

### Resources:
- READ: [Command-line Interfaces (CLIs)](https://go.dev/solutions/clis)
                    `
                },
            ],
            group2: [
                {
                    label: "ORMs",
                    desc: `
# ORMs

Object–relational mapping (ORM, O/RM, and O/R mapping tool) in computer science is a programming technique for converting data between type systems using object-oriented programming languages. This creates, in effect, a "virtual object database", hence a layer of abstraction, that can be used from within the programming language.

Most common ORM library in Go is [GORM](https://gorm.io/).
                    `
                },
                {
                    label: "Web frameworks",
                    desc: `
# Web Frameworks

There are several famous web frameworks for Go. Most common ones being:

* Beego
* Gin
* Revel
* Echo

### Resources:
- READ: [Comparison of Web Frameworks](https://github.com/diyan/go-web-framework-comparison)

                    `
                },
            ],
            group3: [
                {
                    label: "Real time communication",
                    desc: `
# Real time communication

Work in progress.
                    `
                },
                {
                    label: "API Clients",
                    desc: `
# API Clients

An API client is a set of tools and protocols that operate from an application on a computer. They help you to bypass some operations when developing a web application rather than reinventing the wheel every time. Using a client API is a great way to speed up the development process.

### Resources:
- READ: [API Clients](https://rapidapi.com/blog/api-glossary/client/)

                    `
                },
                {
                    label: "Tools for Microservices",
                    desc: `
# Microservices

Microservices are an architectural approach to software development that allows the creation of a distributed application from deployable services that allow communication through a well-defined API. Being a solution to monoliths.

### Resources:

- READ: [Introduction to microservices](https://developer.ibm.com/learningpaths/get-started-application-modernization/intro-microservices/introduction/)
- READ: [Microservice Patterns and Resources by Chris Richardson](https://microservices.io/index.html)
- READ: [Microservices AntiPatterns and Pitfalls - Mark Richards](https://www.oreilly.com/content/microservices-antipatterns-and-pitfalls/)
- READ: [Building Microservices, 2nd Edition - Sam Newman](https://samnewman.io/books/building_microservices_2nd_edition/)

                    `
                },
            ]
        },
    ],
    edges: [
        {path: "M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z", style: "primary"},
        {path: "M 10,10 L 90,90 V 10 H 50", style: "secondary"},
    ],
    end: {label: "Now go make cool things with Golang!"}
}