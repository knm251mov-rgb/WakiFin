import UserForm from "../components/UserForm";
import UsersList from "../components/UsersList";
import { useState } from "react";

export default function Users() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingUser, setEditingUser] = useState(null);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div style={{ paddingTop: "80px" }}>
      <h1>Users</h1>

      <UserForm
        editingUser={editingUser}
        onCreated={triggerRefresh}
        onFinishEdit={() => {
          setEditingUser(null);
          triggerRefresh();
        }}
      />

      <UsersList
        refreshKey={refreshKey}
        onEdit={(user) => setEditingUser(user)}
      />
    </div>
  );
}
