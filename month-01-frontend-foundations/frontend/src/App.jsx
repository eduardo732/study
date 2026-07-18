import { useState, useEffect } from 'react'

function App() {
  const [applications, setApplications] = useState([])
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const STATUS_OPTIONS = ['applied', 'interviewing', 'offered', 'rejected']

  useEffect(() => {
    fetch('http://localhost:3001/api/applications')
      .then((response) => response.json())
      .then((data) => setApplications(data))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newApplication = { company, role, status }
    fetch('http://localhost:3001/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApplication),
    })
      .then((response) => response.json())
      .then((data) => setApplications([...applications, data]))
  }

  return (
    <div>
      <h1>Job Application Tracker</h1>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              {app.company} — {app.role} ({app.status})
            </li>
          ))}
        </ul>
      )}
      <h2>Add New Application</h2>
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button type="submit">Add Application</button>
      </form>
    </div>
        
  )
}

export default App