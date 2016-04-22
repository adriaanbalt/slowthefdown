var aws = require('aws-sdk'),
    path = require('path');

module.exports = (api) => {
    var deepSearchRun = require(path.join(api.getValue('apiUtilsPath'),'deepSearchRun'));

    // Configure AWS
    aws.config.update({
        accessKeyId: process.env.AWS_CLIENT_ID,
        secretAccessKey: process.env.AWS_SECRET,
        region: process.env.AWS_REGION || 'us-west-2'
    });

    api.setValue('awsBucket', api.getValue('env') === 'production'? process.env.AWS_BUCKET + '-prod' : process.env.AWS_BUCKET);
    api.setValue('awsBucketUrl', process.env.AWS_HOST + api.getValue('awsBucket') + '/');
    require('./routes/signS3.js')(api);

    var postPropToS3 = require('./functions/postPropToS3')(api),
        getPropFromS3 = require('./functions/getPropFromS3')(api),
        renameS3 = require('./functions/renameS3')(api);

    api.postObjToS3 = (obj, findKey) => deepSearchRun(postPropToS3,
        (val) => val.indexOf(findKey) > -1,
        obj);

    api.pullObjFromS3 = (obj, dest) => deepSearchRun(getPropFromS3,
        (val) => typeof obj[val] === 'string' && obj[val].indexOf('//s3') > -1,
        obj,dest);

    api.renameS3 = (highsore, newName) => renameS3(highsore, newName);
};
