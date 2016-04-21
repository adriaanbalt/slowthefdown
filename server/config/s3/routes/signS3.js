var aws = require('aws-sdk'),
    bluebird = require('bluebird'),
    s3 = new aws.S3();
    s3.getSignedUrlAsync = bluebird.promisify(s3.getSignedUrl);

module.exports = (api) => {
  api.post('/api/sign_s3', (req, res) => {
    s3.getSignedUrlAsync('putObject', {
        Bucket: api.getValue('awsBucket'),
        Key: req.body.name,
        Expires: 60,
        ContentType: req.body.type,
        ACL: 'public-read'
      })
      .then((data) => res.json({
          signed_request: data,
          url: api.getValue('awsBucketUrl') + req.body.name
      }))
      .catch((err) => console.log('Failed to get back end S3 signature for front end image upload to S3: ', err));
    });
};
