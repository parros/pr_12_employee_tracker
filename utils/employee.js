const {employeeRoles} = require('./inquirer.js')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

async function addingEmployee(){
        // Creates an array of the most current roles for employees
        const workRoles = await pool.query('SELECT title FROM role')
        let roles = []
        for (let i = 0; i < workRoles.rows.length; i++) {
            roles.push(workRoles.rows[i].title)
        }
        // Creates an array of the most current employees
        const employees = await pool.query(`SELECT CONCAT(first_name, ' ', last_name)  FROM employee`)
        let managers = [null]
        for (let i = 0; i < employees.rows.length; i++) {
            managers.push(employees.rows[i].concat)
        }
        const answers = await employeeRoles(roles, managers)
        // Retrieves employee id 
        for (let i = 0; i < employees.rows.length; i++) {
            const result = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) FROM employee
            WHERE id=${i+1}
            `)
            if (answers.employee_manager === result.rows[0].concat){
                // Inserts inquired employee data into the employee table with the for loop helping convert the string answer for role to an integer
                for (let x = 0; x < workRoles.rows.length; x++) {
                    if (answers.employee_role === null) {
                        await pool.query(`
                        INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employee_first_name}', '${answers.employee_last_name}', ${x + 1})
                        `)}
                    if (answers.employee_role === workRoles.rows[x].title) {
                        await pool.query(`
                        INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employee_first_name}', '${answers.employee_last_name}', ${x + 1}, ${i+1})
                        `)
                    }
                }
            }
        }
        console.log(`Added ${answers.employee_first_name} ${answers.employee_last_name} to the database`)
    }

module.exports = addingEmployee