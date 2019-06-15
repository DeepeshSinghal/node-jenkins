var db = require('./db');  
var User = {
    getUsers : function(UserData, callback){
        if(UserData.id !== undefined){
            return db.query('SELECT * FROM user WHERE id=?',[UserData.id], callback)
        } else if(UserData.user_role_id !== undefined){
            return db.query('SELECT * FROM user WHERE user_role_id=?',[UserData.user_role_id], callback);
        } else{
            return db.query(`SELECT User.id,User.first_name,User.middle_name,User.last_name,User.email,User.status, Role.name FROM user User JOIN user_role Role ON (user.user_role_id = Role.id) WHERE 1 ORDER BY User.id desc`, callback)
            
        } 
    },
    isUserExists : function(conditions, callback){
        return db.query('select count(id) as count, id from user where '+ conditions, callback);
    },
    saveUser : function(userData, callback){
        return db.query('INSERT INTO user SET ?', userData, callback)
    },
    updateUser : function(fieldsWithValues, conditions, callback){
        return db.query('UPDATE user SET ? WHERE ?', [fieldsWithValues, conditions], callback)
    },
    getUserForLogin: function(userData, callback){
        return db.query('SELECT * FROM user WHERE email=?', [userData.email], callback);
    },
    getRoles: function(callback){
        return db.query('SELECT id,name FROM user_role', callback);
    }

};
module.exports = User;