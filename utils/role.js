const {addRole} = require('./inquirer.js')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})
async function addingRole(){
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
}
module.exports = addingRole