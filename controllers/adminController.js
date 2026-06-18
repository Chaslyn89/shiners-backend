const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Grade = require('../models/Grade');
const Fee = require('../models/Fee');

// ========== STUDENT CONTROLLERS ==========

// Get all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('parent', 'name email');
        const parents = await Parent.find();
        
        const studentData = await Promise.all(students.map(async (s) => {
            const parent = await Parent.findById(s.parent);
            return {
                _id: s._id,
                studentId: s.studentId,
                fullName: s.fullName,
                grade: s.grade,
                parentName: parent ? parent.name : 'Unknown',
                parentEmail: parent ? parent.email : 'Unknown',
                parentId: s.parent
            };
        }));
        
        res.json({
            success: true,
            count: studentData.length,
            parentCount: parents.length,
            data: studentData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('parent', 'name email');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({
            success: true,
            data: {
                _id: student._id,
                studentId: student.studentId,
                fullName: student.fullName,
                grade: student.grade,
                parentEmail: student.parent ? student.parent.email : '',
                parentId: student.parent ? student.parent._id : null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create student
const createStudent = async (req, res) => {
    try {
        const { fullName, grade, parentEmail } = req.body;
        
        // Find or create parent
        let parent = await Parent.findOne({ email: parentEmail });
        if (!parent) {
            // Create a basic parent account if doesn't exist
            parent = await Parent.create({
                name: parentEmail.split('@')[0],
                email: parentEmail,
                password: '$2a$10$dummyhashedpassword',
                phone: ''
            });
        }
        
        // Generate student ID
        const studentId = 'STU' + Date.now().toString().slice(-6);
        
        const student = await Student.create({
            studentId,
            fullName,
            grade,
            parent: parent._id
        });
        
        // Add student to parent's students array
        parent.students.push(student._id);
        await parent.save();
        
        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const { fullName, grade, parentEmail } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        // Update parent if email changed
        if (parentEmail) {
            let parent = await Parent.findOne({ email: parentEmail });
            if (!parent) {
                parent = await Parent.create({
                    name: parentEmail.split('@')[0],
                    email: parentEmail,
                    password: '$2a$10$dummyhashedpassword',
                    phone: ''
                });
            }
            student.parent = parent._id;
        }
        
        student.fullName = fullName || student.fullName;
        student.grade = grade || student.grade;
        await student.save();
        
        res.json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        // Remove from parent's students array
        await Parent.updateOne(
            { _id: student.parent },
            { $pull: { students: student._id } }
        );
        
        // Delete all grades and fees for this student
        await Grade.deleteMany({ student: student._id });
        await Fee.deleteMany({ student: student._id });
        
        await student.deleteOne();
        
        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ========== GRADE CONTROLLERS ==========

// Get all grades
const getGrades = async (req, res) => {
    try {
        const grades = await Grade.find().populate('student', 'fullName studentId');
        const data = grades.map(g => ({
            _id: g._id,
            studentId: g.student ? g.student.studentId : 'Unknown',
            studentName: g.student ? g.student.fullName : 'Unknown',
            term: g.term,
            year: g.year,
            subjects: g.subjects,
            total: g.total,
            average: g.average
        }));
        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get grade by ID
const getGradeById = async (req, res) => {
    try {
        const grade = await Grade.findById(req.params.id).populate('student', 'fullName studentId');
        if (!grade) {
            return res.status(404).json({ success: false, message: 'Grade record not found' });
        }
        res.json({
            success: true,
            data: {
                _id: grade._id,
                studentId: grade.student ? grade.student.studentId : '',
                term: grade.term,
                year: grade.year,
                subjects: grade.subjects,
                total: grade.total,
                average: grade.average
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create grade
const createGrade = async (req, res) => {
    try {
        const { studentId, term, year, subjects } = req.body;
        
        // Find student by studentId
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        // Calculate total and average
        const subjectValues = Object.values(subjects).filter(v => v > 0);
        const total = subjectValues.reduce((a, b) => a + b, 0);
        const average = subjectValues.length > 0 ? total / subjectValues.length : 0;
        
        const grade = await Grade.create({
            student: student._id,
            term,
            year,
            subjects,
            total,
            average: Math.round(average * 10) / 10
        });
        
        res.status(201).json({
            success: true,
            message: 'Grades saved successfully',
            data: grade
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update grade
const updateGrade = async (req, res) => {
    try {
        const { term, year, subjects } = req.body;
        const grade = await Grade.findById(req.params.id);
        if (!grade) {
            return res.status(404).json({ success: false, message: 'Grade record not found' });
        }
        
        // Calculate total and average
        const subjectValues = Object.values(subjects).filter(v => v > 0);
        const total = subjectValues.reduce((a, b) => a + b, 0);
        const average = subjectValues.length > 0 ? total / subjectValues.length : 0;
        
        grade.term = term || grade.term;
        grade.year = year || grade.year;
        grade.subjects = subjects || grade.subjects;
        grade.total = total;
        grade.average = Math.round(average * 10) / 10;
        await grade.save();
        
        res.json({
            success: true,
            message: 'Grades updated successfully',
            data: grade
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete grade
const deleteGrade = async (req, res) => {
    try {
        const grade = await Grade.findById(req.params.id);
        if (!grade) {
            return res.status(404).json({ success: false, message: 'Grade record not found' });
        }
        await grade.deleteOne();
        res.json({
            success: true,
            message: 'Grade record deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ========== FEE CONTROLLERS ==========

// Get all fees
const getFees = async (req, res) => {
    try {
        const fees = await Fee.find().populate('student', 'fullName studentId');
        const data = fees.map(f => ({
            _id: f._id,
            studentId: f.student ? f.student.studentId : 'Unknown',
            studentName: f.student ? f.student.fullName : 'Unknown',
            term: f.term,
            year: f.year,
            totalAmount: f.totalAmount,
            paidAmount: f.paidAmount,
            balance: f.balance,
            paymentHistory: f.paymentHistory
        }));
        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get fee by ID
const getFeeById = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id).populate('student', 'fullName studentId');
        if (!fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }
        res.json({
            success: true,
            data: {
                _id: fee._id,
                studentId: fee.student ? fee.student.studentId : '',
                term: fee.term,
                year: fee.year,
                totalAmount: fee.totalAmount,
                paidAmount: fee.paidAmount,
                balance: fee.balance,
                paymentHistory: fee.paymentHistory
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create fee
const createFee = async (req, res) => {
    try {
        const { studentId, term, year, totalAmount, paidAmount } = req.body;
        
        // Find student by studentId
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        const balance = totalAmount - (paidAmount || 0);
        
        const fee = await Fee.create({
            student: student._id,
            term,
            year,
            totalAmount,
            paidAmount: paidAmount || 0,
            balance,
            paymentHistory: paidAmount ? [{ amount: paidAmount, method: 'Cash', reference: '' }] : []
        });
        
        res.status(201).json({
            success: true,
            message: 'Fee record created successfully',
            data: fee
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update fee
const updateFee = async (req, res) => {
    try {
        const { term, year, totalAmount, paidAmount } = req.body;
        const fee = await Fee.findById(req.params.id);
        if (!fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }
        
        fee.term = term || fee.term;
        fee.year = year || fee.year;
        fee.totalAmount = totalAmount || fee.totalAmount;
        fee.paidAmount = paidAmount !== undefined ? paidAmount : fee.paidAmount;
        fee.balance = fee.totalAmount - fee.paidAmount;
        await fee.save();
        
        res.json({
            success: true,
            message: 'Fee record updated successfully',
            data: fee
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete fee
const deleteFee = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);
        if (!fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }
        await fee.deleteOne();
        res.json({
            success: true,
            message: 'Fee record deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
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
};