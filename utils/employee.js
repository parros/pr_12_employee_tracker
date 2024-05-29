const inquirer = require('inquirer')

function employeeRoles(roles) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'employee_last_name',
            message: 'What is the last name of the employee?'
        },
        {
            type: 'input',
            name: 'employee_role',
            message: 'What is the role of the employee?'
        },
        {
            type: 'list',
            name: 'employee_manager',
            message: 'Who is the employee\'s manager?',
            choices: roles
        }
    ]).then((employee_answers) => {
        console.log(roles)
        console.log(employee_answers)
        // return(employee_answers)
    })
}

module.exports = {employeeRoles}