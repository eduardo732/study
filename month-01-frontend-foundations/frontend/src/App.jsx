import { useState, useEffect, useCallback, useMemo } from "react";
import { ApplicationList } from "./components/ApplicationListComponent";

function App() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const STATUS_OPTIONS = ["applied", "interviewing"];
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      });
  }, []);

  const filteredApplications = useMemo(() => {
    return filterStatus !== ""
      ? applications.filter((app) => app.status === filterStatus)
      : applications;
  }, [filterStatus, applications]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApplication = { company, role, status };
    if (editingId) {
      fetch(`http://localhost:3001/api/applications/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApplication),
      })
        .then((response) => response.json())
        .then((data) => {
          const newApplications = applications.map((item) =>
            item.id === editingId ? data : item,
          );
          setApplications(newApplications);
          setCompany("");
          setRole("");
          setStatus("");
          setEditingId(null);
        });
    } else {
      fetch("http://localhost:3001/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApplication),
      })
        .then((response) => response.json())
        .then((data) => {
          setApplications([...applications, data]);
          setCompany("");
          setRole("");
          setStatus("");
        });
    }
  };

  const handleDelete = useCallback(
    (id) => {
      fetch(`http://localhost:3001/api/applications/${id}`, {
        method: "DELETE",
      }).then(() => {
        const newApplications = applications.filter((item) => item.id != id);
        setApplications(newApplications);
      });
    },
    [applications],
  );

  const handleEdit = useCallback(
    (id) => {
      const application = applications.find((app) => app.id === id);
      setEditingId(application.id);
      setCompany(application.company);
      setRole(application.role);
      setStatus(application.status);
    },
    [applications],
  );

  return (
    <div>
      <h1>Job Application Tracker</h1>
      <h3>Filter By Status</h3>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">ALL</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ApplicationList
        applications={filteredApplications}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <h2>Add New Application</h2>
      <form onSubmit={handleSubmit}>
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
  );
}

export default App;
