const request = require('supertest');
const {Content} = require('../../models/content')

let server;
describe('api/user/allcontents/',() => {
    beforeEach(() => {server = require('../../server')});
    afterEach(async() => {
        server.close();
        await Content.deleteMany({author: true})
    }); 
    describe('GET',() => {
        it('should return a genre if valid is passed',async() => {
            let genre = new Content({
                header: 'Js tips and tricks',
                author: 'Jaden Smith'
            })
            await genre.save()
            const res = await request(server).get('/api/user/content/'+genre._id);
            expect(res.status).toBe(200);
        })
    })
})