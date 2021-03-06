import { DrawableEmployee } from './DrawableEmployee';
import { EmployeeTrack } from './EmployeeTrack';
import { createEmployeeEntity } from '../Core/entity/EmployeeEntity';

describe('Emloyee class', () => {
  describe('Add empty track', () => {
    it('When adding a empty track to an employee, it is saved in the employee property', () => {
      // Arrange
      const two = {};
      const track = new EmployeeTrack({ id: 2, points: [] });
      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});

      // Act
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: 50,
        yCurrent: 50,
        radius: 15,
        color: '#3A19A4',
        track,
      }, two);

      // Assert
      expect(employee.track).toBe(track);
    });
  });

  describe('Add track', () => {
    it('When next point received for the first time, check that _currentPointIndex is changed to 1', () => {
      // Arrange
      const two = {};
      const track = new EmployeeTrack({
        id: 1,
        points: [{ x: 60, y: 100 }, { x: 700, y: 600 }],
      });
      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: 50,
        yCurrent: 50,
        radius: 15,
        color: '#3A19A4',
        track,
      }, two);

      // Act
      const { x: xNext, y: yNext } = employee.getNextPoint();

      // Assert
      expect(xNext).toEqual(700);
      expect(yNext).toEqual(600);
      expect(employee._currentPointIndex).toEqual(1);
    });
  });

  describe('Add current coordinates to employee', () => {
    it('When coordinates are added to an employee, they are saved in the employee object', () => {
      // Arrange
      const two = {};
      const x = 300;
      const y = 400;
      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});

      // Act
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: x,
        yCurrent: y,
        radius: 15,
        color: '#3A19A4',
        track: {},
      }, two);

      // Assert
      expect(employee.xCenter).toEqual(x);
      expect(employee.yCenter).toEqual(y);
    });
  });

  describe('Add move to employee', () => {
    it('When using move(x, y) method, the values of the starting point are changed to x and y', () => {
      // Arrange
      const two = {
        remove: jest.fn(),
        update: jest.fn(),
      };

      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: 50,
        yCurrent: 50,
        radius: 15,
        color: '#3A19A4',
        track: {},
      }, two);
      const x = 300;
      const y = 500;
      employee.draw = jest.fn();

      // Act
      employee.move(x, y);

      // Assert
      expect(employee.xCenter).toEqual(x);
      expect(employee.yCenter).toEqual(y);
    });
  });

  describe('Check work clear() method', () => {
    it('When using move() method must call the internal clear() method; remove() method is inside clear() method', () => {
      // Arrange
      const two = {
        remove: jest.fn(),
        update: jest.fn(),
      };

      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: 50,
        yCurrent: 50,
        radius: 15,
        color: '#3A19A4',
        track: {},
      }, two);
      employee.draw = jest.fn();

      // Act
      employee.move();

      // Assert
      expect(two.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Check work startMovingAlongTrack() method', () => {
    it('1 seconds later numberOfEmployeeMoves equals 1, when used startMovingAlongTrack() method, employee will be in point2', () => {
      // Arrange
      const two = {
        remove: jest.fn(),
        update: jest.fn(),
      };
      const numberOfEmployeeMoves = 1;

      const point1 = { x: 60, y: 100 };
      const point2 = { x: 700, y: 600 };
      const point3 = { x: 500, y: 100 };
      const track = new EmployeeTrack({
        id: 1,
        points: [point1, point2, point3],
      });

      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: 50,
        yCurrent: 50,
        radius: 15,
        color: '#3A19A4',
        track,
      }, two);
      employee.draw = jest.fn();
      jest.useFakeTimers();

      // Act
      employee.startMovingAlongTrack();
      jest.advanceTimersByTime(numberOfEmployeeMoves * 1000);

      // Assert
      expect(employee.xCenter).toEqual(point2.x);
      expect(employee.yCenter).toEqual(point2.y);
    });

    it('3 seconds later numberOfEmployeeMoves equals 3, when used startMovingAlongTrack() method, employee will be in point1 (after the last point, the employee returns to the first point)', () => {
      // Arrange
      const two = {
        remove: jest.fn(),
        update: jest.fn(),
      };
      const numberOfEmployeeMoves = 3;

      const point1 = { x: 60, y: 100 };
      const point2 = { x: 700, y: 600 };
      const point3 = { x: 500, y: 100 };
      const track = new EmployeeTrack({
        id: 1,
        points: [point1, point2, point3],
      });

      const employeeEntity = createEmployeeEntity({ name: 'Петров С.М.'});
      const employee = new DrawableEmployee({
        employee: employeeEntity,
        xCurrent: 50,
        yCurrent: 50,
        radius: 15,
        color: '#3A19A4',
        track,
      }, two);
      employee.draw = jest.fn();
      jest.useFakeTimers();

      // Act
      employee.startMovingAlongTrack();
      jest.advanceTimersByTime(numberOfEmployeeMoves * 1000);

      // Assert
      expect(employee.xCenter).toEqual(point1.x);
      expect(employee.yCenter).toEqual(point1.y);
    });
  });
});
