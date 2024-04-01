import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientForm = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const updatedPatients = patients.map(patient => {
      if (patient.id === id) {
        return { ...patient, [name]: value };
      }
      return patient;
    });
    setPatients(updatedPatients);
  };

  const handleUpdate = async (id) => {
    const patientToUpdate = patients.find(patient => patient.id === id);
    try {
      await axios.put(`http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/patients/${id}`, patientToUpdate);
      // Refresh patient list after update
      fetchPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <center>
      <div>
        <h2>Patient Records</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <input 
                    type="text" 
                    value={patient.name} 
                    onChange={(e) => handleChange(e, patient.id)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={patient.weight} 
                    onChange={(e) => handleChange(e, patient.id)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={patient.gender} 
                    onChange={(e) => handleChange(e, patient.id)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={patient.age} 
                    onChange={(e) => handleChange(e, patient.id)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={patient.disease} 
                    onChange={(e) => handleChange(e, patient.id)} 
                  />
                </td>
                <td>{patient.doctor ? `${patient.doctor.name} - ${patient.doctor.specialization}` : 'Not Assigned'}</td>
                <td>
                  <button onClick={() => handleUpdate(patient.id)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </center>
  );
};

export default PatientForm;
