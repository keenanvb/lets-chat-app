const expect = require('expect');

const {
    Users
} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'K',
            room: 'Football'
        }, {
            id: '2',
            name: 'L',
            room: 'Football'
        }, {
            id: '3',
            name: 'S',
            room: 'Code is Life'
        }];
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '0001',
            name: 'L',
            room: 'Life 101'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        let userId = '1';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        let userId = '99';
        let user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        let userId = '2';
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        let userId = '99';
        let user = users.getUser(userId);

        expect(user).toNotExist();
    });

    it('should return names for node course', () => {
        let userList = users.getUserList('Football');

        expect(userList).toEqual(['K', 'L']);
    });

    it('should return names for react course', () => {
        let userList = users.getUserList('Code is Life');

        expect(userList).toEqual(['S']);
    });
});