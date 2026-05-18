const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, searchEmployees, updateEmployee, deleteEmployee, getEmployeeById } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.use(protect);

router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('department', 'Department is required').not().isEmpty(),
  check('performanceScore', 'Performance Score is required').isNumeric(),
  check('experience', 'Experience is required').isNumeric()
], addEmployee);

router.get('/search', searchEmployees);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
