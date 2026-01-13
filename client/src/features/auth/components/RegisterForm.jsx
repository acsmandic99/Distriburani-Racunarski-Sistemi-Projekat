import React, { useState } from "react";

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    gender: "",
    country: "",
    street: "",
    street_number: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };

    if (dataToSend.date_of_birth) {
      const date = new Date(dataToSend.date_of_birth);
      dataToSend.date_of_birth = date.toISOString().split("T")[0];
    }

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
        required
      />
      <input
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        name="date_of_birth"
        type="date"
        placeholder="Date of Birth"
        onChange={handleChange}
        required
      />
      <input
        name="gender"
        placeholder="Gender"
        onChange={handleChange}
        required
      />
      <input
        name="country"
        placeholder="Country"
        onChange={handleChange}
        required
      />
      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
