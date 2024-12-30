# Employee Tracker Project

![License](https://img.shields.io/badge/license-MIT-blue.svg)

# Video Link

https://drive.google.com/file/d/15hQ02hoTboTHeTBCDgeNggHPgyLNonKm/view

## Description

The Employee Tracker Project is a command-line application built using Node.js, PostgreSQL, and the Inquirer package. This application allows business owners to view and manage their company's departments, roles, and employees through a simple and intuitive interface. It enables adding, updating, and retrieving information about employees, roles, and departments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/employee-tracker.git
   ```

2. Navigate to the project folder:

   ```bash
   cd employee-tracker
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Set up the PostgreSQL database:

   - Open the PostgreSQL terminal:
     ```bash
     psql -U postgres
     ```
   - Create the database:
     ```sql
     CREATE DATABASE employee_db;
     ```
   - Run the schema file to create tables:
     ```bash
     psql -U postgres -d employee_db -f schema.sql
     ```

5. Configure the database connection in `db/connection.js`.

6. Start the application:
   ```bash
   node index.js
   ```

## Usage

1. Run the application:

   ```bash
   node index.js
   ```

2. Follow the prompts to:
   - View all departments, roles, and employees.
   - Add new departments, roles, or employees.
   - Update an employee's role.

## License

This project is licensed under the MIT license.

## Contributing

Contributions are welcome! Feel free to submit a pull request or email me with your ideas.

## Tests

1. Run the application:

   ```bash
   node index.js
   ```

2. Test all functionalities:
   - Ensure you can view, add, and update records for departments, roles, and employees.

## Questions

If you have any questions, you can reach me at:

- GitHub: [yunusemreertas](https://github.com/yunusemreertas)
- Email: [yunus29emre@outlook.com](mailto:yunus29emre@outlook.com)
