var mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');

var EmployeeProfileEmployeeSchema = new mongoose.Schema({
    userID: String,
    personal: {
        firstName: String,
        lastName: String,
        birthday: Date,
        socialNumber: Number, // string maybe instead to include - to create space? Do form validation?
        gender: Boolean, // false remale true male
        address: String,
        maritalStatus: String
    },
    contactInfo: {
        homePhoneNumber: Number,
        cellPhoneNumber: Number,
        personalEmail: String,
        workEmail: String,
        emergencyContact: {
            firstName: String,
            lastName: String,
            phoneNumber: Number
        }
    },
    education: {
        postSecondary: String,
        certifications: String,
    },
    clothing: {
        shirtSize: String,
        pantSize: Number
    },
    employeeData: {
        EmployeeID: String,
        EmploymentType: String,
        HireDate: Date,
        LeavingDate: Date,
        financialPlanEnrollMent: {type: Boolean, default: false},
        trainingDue: {type: Boolean, default: false},
        jobTitle: String,
        Location: String,
        Department: String,
        employmentStatus: String,
    },
    lastChangedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
});

EmployeeProfileEmployeeSchema.plugin(timestamps);

module.exports = mongoose.model("EmployeeProfile", EmployeeProfileEmployeeSchema);