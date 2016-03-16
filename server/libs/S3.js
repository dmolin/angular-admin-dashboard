var knox = require('knox'),
    config = require('config'),
    q = require('q');

module.exports = {
    client: knox.createClient({
        key: config.s3.apiKey || process.env.S3_APIKEY,
        secret: config.s3.secret || process.env.S3_SECRET,
        bucket: config.s3.bucket,
        region: config.s3.region
    }),
    putFile: function(path, s3Name) {
        var deferred = q.defer();

        this.client.putFile(path, s3Name, {
            'x-amz-acl': 'public-read'
        }, function(err, response) {
            if(err) {
                deferred.reject(err, response);
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    },
    deleteFile: function(s3Name) {
        var deferred = q.defer();

        this.client.deleteFile(s3Name, function(err, response){
            if(err) {
                deferred.reject(err, response);
            }else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }
}