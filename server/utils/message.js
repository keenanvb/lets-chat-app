let moment = require('moment');
let date = moment().valueOf();
let generateMessage = (from,text)=>{
    return {
        from:from,
        text:text,
        createdAt:date
    }
}

let generateLocationMessage = (from,lat,lng)=>{
    return {
        from:from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt:date
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}