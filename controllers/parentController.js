const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Fee = require('../models/Fee');

// ========== REGISTER PARENT ==========
const registerParent = async (req, res) => {
    try {
        const { name, email, password, phone, studentName, studentGrade } = req.body;

        // Check if parent already exists
        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({
                success: false,
                message: 'Parent with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create parent
        const parent = await Parent.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || ''
        });

        // Generate student ID
        const studentId = 'STU' + Date.now().toString().slice(-6);

        // Create student linked to parent
        const student = await Student.create({
            studentId: studentId,
            fullName: studentName,
            grade: studentGrade,
            parent: parent._id
        });

        // Add student to parent's students array
        parent.students.push(student._id);
        await parent.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: parent._id, email: parent.email, role: 'parent' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Parent registered successfully',
            token,
            parent: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                students: [{
                    id: student._id,
                    studentId: student.studentId,
                    name: student.fullName,
                    grade: student.grade
                }]
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ========== LOGIN PARENT ==========
const loginParent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find parent
        const parent = await Parent.findOne({ email }).populate('students');
        if (!parent) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, parent.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: parent._id, email: parent.email, role: 'parent' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            parent: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                students: parent.students.map(s => ({
                    id: s._id,
                    studentId: s.studentId,
                    name: s.fullName,
                    grade: s.grade
                }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ========== GET PARENT DASHBOARD ==========
const getParentDashboard = async (req, res) => {
    try {
        const parent = await Parent.findById(req.user.id).populate('students');
        if (!parent) {
            return res.status(404).json({
                success: false,
                message: 'Parent not found'
            });
        }

        // Get grades and fees for each student
        const studentData = await Promise.all(parent.students.map(async (student) => {
            const grades = await Grade.find({ student: student._id })
                .sort({ year: -1, term: -1 });
            const fees = await Fee.find({ student: student._id })
                .sort({ year: -1, term: -1 });
            
            return {
                id: student._id,
                studentId: student.studentId,
                name: student.fullName,
                grade: student.grade,
                grades: grades.map(g => ({
                    term: g.term,
                    year: g.year,
                    subjects: g.subjects,
                    total: g.total,
                    average: g.average
                })),
                fees: fees.map(f => ({
                    term: f.term,
                    year: f.year,
                    totalAmount: f.totalAmount,
                    paidAmount: f.paidAmount,
                    balance: f.balance
                }))
            };
        }));

        res.json({
            success: true,
            parent: {
                name: parent.name,
                email: parent.email,
                phone: parent.phone
            },
            students: studentData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ========== GET STUDENT GRADES ==========
const getStudentGrades = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        
        // Verify student belongs to this parent
        const parent = await Parent.findById(req.user.id);
        const student = await Student.findOne({ studentId: studentId });
        
        if (!student || !parent.students.includes(student._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This student is not associated with your account.'
            });
        }

        const grades = await Grade.find({ student: student._id })
            .sort({ year: -1, term: -1 });

        res.json({
            success: true,
            student: {
                id: student._id,
                studentId: student.studentId,
                name: student.fullName,
                grade: student.grade
            },
            grades: grades.map(g => ({
                term: g.term,
                year: g.year,
                subjects: g.subjects,
                total: g.total,
                average: g.average
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ========== GET STUDENT FEES ==========
const getStudentFees = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        
        // Verify student belongs to this parent
        const parent = await Parent.findById(req.user.id);
        const student = await Student.findOne({ studentId: studentId });
        
        if (!student || !parent.students.includes(student._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This student is not associated with your account.'
            });
        }

        const fees = await Fee.find({ student: student._id })
            .sort({ year: -1, term: -1 });

        res.json({
            success: true,
            student: {
                id: student._id,
                studentId: student.studentId,
                name: student.fullName,
                grade: student.grade
            },
            fees: fees.map(f => ({
                term: f.term,
                year: f.year,
                totalAmount: f.totalAmount,
                paidAmount: f.paidAmount,
                balance: f.balance,
                paymentHistory: f.paymentHistory
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    registerParent,
    loginParent,
    getParentDashboard,
    getStudentGrades,
    getStudentFees
};
