const inquirer = require('inquirer')
const { Pool } = require('pg')
const {employeeRoles, addRole, addDepartment, updateEmployee } = require('./utils/inquirer.js')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

// 
async function answerPicked(answer) {
    if (answer === 'View All Employees') {
        // Shows employee data
        const result = await pool.query(`
        SELECT e.id, e.first_name, e.last_name, title, department.name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e
        LEFT JOIN employee AS m ON e.manager_id=m.id
        JOIN role ON e.role_id=role.id 
        JOIN department ON role.department_id=department.id
        `)
        console.table(result.rows)
    } else if (answer === 'Add Employee') {
        // Creates an array of the most current roles for employees
        const workRoles = await pool.query('SELECT title FROM role')
        let roles = []
        for (let i = 0; i < workRoles.rows.length; i++) {
            roles.push(workRoles.rows[i].title)
        }
        // Creates an array of the most current employees
        const employees = await pool.query(`SELECT CONCAT(first_name, ' ', last_name)  FROM employee`)
        let managers = ['null']
        for (let i = 0; i < employees.rows.length; i++) {
            managers.push(employees.rows[i].concat)
        }
        const answers = await employeeRoles(roles, managers)
                for (let i = 0; i < workRoles.rows.length; i++) {
                    if (answers.employee_role === workRoles.rows[i].title) {
                        if (answers.employee_manager === 'null'){ 
                                    await pool.query(`
                                    INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employee_first_name}', '${answers.employee_last_name}', ${i + 1}, null)
                                    `)
                        } else for (let x = 0; x < employees.rows.length; x++) {
                            // Retrieves employee id for manager
                            const result = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) FROM employee
                            WHERE id=${x+1}
                            `)
                            console.log(result.rows)
                            // Inserts inquired employee data into the employee table with the for loop helping convert the string answer for role to an integer
                            if (answers.employee_manager === result.rows[0].concat){
                            await pool.query(`
                            INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employee_first_name}', '${answers.employee_last_name}', ${i + 1}, ${x+1})
                            `)
                            }
                        }
                    }
                }
        // Inserts inquired employee data into the employee table with the for loop helping convert the string answer for role to an integer
        console.log(`Added ${answers.employee_first_name} ${answers.employee_last_name} to the database`)
    } else if (answer === 'Update Employee Role') {
        // Creates an array of the most current employee names with both first and last names
        const employeeNames = await pool.query('SELECT first_name, last_name FROM employee')
        let names = []
        for (let i = 0; i < employeeNames.rows.length; i++) {
            names.push(`${employeeNames.rows[i].first_name} ${employeeNames.rows[i].last_name}`)
        }
        // Creates an array of the most current roles for employees
        const workRoles = await pool.query('SELECT title FROM role')
        let roles = []
        for (let i = 0; i < workRoles.rows.length; i++) {
            roles.push(workRoles.rows[i].title)
        }
        const answers = await updateEmployee(names, roles)
        // First for loop helps convert the string answer for role to an integer
        for (let i = 0; i < workRoles.rows.length; i++) {
            if (workRoles.rows[i].title === answers.employee_role) {
                // Second for loop helps check combined first and last name to the correct first name only
                for (let x = 0; x < employeeNames.rows.length; x++) {
                    if (`${employeeNames.rows[x].first_name} ${employeeNames.rows[x].last_name}` === answers.employee_name) {
                        await pool.query(`
                        UPDATE employee SET role_id = ${i + 1} WHERE first_name = '${employeeNames.rows[x].first_name}'
                    `)
                    }
                }
            }
        }
        console.log(`Updated ${answers.employee_name} to the database`)
    } else if (answer === 'View All Roles') {
        // Shows role data
        const result = await pool.query('SELECT * FROM role')
        console.table(result.rows)
    } else if (answer === 'Add Role') {
        // Creates an array of the most current departments
        const departments = await pool.query('SELECT name FROM department')
        let departmentNames = []
        for (let i = 0; i < departments.rows.length; i++) {
            departmentNames.push(departments.rows[i].name)
        }

        const answers = await addRole(departmentNames)
        // Inserts inquired role data into the role table
        for (let i = 0; i < departments.rows.length; i++) {
            if (departments.rows[i].name === answers.role_department) {
                await pool.query(`
                INSERT INTO role(title, salary, department_id) 
                VALUES ('${answers.role_name}', '${answers.role_salary}', ${i + 1})
                `)
            }
        }
        console.log(`Added ${answers.role_name} to the database`)
    } else if (answer === 'View All Departments') {
        const result = await pool.query('SELECT * FROM department')
        console.table(result.rows)
    } else if (answer === 'Add Department') {
        const answers = await addDepartment()
        await pool.query(`
            INSERT INTO department(name) 
            VALUES ('${answers.department_name}')
            `)
        console.log(`Added ${answers.department_name} to the database`)
    } else if (answer === 'Quit') {
        process.exit(0)
    }
    askQuestion()
}

// 
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