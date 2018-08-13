var mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');

var CompanySchema = new mongoose.Schema({
    companyLogo: String,
    customForms: [{type: String}],
    companyAddress: String,
    companySize: Number,
    
});


CompanySchema.plugin(timestamps);

module.exports = mongoose.model("Company", CompanySchema);