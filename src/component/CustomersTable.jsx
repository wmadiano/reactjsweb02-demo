import React, { useState, useEffect } from 'react';
import config from './config/config'; // Adjust the import path based on where you placed config.js


const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [host, setHost] = useState('');
  // cons endpoint = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/customers`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCustomers(data.customers);
        setHost(data.host);
      } catch (error) {
        console.error('There was a problem with the fetch operation..:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Customers</h2>
      {host && <p>{host}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
