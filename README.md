# MERN Stack Admin Dashboard - Task Distribution System

This is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It serves as an Admin Dashboard where an administrator can authenticate, manage agents, and upload CSV/Excel files containing task lists. The system automatically validates the uploaded files and distributes the tasks equally among the registered agents.


## Setup & Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <your-project-folder>
cd backend
npm install && npm run dev
cd frontend
npm install && npm run dev
```
### 2. Usage Instructions

* Register: Open the app and navigate to the Registration page. Create a new account.
* Login: You will be redirected to the dashboard.
* Add Agents: Use the "Create New Agent" form to add agents to the system.
* Upload List: Create a sample .csv or .xlsx file with the exact headers: FirstName, Phone, and Notes.
* Use the "Upload Task List" section to select and upload the file.
* The system will process the file, distribute the tasks equally, and display a summary of the distribution math on the screen.

## Tech Stack

**Frontend:**
* React.js (via Vite)
* TypeScript
* Tailwind CSS
* React Router DOM

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Token (JWT) & bcrypt (Authentication)
* Multer (File handling)
* XLSX / SheetJS (File parsing)

## Features

* **Admin Authentication:** Secure registration and login using JSON Web Tokens (JWT) and bcrypt password hashing.
* **Agent Management:** Accounts for agents (Name, Email, Mobile with country code, Password).
* **File Upload & Parsing:** Supports uploading `.csv`, `.xlsx`, and `.xls` files. Parses the data securely in memory without saving to the disk.
* **Strict Data Validation:** Validates file extensions and internal data structure (ensuring `FirstName`, `Phone`, and `Notes` columns exist and are formatted correctly).
* **Algorithmic Distribution:** Uses a round-robin algorithm to distribute uploaded tasks equally among all registered agents. Remaining items are distributed sequentially.







