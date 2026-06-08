const API_BASE_URL = 'http://localhost:8000/api';

export const contestTaskService = {
    // Obtener tareas disponibles por categoría desde tasks.json (vía backend)
    getAvailableTasks: async (categoryId) => {
        const response = await fetch(`${API_BASE_URL}/tasks/available/${categoryId}`);
        const data = await response.json();
        return data;
    },

    // Agregar tarea al concurso (usando tu store existente)
    addTaskToContest: async (contestId, category, taskCode, displayOrder) => {
        const response = await fetch(`${API_BASE_URL}/contest_tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contest_id: contestId,
                category_id: category,
                task_code: taskCode,
                display_order: displayOrder
            })
        });
        const data = await response.json();
        return data;
    },

    // Obtener tareas de un concurso por categoría (usando tu show existente)
    getContestTasks: async (contestId) => {
        const response = await fetch(`${API_BASE_URL}/contest_tasks/${contestId}`);
        const data = await response.json();
        return data;
    },

    // Eliminar tarea del concurso (necesitas crear este método)
    removeTask: async (contestTaskId) => {
        const response = await fetch(`${API_BASE_URL}/contest_tasks/${contestTaskId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    }
};