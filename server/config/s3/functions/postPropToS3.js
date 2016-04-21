var fs = require('fs'),
    path = require('path'),
    bluebird = require('bluebird'),
    shortId = require('shortid'),
    buffFileType = require('file-type'),
    strFileType = /(?:\/(?=[^/]*;))(\w+)(?:;)/,
    aws = require('aws-sdk'),
    s3 = new aws.S3();
    s3.putObjectAsync = bluebird.promisify(s3.putObject);


module.exports = function(api) {

  return function(cb, obj, val) {
      // determine form of file buffer to be uploaded (stored into uploadType)
      var uploadType;

      if(obj[val] instanceof Buffer) uploadType = 'buffer'; // check if upload is raw buffer
      else if(obj[val].indexOf(';base64') !== -1) uploadType = 'bufferString'; // check if upload is blob
      else { // check if upload is filepath
        const filePath = obj[val].indexOf(api.getValue('clientRootPath')) === -1 ? path.join(api.getValue('clientRootPath'), obj[val]) : obj[val]; // allow client or server filepath to be provided
        if(fs.existsSync(filePath)) { // check if file exists locally
          uploadType = 'filePath';
          obj[val] = filePath; // allow client or server filepath to be provided
        }
      }
      if(!uploadType) return cb(new Error('key found but not uploadable'), null); //if none

      // declare vars to be set depending on object type
      var fileType,
          awsFileBuffer;

      // handles raw buffer
      if(uploadType === 'buffer') {
          fileType = buffFileType(obj[val]).ext;
          awsFileBuffer = obj[val];
      }
      // handles base 64 string
      else if(uploadType === 'bufferString') {
          var fileStrSplit = obj[val].split(',');
          fileType = strFileType.exec(fileStrSplit[0])[1];
          awsFileBuffer = new Buffer(fileStrSplit[1], 'base64');
      }
      else {
          fileType = obj[val].slice(obj[val].lastIndexOf('.')+1);
          awsFileBuffer = fs.readFileSync(obj[val]);
      }
      var awsObjKey = (obj.name || obj._id || (obj.createdDate || Number(new Date()).toString()) + '_' + shortId.generate()) + '.' + fileType;
      s3.putObjectAsync({
          Bucket: api.getValue('awsBucket'),
          Key: awsObjKey,
          Body: awsFileBuffer
      })
      .then((data) => cb(null, obj[val] = api.getValue('awsBucketUrl') + awsObjKey + (data.VersionId ? '?versionId=' + data.VersionId : ''))) //replace object val with s3 URL
      .catch((err) => {
        console.log('Error posting file to S3 from back end: ', err);
        cb(err, null);
      });
  };
};
