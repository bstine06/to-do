// api.js

const apiUrl = 'http://127.0.0.1:5006';

async function apiGetAllTasks() {
    const response = await fetch(`${apiUrl}/get-all-tasks`);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
}

async function apiGetAllProjects() {
    const response = await fetch(`${apiUrl}/get-all-projects`);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
}

async function apiGetAllTasksInProject(projectUUID) {
    const response = await fetch(`${apiUrl}/get-all-tasks-in-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ project_uuid: projectUUID })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
}

async function apiCheckServerHealth() {
  try {
    const response = await fetch(`${apiUrl}/health-check`);
    if (!response.ok) {
      throw new Error('Server health check failed: ' + response.statusText);
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error('Server health check failed: invalid status');
    }
    return data;
  } catch (error) {
    throw new Error('Server health check failed: invalid status');
  }
  
}

async function apiCreateTask(uuid, title, description, dueDate, priority, notes, projectUUID) {
  console.log("IN API CREATE TASK");
  const response = await fetch(`${apiUrl}/add-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({  uuid: uuid,
                            name: title,
                            description: description,
                            due_date: dueDate,
                            priority: priority,
                            notes: notes,
                            project_uuid: projectUUID })
  });
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const data = await response.json();
  return data;
}

async function apiRemoveTaskByUUID(uuid) {
  const response = await fetch(`${apiUrl}/remove-task-by-uuid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uuid: uuid })
  });
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const data = await response.json();
  return data;
}

// Export the functions to be used in other parts of the application
export { apiGetAllTasks, apiGetAllProjects, apiCreateTask, apiGetAllTasksInProject, apiCheckServerHealth, apiRemoveTaskByUUID };
