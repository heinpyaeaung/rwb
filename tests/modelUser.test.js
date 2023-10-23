const {userValidation} = require('../models/user')
describe('should return info in input is valid', () => {
    it('input user valid info',() => {
        let payload = {
            username: 'Hein Pyae',
            email: "hein@gmail.com",
            password: "1234565"
        }
        let result = userValidation(payload);
        expect(result).not.toHaveProperty('error')
    })
})
