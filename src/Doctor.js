import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorForm = () => {
  const [doctorData, setDoctorData] = useState({
    name: '',
    salary: '',
    gender: '',
    age: '',
    specialization: '',
  });
  const [doctorsList, setDoctorsList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/doctors`);
      setDoctorsList(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  const handleSubmit = async (index) => {
    try {
      await axios.post(`http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/doctors`, doctorData);
      setEditingIndex(null);
      setDoctorData({
        name: '',
        salary: '',
        gender: '',
        age: '',
        specialization: '',
      });
      // Fetch doctors again to update the list
      fetchDoctors();
    } catch (error) {
      console.error('Error updating Doctor:', error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const selectedDoctor = doctorsList[index];
    setDoctorData({ ...selectedDoctor });
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/doctors/${doctorId}`);
      console.log('Doctor deleted successfully');
      // Optionally, update the state or perform any other actions after deletion
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        await handleSubmit(editingIndex);
      } else {
        const response = await axios.post(`http://restdemo-env.eba-m2agb5ue.ap-south-1.elasticbeanstalk.com/doctors`, doctorData);
        console.log('Doctor created:', response.data);
        setDoctorData({
          name: '',
          salary: '',
          gender: '',
          age: '',
          specialization: '',
        });
        fetchDoctors();
      }
    } catch (error) {
      console.error('Error creating/updating Doctor:', error);
    }
  };

  return (
    <center>
      <div>
        <h2>Create New Doctor</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="name">Enter Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={doctorData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="salary">Salary:</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={doctorData.salary}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={doctorData.gender}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={doctorData.age}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="specialization">Enter Specialization:</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={doctorData.specialization}
              onChange={handleChange}
            />
          </div>
          <button type="submit">{editingIndex !== null ? 'Update' : 'Create'}</button>
        </form>
      </div>

      <div>
        <h2>Doctors List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctorsList.map((doctor, index) => (
              <tr key={index}>
                <td>{editingIndex === index ? (
                  <input
                    type="text"
                    value={doctorData.name}
                    onChange={handleChange}
                    name="name"
                  />
                ) : doctor.name}</td>
                <td>{editingIndex === index ? (
                  <input
                    type="number"
                    value={doctorData.salary}
                    onChange={handleChange}
                    name="salary"
                  />
                ) : doctor.salary}</td>
                <td>{editingIndex === index ? (
                  <input
                    type="text"
                    value={doctorData.gender}
                    onChange={handleChange}
                    name="gender"
                  />
                ) : doctor.gender}</td>
                <td>{editingIndex === index ? (
                  <input
                    type="number"
                    value={doctorData.age}
                    onChange={handleChange}
                    name="age"
                  />
                ) : doctor.age}</td>
                <td>{editingIndex === index ? (
                  <input
                    type="text"
                    value={doctorData.specialization}
                    onChange={handleChange}
                    name="specialization"
                  />
                ) : doctor.specialization}</td>
                <td>
                  {editingIndex === index ? (
                    <button onClick={() => handleSubmit(index)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </center>
  );
};

export default DoctorForm;
