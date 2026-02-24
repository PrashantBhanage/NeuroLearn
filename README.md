# NeuroLearn

NeuroLearn is a Java-based learning platform designed to deliver structured lessons, quizzes, and subject-wise content through a clean web interface. The system combines a Java backend with a responsive frontend to support interactive learning and performance tracking.

## Purpose

The project was built as a final-year BCA academic project to demonstrate:

* MVC-based Java web application architecture
* DAO pattern implementation
* Database integration
* Interactive UI with lessons and quizzes
* Real-world deployment-ready project structure

## Core Features

### Learning Module

* Subject-wise lesson navigation
* Structured lesson content display
* Single lesson view with navigation

### Quiz System

* Subject-based quizzes
* Question rendering from database
* Score evaluation logic

### Dashboard

* Central learning overview
* Navigation across subjects and modules

### Dark Mode

* Toggle-based UI theme
* Dedicated CSS + JS implementation

### Backend Architecture

* Java Controllers (MVC pattern)
* DAO layer for database operations
* Model classes for domain entities
* Utility classes for DB connection and static file handling

## Tech Stack

**Backend**

* Java
* Servlet-based architecture
* DAO pattern

**Frontend**

* HTML
* CSS
* JavaScript

**Database**

* Relational DB (via JDBC)

## Project Structure

```
NeuroLearn/
│
├── src/
│   ├── controller/
│   ├── dao/
│   ├── model/
│   ├── util/
│   └── MainServer.java
│
├── web/
│   ├── css/
│   ├── js/
│   ├── lesson/
│   ├── quiz/
│   ├── subjects/
│   └── index.html
│
└── README.md
```

## How to Run

1. Clone repository

```
git clone https://github.com/PrashantBhanage/NeuroLearn.git
```

2. Open project in IDE (IntelliJ / Eclipse)

3. Configure:

* Database connection in `DBConnection.java`
* Server (Tomcat/Jetty)

4. Run MainServer

5. Open in browser:

```
http://localhost:8080
```

## Key Learning Outcomes

* Implemented MVC architecture in a real project
* Designed DAO-based data access
* Built quiz and lesson delivery modules
* Practiced Git workflow and version control
* Developed responsive UI with theme support

## Future Improvements

* User authentication system
* Progress tracking
* Admin panel
* Performance analytics
* Deployment on cloud (AWS / Render)

## Author

**Prashant Bhanage**
Final Year BCA Student
GitHub: https://github.com/PrashantBhanage
