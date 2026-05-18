const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

exports.addEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { name, email, department, skills, performanceScore, experience } = req.body;

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      res.status(400);
      throw new Error('Email already exists');
    }

    const employee = await Employee.create({
      name, email, department, skills, performanceScore, experience, createdBy: req.user.id
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ createdBy: req.user.id }).sort({ performanceScore: -1 });
    const rankedEmployees = employees.map((emp, index) => ({
      ...emp.toObject(),
      rank: index + 1
    }));
    res.json(rankedEmployees);
  } catch (error) {
    next(error);
  }
};

exports.searchEmployees = async (req, res, next) => {
  try {
    const { department, minScore, skills } = req.query;
    
    let query = { createdBy: req.user.id };
    if (department && department !== 'All') {
      query.department = { $regex: new RegExp(department, 'i') };
    }
    if (minScore) {
      query.performanceScore = { $gte: Number(minScore) };
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });
    const rankedEmployees = employees.map((emp, index) => ({
      ...emp.toObject(),
      rank: index + 1
    }));
    res.json(rankedEmployees);
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, req.body, { new: true, runValidators: true });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};
