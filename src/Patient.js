import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientForm = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    weight: '',
    gender: '',
    age: '',
    disease: '',
    doctorId: 0,  // Change doctorId structure to hold only the ID
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/patients');  // Update endpoint URL
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/doctors');  // Update endpoint URL
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'doctorId') {
      // Parse the value as an integer since it's an ID
      setPatientData({ ...patientData, [name]: parseInt(value) });
    } else {
      setPatientData({ ...patientData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDoctor = doctors.find(doctor => doctor.id === parseInt(patientData.doctorId));
    const updatedPatientData = { ...patientData, doctor: selectedDoctor };
  
    axios.post('http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/patients', updatedPatientData)
      .then(response => {
        console.log('Patient added:', response.data);
        fetchPatients(); // Fetch updated list of patients
        setPatientData({  // Reset form fields
          name: '',
          weight: '',
          gender: '',
          age: '',
          disease: '',
          doctorId: {
            id: 0
          }
        });
      })
      .catch(error => console.error('Error adding patient:', error));
  };
  const handleEdit = (id) => {
    // Find the patient to edit
    const patientToEdit = patients.find(patient => patient.id === id);
    if (patientToEdit) {
      // Set the form fields to the patient's data
      setPatientData({
        ...patientToEdit,
        doctorId: patientToEdit.doctorId ? String(patientToEdit.doctorId.id) : '', // Check if doctorId exists before accessing its id property
      });
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/patients/${id}`);  // Update endpoint URL
      console.log('Patient deleted:', id);
      // Update patient list after deletion
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <center>
      <div>
        <h2>Create New Patient</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields for patient data */}
          <label>
            Name:
            <input type="text" name="name" value={patientData.name} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Weight:
            <input type="text" name="weight" value={patientData.weight} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Gender:
            <input type="text" name="gender" value={patientData.gender} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Age:
            <input type="text" name="age" value={patientData.age} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Disease:
            <input type="text" name="disease" value={patientData.disease} onChange={handleChange} required />
          </label>
          <br />
          <label htmlFor="doctorId">Select Doctor:</label>
          <select
            id="doctorId"
            name="doctorId"
            value={patientData.doctorId}
            onChange={handleChange}
          >
            <option value="">Select Doctor</option>
            {Array.isArray(doctors) && doctors?.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
          <br />
          <button type="submit">Create Patient</button>
        </form>
      </div>
      
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
                <td>{patient.name}</td>
                <td>{patient.weight}</td>
                <td>{patient.gender}</td>
                <td>{patient.age}</td>
                <td>{patient.disease}</td>
                <td>{patient.doctor ? `${patient.doctor.name} - ${patient.doctor.specialization}` : 'Not Assigned'}</td>
                <td>
                  <button onClick={() => handleEdit(patient.id)}>Edit</button>
                  <button onClick={() => handleDelete(patient.id)}>Delete</button>
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

