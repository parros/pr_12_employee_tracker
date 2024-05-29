const { addRole } = require('./inquirer.js')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

async function addingRole() {
    // Creates an array of the most current departments
    const departments = await pool.query('SELECT name FROM department')
    let departmentNames = []
    for (let i = 0; i < departments.rows.length; i++) {
        departmentNames.push(departments.rows[i].name)
    }

    const answers = await addRole(departmentNames)
    // Inserts inquired role data into the role table
    for (let i = 0; i < departments.rows.length; i++) {
        if (departments.rows[i].name === answers.roleDepartment) {
            await pool.query(`
            INSERT INTO role(title, salary, departmentId) 
            VALUES ('${answers.roleName}', '${answers.roleSalary}', ${i + 1})
            `)
        }
    }
    console.log(`Added ${answers.roleName} to the database`)
}

module.exports = addingRole