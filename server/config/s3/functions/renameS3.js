var fs = require('fs'),
    Promise = require('bluebird'),
    aws = require('aws-sdk'),
    shortId = require('shortid'),
    _ = require('lodash'),
    s3 = new aws.S3(),
    parseProjectUrl = /(?:\/(?=[^/]*))([\w]+)(\.[^\?]+)(?:(?:.*versionId=)([^&]*))?/;
    s3.copyObjectAsync = Promise.promisify(s3.copyObject);


module.exports = function(api) {
    return function(project, newName) {

        // name of file (including extension);
        const [, nameFromUrl, extensionFromUrl, versionFromUrl] = project.filename.match(parseProjectUrl);

        // set copy source URL
        const copySourceUrl = `/${api.getValue('awsBucket')}/${nameFromUrl}${extensionFromUrl}` + (versionFromUrl ? `?versionId=${versionFromUrl}` : '');

        // set new name
        const awsObjKey = (newName || project._id || (project.createdDate || Number(new Date()).toString()) + '_' + shortId.generate()) + extensionFromUrl;

        // copy object in S3 to new location
        return new Promise(function(resolve, reject){
            s3.copyObjectAsync({
                Bucket: api.getValue('awsBucket'),
                CopySource: copySourceUrl,
                Key: awsObjKey,
                MetadataDirective: 'REPLACE'
            }).then((copyResult) => {
                resolve(_.merge(project, {
                    filename: `${api.getValue('awsBucketUrl')}${awsObjKey}` + (versionFromUrl ? `?versionId=${copyResult.VersionId}` : '')
                  }));
            }).catch((err) => console.log('Error posting file to S3 from back end: ', err));
        });
    };
};
