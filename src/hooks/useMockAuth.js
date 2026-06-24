// src/hooks/useMockAuth.js

import { useState, useEffect } from 'react';
import {
    getCurrentUser,
    getCurrentRole,
    getAllStudents,
    getAllTeachers,
    getStudentById
} from '../mock';

export const useMockAuth = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            const currentUser = getCurrentUser();
            const currentRole = getCurrentRole();
            setUser(currentUser);
            setRole(currentRole);
            setLoading(false);
            console.log('Usuario cargado:', currentUser);
        };
        loadUser();
    }, []);

    const isCoordinator = role === 'coordinator';
    const isTeacher = role === 'teacher';
    const isStudent = role === 'student';

    return {
        user,
        role,
        loading,
        isCoordinator,
        isTeacher,
        isStudent,
        getAllTeachers,
        getAllStudents,
        getStudent: getStudentById
    };
};

export default useMockAuth;