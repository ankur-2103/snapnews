# Social media app using React + TypeScript + GraphQL

![Project Image/Logo](./src/assets/spannews-logo.svg) 



## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Introduction

This is a social media project built with React, TypeScript, GraphQL and Supabase. It serves as a basic template for creating a social media application where users can post, like and save posts. Supabase is used as the backend for handling authentication, data base and storage.


## Features

- User registration and authentication with Supabase.
- Create, and delete posts.
- Like and save on posts.
- Supabase's file storage features.
- Responsive design for mobile and desktop.

## Live Demo

Check out the live demo of this project [here](https://65364b4742df06276c1576c1--remarkable-taffy-0055bd.netlify.app/).

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your development environment.
- Supabase account with the necessary configuration.

### Installation

   1. Clone the repository :

      ```bash
      git clone https://github.com/ankur-2103/snapnews.git
      ```

   2. Change to the project directory :

      ```bash
      cd react-ts-supabase-social-media
      ```

   3. Install the project dependencies :
      ```bash
      npm install
      ```

## Configuration

Before running the project, you need to configure the environment variables for Supabase. Create a `.env` file in the project root and add the following variables:

```bash
VITE_DB_URI="https://your-supabase-project-id.supabase.co/graphql/v1"
VITE_BASE_URI="https://your-supabase-project-id.supabase.co"
VITE_TOKEN="your-supabase-project-token"
```

Replace your-supabase-project-id and your-supabase-project-token with your Supabase project's ID and TOKEN key.

## Usage
To run the project, use the following command :

```bash
npm run dev
```

This will start the development server. Open your browser and visit http://localhost:5173 to view the application.

Check out the demo usage of this project [here](https://drive.google.com/file/d/1bRscpUy-DTFzvOOj_rAlO9uVGDIty7bC/view?usp=sharing).