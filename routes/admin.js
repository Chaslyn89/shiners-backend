const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade,
    getFees,
    getFeeById,
    createFee,
    updateFee,
    deleteFee
} = require('../controllers/adminController');

// ========== STUDENT ROUTES ==========
router.get('/students', auth, getStudents);
router.get('/students/:id', auth, getStudentById);
router.post('/students', auth, createStudent);
router.put('/students/:id', auth, updateStudent);
router.delete('/students/:id', auth, deleteStudent);

// ========== GRADE ROUTES ==========
router.get('/grades', auth, getGrades);
router.get('/grades/:id', auth, getGradeById);
router.post('/grades', auth, createGrade);
router.put('/grades/:id', auth, updateGrade);
router.delete('/grades/:id', auth, deleteGrade);

// ========== FEE ROUTES ==========
router.get('/fees', auth, getFees);
router.get('/fees/:id', auth, getFeeById);
router.post('/fees', auth, createFee);
router.put('/fees/:id', auth, updateFee);
router.delete('/fees/:id', auth, deleteFee);

module.exports = router;