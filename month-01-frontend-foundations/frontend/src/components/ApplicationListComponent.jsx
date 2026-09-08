import { memo } from "react";

const ApplicationListComponent = (props) => {
  const { applications, handleEdit, handleDelete } = props;
  return (
    <>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              {app.company} — {app.role} ({app.status})
              <button onClick={() => handleEdit(app.id)}>Editar</button>
              <button onClick={() => handleDelete(app.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const ApplicationList = memo(ApplicationListComponent);
