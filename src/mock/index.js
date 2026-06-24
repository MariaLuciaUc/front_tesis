// src/mock/index.js

import mockConfig from './config.json';

// ============================================================
// SOLO DATOS DE USUARIOS PARA AUTENTICACIÓN MOCK
// ============================================================

// Tabla: teachers (maestros) - SOLO para autenticación
export const DB_TEACHERS = [
    {
        id: 1,
        email: 'maria@nauta.cu',
        full_name: 'Maria Alvarez',
        password_hash: '$2y$10$hashed_password_1',
        created_at: '2026-06-23 16:30:16.743929'
    },
    {
        id: 2,
        email: 'albertorp@nauta.cu',
        full_name: 'Alberto Reyes',
        password_hash: '$2y$10$hashed_password_2',
        created_at: '2026-06-23 16:31:01.716539'
    },
];

// Tabla: students (estudiantes) - SOLO para autenticación
export const DB_STUDENTS = [
    {
        id: 141,
        teacher_id: 1,
        group_id: 17,
        category_id: 3,
        gender: 'Femenino',
        full_name: 'Alison Fernandez Rodriguez',
        username: 'usr30001',
        password_hash: '$2y$10$hashed_password_1',
    },
    // ... resto de estudiantes
];

// ============================================================
// FUNCIÓN PRINCIPAL: OBTENER USUARIO SEGÚN EL JSON
// ============================================================

export const getCurrentUser = () => {
    const { role, userId } = mockConfig;

    if (role === 'coordinator') {
        return {
            id: 999,
            name: 'Coordinador Nacional',
            email: 'coordinador@bebras.cu',
            role: 'coordinator'
        };
    }

    if (role === 'teacher') {
        const teacher = DB_TEACHERS.find(t => t.id === userId);
        if (!teacher) {
            console.warn('Maestro con ID', userId, 'no encontrado.');
            return null;
        }
        return {
            ...teacher,
            role: 'teacher'
        };
    }

    if (role === 'student') {
        const student = DB_STUDENTS.find(s => s.id === userId);
        if (!student) {
            console.warn('Estudiante con ID', userId, 'no encontrado.');
            return null;
        }
        return {
            ...student,
            role: 'student'
        };
    }

    return null;
};

export const getCurrentRole = () => mockConfig.role;

// ============================================================
// FUNCIONES QUE SOLO DEVUELVEN DATOS DE AUTENTICACIÓN
// ============================================================

export const getAllTeachers = () => DB_TEACHERS;
export const getTeacherById = (id) => DB_TEACHERS.find(t => t.id === id);
export const getAllStudents = () => DB_STUDENTS;
export const getStudentById = (id) => DB_STUDENTS.find(s => s.id === id);

// ============================================================
// FUNCIÓN PARA CAMBIAR DE ROL DESDE LA CONSOLA
// ============================================================

export const switchRole = (newRole, newUserId = null) => {
    const validRoles = ['coordinator', 'teacher', 'student'];

    if (!validRoles.includes(newRole)) {
        console.error('Rol inválido:', newRole);
        return;
    }

    console.log('Cambiando a rol:', newRole, newUserId ? 'con ID:' + newUserId : '');

    mockConfig.role = newRole;
    if (newUserId !== null) {
        mockConfig.userId = newUserId;
    }

    window.location.reload();
};

if (typeof window !== 'undefined') {
    window.switchRole = switchRole;
    console.log('Para cambiar de rol, usa: switchRole("teacher", 1)');
    console.log('Roles disponibles: coordinator, teacher, student');
}