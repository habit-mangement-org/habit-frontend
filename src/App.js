
import React from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Digital Habit Manager</h1>
      <UserForm />
      <hr />
      <UserList />
    </div>
  );
}

export default App;
