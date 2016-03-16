var _ = require('lodash'),
  multiparty = require('multiparty'),
  mongoose = require('mongoose'),
  path = require('path'),
  S3 = require('../../libs/S3'),
  q = require('q'),
  async = require('async'),
  Project = require('../../models/project.server.model').model,
  ProjectDefaults = require('../../models/project.server.model').defaults;


module.exports = function(app) {
  cfg = app.locals.appConfig;

  //Fetch all the available Projects
  app.get('/api/projects', function (req, res) {
    Project.find().sort({ modifiedOn: -1 }).exec(function(err, results) {
      if(err) {
          res.status(500).json({status: 'failure'});
      } else {
          res.json(results);
      }
    });
  });

  app.get('/api/project/:id', function(req, res) {
    Project.findOne({'_id': req.params.id}, function(err, result) {
      if(err) {
          res.status(500).json({status: 'failure', reason: err});
      } else {
          res.json(result);
      }
    });
  });

  //Create a new Project
  app.post('/api/projects', function(req, res) {
    if(!_hasMandatoryFields(req)) {
      res.status(400).json({status: 'failure', reason: 'Not all mandatory fields have been provided'});
      return;
    }

    var project = new Project({
      attachmentsPrefix: mongoose.Types.ObjectId(),  //will be used as prefix for all attachments
      projectName: req.body.projectName,
      clientName: req.body.clientName
    });

    //give the project default values
    _.extend(project, ProjectDefaults);

    project.save()
      .then(function success(saved) {
        res.status(201).json(saved);
      }, function error(err){
        res.status(500).json({status: 'failure', reason: err});
      });
  });

  //Update a project document
  /**
   * Since we're always updating one field at a time we could simply issue a PATCH.
   * Updating the entire doc in this case is not a big deal, since the doc is quite small AND this give us
   * 2 added benefits:
   *   - we can detect if any field has been removed (not present in the payload = remove from MongoDB)
   *   - we can detect if any attachment has been removed and remove the file from S3
   * Using a PATCH would force us to create a special protocol to handle field removal
   * (like turning undefined fields into "null" values to avoid JSON suppression and unmarshalling them back into undefined values here)
   */
  app.put('/api/project/:id', function(req, res) {
    if(!_hasMandatoryFields(req)) {
        res.status(400).json({status: 'failure', reason: 'Not all mandatory fields have been provided'});
        return;
    }

    //Find is only to check if we've removed any linked document
    Project.findOne({_id: req.params.id}, function(err, doc) {
      if(err) {
          res.status(500).json({status: 'failure', when: 'looking up document', reason: err});
          return;
      }

      _removeAttachments(doc)
        .then(function() {
          var updatingDoc = _.omit(req.body, ['_id']);
          //Update the document in overwrite mode, to get rid of removed fields
          var found = Project.update({_id: doc._id}, updatingDoc, {overwrite:true}, function(err) {
            if(err) {
              res.status(500).json({status: 'failure', when: 'saving document', reason: err });
            } else {
              res.json(doc);
            }
          });
        });
    });
  });

  //Delete a project
  app.delete('/api/project/:id', function(req, res) {
    if(!req.params.id) {
      res.status(400).json({status: 'failure', reason: 'No Project ID provided'});
      return;
    }

    Project.findOne({_id: req.params.id}, function(err, doc) {
      if(err) {
        res.status(404).json({status: 'failure', when: 'locating document for removal', reason: err});
        return;
      }

      //remove attachments
      _removeAttachments(doc)
        .then(function() {
          doc.remove(function(err) {
            if(err) {
              res.status(500).json({status: 'failure', when: 'removing document with ProjectId=' + req.params.id, reason: err});
              return;
            } else {
              res.json({status: 'success'});
            }
          });
        })
        .catch(function projectRemovalError(err) {
          res.status(500).json({status: 'failure', when: 'removing attachents for document with ProjectId=' + req.params.id, reason: err});
        });
    });

  });


  //Upload a file attachment to a document
  app.post('/project/:id/upload', function upload(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      //retrieve the Campaign model and attach the file
      Project.findOne({_id: req.params.id}, function(err, doc) {
        if(err || !doc) {
          console.log("cannot find project with id=" + req.params.id)
          res.status(500).json({status: 'failure', when: 'looking up document', reason: err});
          return;
        }

        doc.attachmentsPrefix = doc.attachmentsPrefix || mongoose.Types.ObjectId().toString();

        //Extract the structure of the first uploaded file (and the only one)
        var uploadedDoc = _.findKey(files, function(o){ return _.isArray(o) && o[0].path; });
        if(!uploadedDoc) {
          res.status(403).json({status:'failure', when:'parsing input data', reason: 'No uploaded document info found in the payload'});
          return;
        }
        uploadedDoc = files[uploadedDoc];
        if(_.isArray(uploadedDoc)) {
          uploadedDoc = uploadedDoc[0];
        }

        var docType = uploadedDoc.fieldName;
        var previousFile = doc[docType] && doc[docType].name;
        var s3Name = _getS3Path(uploadedDoc.originalFilename, doc, docType);

        S3.putFile(uploadedDoc.path, s3Name)
          .then(function(response) {
            //update the document
            doc[docType] = {
              url: response.req.url,
              size: uploadedDoc.size,
              name: s3Name.substr(1),
              type: uploadedDoc.headers['content-type']
            };

            doc.save(function(err) {
              if(err) {
                res.status(500).json({status:'failure', when:'saving document', reason: err});
                return;
              }
              //if there was a previous upload with a different name, let's remove it
              if(previousFile && previousFile !== s3Name.substr(1)) {
                S3.deleteFile(previousFile)
                  .catch(function(err) {
                      //not so much we can do here...
                  })
                  .finally(function() {
                      res.json(doc);
                  })
              } else {
                res.json(doc);
              }
            });
          })
          .catch(function(err, response) {
            res.status(500).json({status: 'failure', when: 'saving attachment', reason: err});
          })
      });
    });
  });

  function _hasMandatoryFields(req) {
    return (req && req.body && req.body.projectName);
  }

  function _getS3Path(filename, doc, suffix) {
    return "/" + (doc.attachmentsPrefix || mongoose.Types.ObjectId().toString()) + (suffix ? "-" + suffix : "") + path.extname(filename);
  }

  function _removeAttachments(doc) {
    var deferred = q.defer();

    async.parallel([
      _removeAttachment.bind(doc.backgroundImage),
    ], function(err) {
      if(err) {
        deferred.reject(doc);
      } else {
        deferred.resolve(doc);
      }
    });
    return deferred.promise;
  }

  function _removeAttachment(callback) {
    var doc = this;

    if(!doc || !doc.name) {
      callback(null);
      return;
    }
    //console.log("deleting attachment", doc.name);
    //remove the document
    S3.deleteFile(doc.name)
      .then(function() { callback(null); })
      .catch(function(err) { callback(err); })
  }

};