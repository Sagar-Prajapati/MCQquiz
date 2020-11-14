const bcrypt = require('bcryptjs');

exports.generatePassword = async function(){
    const lengths = 8;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    var charcterLength = characters.length;
    for(var i=0;i<lengths;i++){
        result +=characters.charAt(Math.floor(Math.random()*charcterLength));
    }
    const password = await bcrypt.hash(result,10);
    return {password,key:result};
}