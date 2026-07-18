import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let applications = [
  {
    id: randomUUID(),
    company: "Acme Corp",
    role: "Backend Engineer",
    status: "applied",
    appliedDate: "2026-07-01",
    notes: "Referred by a former colleague.",
  },
  {
    id: randomUUID(),
    company: "Globex",
    role: "Full-Stack Engineer",
    status: "interviewing",
    appliedDate: "2026-06-20",
    notes: "Technical interview scheduled for next week.",
  },
];

app.get("/api/applications", (req, res) => {
  res.json(applications);
});

app.get("/api/applications/:id", (req, res) => {
  const application = applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: "Not found" });
  res.json(application);
});

app.post("/api/applications", (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: "company and role are required" });
  }
  const application = {
    id: randomUUID(),
    company,
    role,
    status: status || "applied",
    appliedDate: appliedDate || new Date().toISOString().slice(0, 10),
    notes: notes || "",
  };
  applications.push(application);
  res.status(201).json(application);
});

app.put("/api/applications/:id", (req, res) => {
  const application = applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: "Not found" });
  Object.assign(application, req.body, { id: application.id });
  res.json(application);
});

app.delete("/api/applications/:id", (req, res) => {
  const lengthBefore = applications.length;
  applications = applications.filter((a) => a.id !== req.params.id);
  if (applications.length === lengthBefore) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
