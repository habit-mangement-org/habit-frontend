
import React, { useState } from "react";
import { createUser } from "../services/userService";

function UserForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUser({ name, age: Number(age) });
      alert("User created ✅");
      setName("");
      setAge("");
      window.location.reload();   // 👈 Force reload to refresh list
    } catch (err) {
      alert("Error creating user ❌");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" />
      <br />
      <input value={age} onChange={e => setAge(e.target.value)} placeholder="Enter Age" />
      <br />
      <button type="submit">Create</button>
    </form>
  );
}

export default UserForm;
