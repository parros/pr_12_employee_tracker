const { updateEmployee } = require('./inquirer.js')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

async function updatingEmployee() {
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
        if (workRoles.rows[i].title === answers.employeeRole) {
            // Second for loop helps check combined first and last name to the correct first name only
            for (let x = 0; x < employeeNames.rows.length; x++) {
                if (`${employeeNames.rows[x].first_name} ${employeeNames.rows[x].last_name}` === answers.employeeName) {
                    await pool.query(`
                    UPDATE employee SET role_id = ${i + 1} WHERE first_name = '${employeeNames.rows[x].first_name}'
                `)
                }
            }
        }
    }
    console.log(`Updated ${answers.employeeName} to the database`)
}

module.exports = updatingEmployee