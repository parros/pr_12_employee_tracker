const { employeeRoles } = require('./inquirer.js')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

async function addingEmployee() {
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
        if (answers.employeeRole === workRoles.rows[i].title) {
            if (answers.employeeManager === 'null') {
                await pool.query(`
                INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employeeFirstName}', '${answers.employeeLastName}', ${i + 1}, null)
                `)
            } else for (let x = 0; x < employees.rows.length; x++) {
                // Retrieves employee id for manager
                const result = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) FROM employee
                    WHERE id=${x + 1}
                    `)
                // Inserts inquired employee data into the employee table with the for loop helping convert the string answer for role to an integer
                if (answers.employeeManager === result.rows[0].concat) {
                    await pool.query(`
                    INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employeeFirstName}', '${answers.employeeLastName}', ${i + 1}, ${x + 1})
                    `)
                }
            }
        }
    }
    // Inserts inquired employee data into the employee table with the for loop helping convert the string answer for role to an integer
    console.log(`Added ${answers.employeeFirstName} ${answers.employeeLastName} to the database`)
}

module.exports = addingEmployee