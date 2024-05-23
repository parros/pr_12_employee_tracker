SELECT * FROM role
JOIN department
ON role.department_id = department.id
JOIN employee
ON employee.role_id = role.id;