module.exports = (api) => {
    require('./libConfig');
    require('./s3')(api);
};
