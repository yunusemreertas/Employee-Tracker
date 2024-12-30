import inquirer from 'inquirer';
import pool from './db/connection.js'; // PostgreSQL connection

// Main menu function
const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role',
          'Exit',
        ],
      },
    ])
    .then((response) => {
      switch (response.action) {
        case 'View All Departments':
          viewDepartments();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        default:
          pool.end();
          console.log('Goodbye!');
      }
    });
};

// Function to view all departments
const viewDepartments = () => {
  pool.query('SELECT * FROM department', (err, res) => {
    if (err) {
      console.error('Error fetching departments:', err);
    } else {
      console.table(res.rows);
    }
    mainMenu(); // Return to the main menu
  });
};

// Function to view all roles
const viewRoles = () => {
  const query = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id;
  `;
  pool.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching roles:', err);
    } else {
      console.table(res.rows);
    }
    mainMenu(); // Return to the main menu
  });
};

// Function to view all employees
const viewEmployees = () => {
  const query = `
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title AS job_title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
  `;
  pool.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching employees:', err);
    } else {
      console.table(res.rows);
    }
    mainMenu(); // Return to the main menu
  });
};

// Function to add a new department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES ($1)';
      pool.query(query, [answer.departmentName], (err, res) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log(`Department '${answer.departmentName}' added successfully!`);
        }
        mainMenu(); // Return to the main menu
      });
    });
};

// Function to add a new role
const addRole = () => {
  pool.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    const departments = res.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleTitle',
          message: 'Enter the title of the new role:',
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'Enter the salary for the new role:',
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department for this role:',
          choices: departments,
        },
      ])
      .then((answers) => {
        const query =
          'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
        const values = [answers.roleTitle, answers.roleSalary, answers.departmentId];
        pool.query(query, values, (err, res) => {
          if (err) {
            console.error('Error adding role:', err);
          } else {
            console.log(`Role '${answers.roleTitle}' added successfully!`);
          }
          mainMenu(); // Return to the main menu
        });
      });
  });
};

// Function to add a new employee
const addEmployee = () => {
  pool.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;

    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    pool.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;

      const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      managerChoices.unshift({ name: 'None', value: null }); // Add "None" option for no manager

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
          },
          {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
          },
          {
            type: 'list',
            name: 'roleId',
            message: "Select the employee's role:",
            choices: roleChoices,
          },
          {
            type: 'list',
            name: 'managerId',
            message: "Select the employee's manager:",
            choices: managerChoices,
          },
        ])
        .then((answers) => {
          const query =
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
          const values = [
            answers.firstName,
            answers.lastName,
            answers.roleId,
            answers.managerId,
          ];
          pool.query(query, values, (err, res) => {
            if (err) {
              console.error('Error adding employee:', err);
            } else {
              console.log(
                `Employee '${answers.firstName} ${answers.lastName}' added successfully!`
              );
            }
            mainMenu();
          });
        });
    });
  });
};

// Function to update an employee's role
const updateEmployeeRole = () => {
  pool.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    pool.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;

      const roleChoices = roles.rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: "Select the employee whose role you want to update:",
            choices: employeeChoices,
          },
          {
            type: 'list',
            name: 'roleId',
            message: "Select the new role for the employee:",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
          const values = [answers.roleId, answers.employeeId];

          pool.query(query, values, (err, res) => {
            if (err) {
              console.error('Error updating employee role:', err);
            } else {
              console.log("Employee's role updated successfully!");
            }
            mainMenu(); // Return to the main menu
          });
        });
    });
  });
};

// Start the application
mainMenu();
