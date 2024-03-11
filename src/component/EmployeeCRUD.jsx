import React, { useState, useEffect } from 'react';

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ email: '', firstName: '', age: '', active: false });
  const [editingId, setEditingId] = useState(null);

  const apiURL = 'http://api2.gresdev.com/api';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${apiURL}/employees`);
      const data = await response.json();
      if (data.status === 'success') {
        setEmployees(data.data.employees);
      } else {
        throw new Error('Failed to fetch employees');
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiURL}/employees/${editingId}` : `${apiURL}/employees`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.status === 'success') {
        await fetchEmployees();
        setForm({ email: '', firstName: '', age: '', active: false });
        setEditingId(null);
      } else {
        throw new Error('Failed to submit employee data');
      }
    } catch (error) {
      console.error("Error submitting employee data:", error);
    }
  };

  const editEmployee = (employee) => {
    setForm({ email: employee.email, firstName: employee.firstName, age: employee.age, active: employee.active });
    setEditingId(employee.id);
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${apiURL}/employees/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'success') {
        await fetchEmployees();
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div>
      <h2>Employee CRUD</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
        <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" />
        <label>
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} /> Active
        </label>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.firstName} ({employee.email}) - {employee.active ? 'Active' : 'Inactive'}
            <button onClick={() => editEmployee(employee)}>Edit</button>
            <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeCRUD;
