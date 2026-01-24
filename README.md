NeuroLearn – Learning Platform with Lessons and Quizzes
Project Overview

NeuroLearn is a web-based learning platform designed to help primary-level students understand basic subjects through short lessons and interactive quizzes.

The system focuses on:

Simple explanations

One concept at a time

Immediate feedback through quizzes

The project is implemented using Java HTTP Server for backend APIs and HTML, CSS, and JavaScript for the frontend.

Target Audience

This project is intended for:

Children at a beginner learning level

Parents or teachers assisting early education

Students learning full-stack development using core technologies

Learning Flow

The user starts at the dashboard and selects a subject.

Each subject contains multiple lessons.

Each lesson explains a single concept in simple language.

After the lesson, the user attempts a quiz.

The quiz shows one question at a time.

Immediate feedback is provided:

Correct answer is highlighted

Incorrect answer is marked

The user proceeds to the next question.

This approach helps learners understand concepts step by step.

Subjects Included

Maths

Science

English

Art

Reading

Geography

Each subject contains multiple lessons and quizzes.

Quiz Design

One question is displayed at a time

Options are shown clearly

The user must answer before moving forward

Feedback is instant

This design avoids confusion and encourages understanding.

Technology Stack
Frontend

HTML

CSS

JavaScript (Vanilla)

Backend

Java

HttpServer (com.sun.net.httpserver)

Database

MySQL

Database Structure

The database contains:

Subjects

Lessons

Quiz questions

Admin (for future use)

Each quiz question stores:

Question text

Four options

Correct answer

Project Environment
Requirements

Java JDK 8 or above

MySQL Server

Any Java IDE

Modern web browser

How to Run the Project

Import or clone the project.

Create a MySQL database named neurolearn.

Execute the provided SQL script to create tables and insert data.

Update database credentials in the Java database utility file.

Run MainServer.java.

Open the browser and go to:

http://localhost:8015

Application Structure

/web – frontend files

/controller – Java API controllers

/dao – database access logic

/model – data models

Conclusion

NeuroLearn is a simple educational platform that combines lessons and quizzes to support basic learning.
The project demonstrates how a frontend and backend can work together using core technologies without external frameworks.
