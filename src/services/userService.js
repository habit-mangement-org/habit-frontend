
import BASE_URL from "../config/apiConfig";

export function createUser(user) {
  return fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(res => {
    if (!res.ok) throw new Error("Create failed");
    return res.json();
  });
}

export function getUsers() {
  return fetch(`${BASE_URL}/all`).then(res => {
    if (!res.ok) throw new Error("Fetch failed");
    return res.json();
  });
}

export function addScore(userId) {
  return fetch(`${BASE_URL}/${userId}/score?points=1`, {
    method: "PUT",
  }).then(res => {
    if (!res.ok) throw new Error("Score failed");
    return res.json();
  });
}

export function deleteUser(userId) {
  return fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
  }).then(res => {
    if (!res.ok) throw new Error("Delete failed");
  });
}

// 🔹 ADD THIS for Edit User
export function updateUser(userId, user) {
  return fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(res => {
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  });
}
