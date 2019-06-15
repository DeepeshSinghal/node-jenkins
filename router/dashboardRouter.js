var express = require('express');
var User = require('../model/userModel');
var Shipping = require('../model/shippingModel');
var FileUploader = require('../middleware/fileUploader');
var fs = require('fs');
var xlsx = require('node-xlsx').default;
var moment = require('moment');
var router = express.Router();

router.get('/', function (req, res, next) {
    Shipping.getShippingList('1', function(err, result){
        if(err) return next(err);
        let shipData = result;
        res.render('dashboard/index', {data:shipData, moment:moment});
    });
});

router.get('/get-shipping/:id', function (req, res, next) {
    Shipping.getShippingList(`id = ${req.params.id}`, function(err, result){
        if(err) return next(err);
        let shipData = result[0];
        res.send(shipData);
    });
});

router.post('/upload-shipping', FileUploader.single('shipping_file'), (req, res, next) => {
    if(req.file){
        fs.rename(req.file.path, 'public/uploads/excel/'+req.file.filename, (err) =>{
            if(err) return next(err);  
            const workSheetsFromFile = xlsx.parse(`public/uploads/excel/${req.file.filename}`);
            let sheet = (workSheetsFromFile[0].data).slice(1);
            // let sheet = workSheetsFromFile[0].data;
            let insertValues = '';
            let i = 0;
            var tmpRow = '';
            sheet.forEach(function(sh){
                let cnee = (sh[0]===undefined)?'':sh[0]; 
                let line = (sh[1]===undefined)?'':sh[1]; 
                let origin = (sh[2]===undefined)?'':sh[2]; 
                let job_no = (sh[3]===undefined)?'':sh[3]; 
                let type = (sh[4]===undefined)?'':sh[4]; 
                let contact_no = (sh[5]===undefined)?'':sh[5]; 
                let pkgs = (sh[6]===undefined)?'':sh[6]; 
                let weight = (sh[7]===undefined)?'':sh[7]; 
                let vol = (sh[8]===undefined)?'':sh[8]; 
                let hbl = (sh[9]===undefined)?'':sh[9]; 
                let etdDate = moment(new Date(1900, 0, sh[10]-1)).format('YYYY-MM-DD');
                let etd = (sh[10]===undefined)?'':etdDate; 
                let nhsDate = moment(new Date(1900, 0, sh[11]-1)).format('YYYY-MM-DD');
                let nhs = (sh[11]===undefined)?'':nhsDate; 
                let shipper = (sh[12]===undefined)?'':sh[12]; 
                let mb_l = (sh[13]===undefined)?'':sh[13]; 
                let agent = (sh[14]===undefined)?'':sh[14]; 
                let igm = (sh[15]===undefined)?'':sh['15']; 
                let zoho_freight = (sh[16]===undefined)?'':sh[16]; 
                let zoho_line = (sh[17]===undefined)?'':sh[17]; 
                let ohbl = (sh[18]===undefined)?'':sh[18]; 
                let payment = (sh[19]===undefined)?'':sh[19]; 
                if(i < sheet.length-1){
                    tmpRow = `(
                        '${cnee}', 
                        '${line}', 
                        '${origin}', 
                        '${job_no}', 
                        '${type}', 
                        '${contact_no}', 
                        '${pkgs}', 
                        '${weight}', 
                        '${vol}', 
                        '${hbl}', 
                        '${etd}', 
                        '${nhs}', 
                        '${shipper}', 
                        '${mb_l}', 
                        '${agent}', 
                        '${igm}', 
                        '${zoho_freight}', 
                        '${zoho_line}', 
                        '${ohbl}', 
                        '${payment}'), `;
                }else{
                    tmpRow = `(
                        '${cnee}', 
                        '${line}', 
                        '${origin}', 
                        '${job_no}', 
                        '${type}', 
                        '${contact_no}', 
                        '${pkgs}', 
                        '${weight}', 
                        '${vol}', 
                        '${hbl}', 
                        '${etd}', 
                        '${nhs}', 
                        '${shipper}', 
                        '${mb_l}', 
                        '${agent}', 
                        '${igm}', 
                        '${zoho_freight}', 
                        '${zoho_line}', 
                        '${ohbl}', 
                        '${payment}')`;
                }
                insertValues = insertValues + tmpRow;
                i++;
            });
            Shipping.insertShipping(insertValues, function(err, result){
                if(err) return next(err); 
                res.redirect('/dashboard/');
            });
        });
    }
});

router.post('/add-shipping', function(req, res, next){
    if(req.body.id === ''){
        delete req.body.id;
    }
    let data = req.body;

    Shipping.addShipping(data, function(err, result){
        if(err) return next(err);
        req.flash('success', 'Details added successfully.')
        res.redirect('/dashboard/');
    });
});


router.post('/update-shipping', function(req, res, next){
    const shippingData = req.body;
    let data = {
        cnee: shippingData.cnee,
        line: shippingData.line,
        origin: shippingData.origin,
        job_no: shippingData.job_no,
        type: shippingData.type,
        contact_no: shippingData.contact_no,
        pkgs: shippingData.pkgs,
        weight: shippingData.weight,
        vol: shippingData.vol,
        hbl: shippingData.hbl,
        etd: shippingData.etd,
        nhs: shippingData.nhs,
        shipper: shippingData.shipper,
        mb_l: shippingData.mb_l,
        agent: shippingData.agent,
        igm: shippingData.igm,
        zoho_freight: shippingData.zoho_freight,
        zoho_line: shippingData.zoho_line,
        ohbl: shippingData.ohbl,
        payment: shippingData.payment
    };

    let condition = {id : parseInt(shippingData.id)};
    Shipping.updateShipping(data, condition, function(err, result){
        if(err) return next(err);
        req.flash('success', 'Details updated successfully.');
        res.redirect('/dashboard/');
    });
});

module.exports = router;