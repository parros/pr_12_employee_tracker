const inquirer = require('inquirer')
const { Pool } = require('pg')
const { addDepartment } = require('./utils/inquirer.js')
const addingEmployee = require('./utils/employee.js')
const updatingEmployee = require('./utils/update.js')
const addingRole = require('./utils/role.js')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

async function answerPicked(answer) {
    if (answer === 'View All Employees') {
        // Shows employee data
        const result = await pool.query(`
        SELECT e.id, e.firstName, e.LastName, title, department.name AS department, salary, CONCAT(m.firstName, ' ', m.lastName) AS manager FROM employee AS e
        LEFT JOIN employee AS m ON e.managerId=m.id
        JOIN role ON e.roleId=role.id 
        JOIN department ON role.departmentId=department.id
        `)
        console.table(result.rows)
    } else if (answer === 'Add Employee') {
        await addingEmployee()
    } else if (answer === 'Update Employee Role') {
        await updatingEmployee()
    } else if (answer === 'View All Roles') {
        // Shows role data
        const result = await pool.query('SELECT * FROM role')
        console.table(result.rows)
    } else if (answer === 'Add Role') {
        await addingRole()
    } else if (answer === 'View All Departments') {
        // Shows department data
        const result = await pool.query('SELECT * FROM department')
        console.table(result.rows)
    } else if (answer === 'Add Department') {
        // Inserts inquired department data into the department table 
        const answers = await addDepartment()
        await pool.query(`
            INSERT INTO department(name) 
            VALUES ('${answers.departmentName}')
            `)
        console.log(`Added ${answers.departmentName} to the database`)
    } else if (answer === 'Quit') {
        process.exit(0)
    }
    // Loops back to What would you like to do menu after finishing each option except quit
    askQuestion()
}

// Opening menu options for user to choose from
function askQuestion() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'pickWhatToDo',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
            }
        ]).then((answers) => {
            const answer = answers.pickWhatToDo
            answerPicked(answer)
        })
}

askQuestion()