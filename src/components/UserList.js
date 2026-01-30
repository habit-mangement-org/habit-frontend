
import React, { useEffect, useState } from "react";
import { getUsers, addScore, deleteUser, updateUser } from "../services/userService";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleUpdate = async () => {
    await updateUser(editUser.id, {
      name: editUser.name,
      age: parseInt(editUser.age, 10)
    });
    setEditUser(null);
    loadUsers();
  };

  return (
    <div>
      <h2>User List</h2>

      {editUser && (
        <div>
          <h3>Edit User</h3>
          <input
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            type="number"
            value={editUser.age}
            onChange={(e) => setEditUser({ ...editUser, age: e.target.value })}
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>Name</th><th>Age</th><th>Habit</th><th>Score</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.age}</td>
              <td>{u.habit}</td>
              <td>{u.score}</td>
              <td>
                <button onClick={() => addScore(u.id).then(loadUsers)}>+1</button>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => deleteUser(u.id).then(loadUsers)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
