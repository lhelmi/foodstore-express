const csv = require('csvtojson');
const path = require('path');

async function getProvinces(req, res, next){
    const db_province = path.resolve(__dirname, './data/provinces.csv');

    try {
        const data = await csv().fromFile(db_province);
        return res.json({'data' : data});
    } catch (error) {
        return res.json({
            error: 1, 
            message: 'Tidak bisa mengambil data provinsi, hubungi administrator'
        });
    }
}

async function getRegencies(req, res, next){
    const db_regency = path.resolve(__dirname, './data/regencies.csv');

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_regency);
        if(!kode_induk) return res.json({'data' : data});

        return res.json({'data' : data.filter(kabupaten => kabupaten.kode_provinsi === kode_induk)});
        
    } catch (error) {
        return res.json({
            error: 1, 
            message: 'Tidak bisa mengambil data kabupaten, hubungi administrator'
        });
    }
}

async function getDistricts(req, res, next){
    const db_district = path.resolve(__dirname, './data/districts.csv');

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_district);
        if(!kode_induk) return res.json({'data' : data});

        return res.json({'data' : data.filter(kecamantan => kecamantan.kode_kabupaten === kode_induk)});
        
    } catch (error) {
        return res.json({
            error: 1, 
            message: 'Tidak bisa mengambil data kecamantan, hubungi administrator'
        });
    }
}

async function getVillages(req, res, next){
    const db_village = path.resolve(__dirname, './data/villages.csv');

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_village);
        if(!kode_induk) return res.json({'data' : data});

        return res.json({'data' : data.filter(desa => desa.kode_kecamatan === kode_induk)});
    } catch (error) {
        return res.json({
            error: 1, 
            message: 'Tidak bisa mengambil data desa, hubungi administrator'
        });
    }
}

module.exports = {
    getProvinces,
    getRegencies,
    getDistricts,
    getVillages
}