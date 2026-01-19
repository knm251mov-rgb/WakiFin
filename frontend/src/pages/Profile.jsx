// Створіть цей файл у папці /pages
export default function Profile({ user, onLogout }) {
  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Access Denied</h2>
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <h2>👤 User Profile</h2>
      <p>Here you can manage your account settings.</p>

      <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem' }}>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: user.role === 'admin' ? 'darkred' : 'inherit' }}>{user.role}</span></p>
      </div>

      <button 
        onClick={onLogout} 
        style={{ 
          marginTop: '2rem', 
          padding: '10px 20px', 
          borderRadius: '6px', 
          border: 'none', 
          background: '#ff0000', 
          color: 'white', 
          fontWeight: '600', 
          cursor: 'pointer' 
        }}
      >
        Logout
      </button>
    </div>
  );
}