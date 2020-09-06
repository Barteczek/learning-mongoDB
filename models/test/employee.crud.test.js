const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();
  
      const uri = await fakeDB.getConnectionString();
  
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    } catch(err) {
      console.log(err);
    }
  
  });

  describe('Reading data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Ipsum', department: 'Marketing' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      expect(employees).to.not.be.null;
    });
  
    it('should return proper document by various params with "findOne" method', async () => {
      const empByFirstName = await Employee.findOne({ firstName: 'John' });
      const empByLastName = await Employee.findOne({ lastName: 'Ipsum' });
      const empByDep = await Employee.findOne({ department: 'Marketing' });
      
      expect(empByFirstName.firstName).to.be.equal('John');
      expect(empByLastName.lastName).to.be.equal('Ipsum');
      expect(empByDep.department).to.be.equal('Marketing');
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Lorem', lastName: 'Ipsum', department: 'Dolor' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });
  
  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Ipsum', department: 'Marketing' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: '=John=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=John=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda' });
      employee.firstName = '=Amanda=';
      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: '=Amanda=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });
  });
  
  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Ipsum', department: 'Marketing' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Amanda' });
      const deletedEmployee = await Employee.findOne({ firstName: 'Amanda' });
      expect(deletedEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'Doe' });
      await employee.remove();
      const deletedEmployee = await Employee.findOne({ lastName: 'Doe' });
      expect(deletedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
});
