var db = require('./db');
var shippingTable = 'shipping';
var Shipping = {
    getShippingList : function(conditions, callback){
        return db.query(`Select * from ${shippingTable} where ${conditions};`, callback);
    },
    insertShipping: function(values, callback){
        db.query(`truncate table ${shippingTable}`);
        return db.query(`insert into ${shippingTable} (cnee, line, origin, job_no, type, contact_no, pkgs, weight, vol, hbl, etd, nhs, shipper, mb_l, agent, igm, zoho_freight, zoho_line, ohbl, payment) values ${values}`, callback);
    },
    addShipping: function(data, callback){
        return db.query(`insert into ${shippingTable} set ? `, data, callback);
    },
    updateShipping: function(data, conditions, callback){
        return db.query(`update ${shippingTable} set ? WHERE ? `, [data,conditions], callback);
    }
};

module.exports = Shipping;

