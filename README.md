# Recipe Manager Application

## Overview
The Recipe Manager App is a web-based platform for managing, exploring, and sharing recipes. It allows users to create, edit, view, delete, and organize recipes with an intuitive and visually appealing interface.

## Features
- Create, view, edit, and delete recipes
- Search, filter, and sort recipes
- Share selected recipes via email

## Project Repository
[Recipe Manager GitHub Page](https://github.com/NijatHuseynzada/Recipe-Manager-App.git)

---

## Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/yourusername/recipe-manager.git
cd Recipe-Manager-App
```

### Install Dependencies
```bash
npm install
```

### Setup JSON-Server
2. Start JSON-Server:
```bash
npx json-server --watch db.json --port 3000
```
This will run the JSON-Server on `http://localhost:3000`.

---

## Running the Application

### Start the React App
Run the following command:
```bash
npm start
```
The app will be available at `http://localhost:5173` by default.

### Using the Application
1. Open your browser and navigate to `http://localhost:5173`.
2. Explore the application features, such as:
   - Adding new recipes
   - Editing existing recipes
   - Filtering and sorting recipes
   - Sharing recipes via email

### API Endpoints
- `http://localhost:3000/recipes` - Fetches all recipes
- `http://localhost:3000/messages` - Stores contact form submissions

---