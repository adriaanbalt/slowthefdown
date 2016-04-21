var fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    aws = require('aws-sdk'),
    s3 = new aws.S3(),
    getNameFromUrl = /(?:\/(?=[^/]*))([\w]+\.[^\.]+)(\.[^\?]*)(?:(?:.*versionId=)([^&]*))?/;
    s3.getObjectAsync = Promise.promisify(s3.getObject);


module.exports = function(api) {

  return function(cb, obj, val, dest) {

      // name of file (including extension);
      const [, nameFromUrl, nameAppend, versionFromUrl] = obj[val].match(getNameFromUrl);

      // get object from AWS
      s3.getObjectAsync({
          Bucket: api.getValue('awsBucket'),
          Key: nameFromUrl + nameAppend,
          VersionId: versionFromUrl ? versionFromUrl : null
      })
      .then((data) => fs.writeFileAsync(path.join(dest, nameFromUrl), data.Body))
      .then(function() {
        console.log('image is saved locally here : ' + 'assets/images/' + nameFromUrl);
        obj[val] = path.join(api.getValue('clientAssetUploadPath'), nameFromUrl);
        cb(null, obj);
      })
      .catch((err) => {
        console.log('Error retrieving image from S3 for zip file: ', err);
        cb(err, null);
      });

  };
};
