var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('config');
var path = require('path');

var invoiceSchema = new Schema({
  number: {type: Number},
  amount: {type: Number},

  document: {
    originalFilename: String,
    url: {type: String },
    type: { type: String },
    name: {type: String},
    size: {type:Number}
  }

});

var projectSchema = new Schema({
  projectName: String,
  clientName: String,
  //time is always expressed in UTC
  isArchived: { type: Boolean, default: false },
  attachmentsPrefix: String,

  contractUrl: { type: String },
  contract: {
    originalFilename: String,
    url: {type: String },
    type: { type: String },
    name: {type: String},
    size: {type:Number}
  },

  invoices: [invoiceSchema],

  createdBy: Schema.Types.Mixed,
  createdOn: { type: Date, default: Date.now },
  modifiedBy: Schema.Types.Mixed,
  modifiedOn: { type: Date, default: Date.now }
});

var defaults = {
};

module.exports = {
    model: mongoose.model('Project', projectSchema),
    defaults: defaults
};
