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

async function apiCreateTask(task) {
    const response = await fetch(`${apiUrl}/create-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
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
  const response = await fetch(`${apiUrl}/health-check`);
  if (!response.ok) {
    throw new Error('Server health check failed: ' + response.statusText);
  }
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error('Server health check failed: invalid status');
  }
  return data;
}

// Export the functions to be used in other parts of the application
export { apiGetAllTasks, apiGetAllProjects, apiCreateTask, apiGetAllTasksInProject, apiCheckServerHealth };
