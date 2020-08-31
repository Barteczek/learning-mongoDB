const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if no args', () => {
    const emp = new Employee({});

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if missing 1 arg', () => {
    const emp = new Employee({firstName: 'Lorem', lastName: 'Ipsum'});

    emp.validate(err => {
      expect(err.errors.department).to.exist;
    });

    const emp2 = new Employee({firstName: 'Lorem', department: 'Ipsum'});

    emp2.validate(err => {
      expect(err.errors.lastName).to.exist;
    });

    const emp3 = new Employee({lastName: 'Lorem', department: 'Ipsum'});

    emp3.validate(err => {
      expect(err.errors.firstName).to.exist;
    });
  });


  it('should throw an error if arg is not a string', () => {

    const cases = [{}, []];
    for(let firstName of cases) {
      const emp = new Employee({ firstName, lastName: 'Lorem', department: 'Ipsum'});
  
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
      });
    }

    for(let lastName of cases) {
      const emp = new Employee({ firstName: 'Lorem', lastName, department: 'Ipsum'});
  
      emp.validate(err => {
        expect(err.errors.lastName).to.exist;
      });
    }

    for(let department of cases) {
      const emp = new Employee({ firstName: 'Ipsum', lastName: 'Lorem', department });
  
      emp.validate(err => {
        expect(err.errors.department).to.exist;
      });
    }
  
  });

  it('should not throw an error if args are given correctly', () => {

    const emp = new Employee({ firstName: 'Lorem', lastName: 'Lorem', department: 'Ipsum'});
    
    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
  

});