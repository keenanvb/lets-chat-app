let expect = require('expect');
let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage',()=>{
    it('generate message object',()=>{
        let from = 'K'
        let text = 'Message'
        let message = generateMessage(from,text);

        expect(message.createdAt).toBeA('string');
        // expect(message.from).toBeA('string'); 
        // expect(message.text).toBeA('string');
        expect(message).toInclude({from,text});
    });
});

describe('generateLocationMessage',()=>{
    it('generate Location Onect',()=>{
        let from = 'K'
        let lat = 22
        let lng = 15
        let url = 'https://www.google.com/maps?q=22,15'
        let message = generateLocationMessage(from,lat,lng);
        
        expect(message.createdAt).toBeA('string');
        expect(message).toInclude({from,url});
    });
});