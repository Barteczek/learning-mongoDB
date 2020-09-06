const Department = require('../department.model.js');
const expect = require('chai').expect;

describe('Department', () => {

  it('should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value

    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if "name" is not a string', () => {

    const cases = [{}, []];
    for(let name of cases) {
      const dep = new Department({ name });
  
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if "name" is less than 5 or greater than 20 characters', () => {

    const cases = ['abc', 'qwertyuioplkjhgfdsazxcvbnm'];
    for(let name of cases) {
      const dep = new Department({ name });
  
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should not throw an error if "name" is given correctly', () => {

    const cases = ['Abcde', 'Abcdef', 'qwertyuioplkjhgfdsaz'];
    for(let name of cases) {
      const dep = new Department({ name });
  
      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
});