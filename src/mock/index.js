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
    {
        id: 3,
        email: 'rosalia@gmail.com',
        full_name: 'Rosalia Perez Lugo',
        password_hash: '$2y$10$hashed_password_2',
        created_at: '2026-06-23 16:31:01.716539'
    }
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
    {
        id: 142,
        teacher_id: 1,
        group_id: 17,
        category_id: 3,
        gender: 'Femenino',
        full_name: 'Maria Lucia Alonso Santana',
        username: 'usr30002',
        password_hash: '$2y$10$hashed_password_2',
    },
    {
        id: 143,
        teacher_id: 1,
        group_id: 17,
        category_id: 3,
        gender: 'Masculino',
        full_name: 'Arturo Alonso',
        username: 'usr30003',
        password_hash: '$2y$10$hashed_password_3',
    },
    {
        id: 144,
        teacher_id: 1,
        group_id: 17,
        category_id: 3,
        gender: 'Masculino',
        full_name: 'Mario Moreno',
        username: 'usr30004',
        password_hash: '$2y$10$hashed_password_4',
    },
    {
        id: 145,
        teacher_id: 2,
        group_id: 18,
        category_id: 5,
        gender: 'Femenino',
        full_name: 'Marian Rojas',
        username: 'usr50001',
        password_hash: '$2y$10$hashed_password_5',
    },
    {
        id: 149,
        teacher_id: 2,
        group_id: 18,
        category_id: 5,
        gender: 'Femenino',
        full_name: 'Taisel Santana',
        username: 'usr50002',
        password_hash: '$2y$10$hashed_password_5',
    },
    {
        id: 150,
        teacher_id: 2,
        group_id: 18,
        category_id: 5,
        gender: 'Masculino',
        full_name: 'Gabriel Hernandez',
        username: 'usr50003',
        password_hash: '$2y$10$hashed_password_5',
    },
    {
        id: 151,
        teacher_id: 2,
        group_id: 18,
        category_id: 5,
        gender: 'Masculino',
        full_name: 'David Machado Becerra',
        username: 'usr50004',
        password_hash: '$2y$10$hashed_password_5',
    },
    {
        id: 152,
        teacher_id: 2,
        group_id: 18,
        category_id: 5,
        gender: 'Masculino',
        full_name: 'Arturo Alonso',
        username: 'usr50005',
        password_hash: '$2y$10$hashed_password_5',
    }
];

// ============================================================
// MAPEO DE CATEGORÍAS BEBRAS
// ============================================================

export const CATEGORIES = {
    1: { id: 1, name: 'Super Peque', displayName: 'Super Peque (1ro y 2do)' },
    2: { id: 2, name: 'Peque', displayName: 'Peque (3ro y 4to)' },
    3: { id: 3, name: 'Benjamin', displayName: 'Benjamin (5to y 6to)' },
    4: { id: 4, name: 'Cadete', displayName: 'Cadete (7mo y 8vo)' },
    5: { id: 5, name: 'Junior', displayName: 'Junior (9no y 10mo)' },
    6: { id: 6, name: 'Senior', displayName: 'Senior (11no y 12mo)' }
};

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
            role: 'student',
            category: CATEGORIES[student.category_id] || null
        };
    }

    return null;
};

export const getCurrentRole = () => mockConfig.role;

export const getAllTeachers = () => DB_TEACHERS;
export const getTeacherById = (id) => DB_TEACHERS.find(t => t.id === id);
export const getAllStudents = () => DB_STUDENTS;
export const getStudentById = (id) => DB_STUDENTS.find(s => s.id === id);
export const getStudentCategory = (studentId) => {
    const student = DB_STUDENTS.find(s => s.id === studentId);
    if (!student) return null;
    return CATEGORIES[student.category_id] || null;
};

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