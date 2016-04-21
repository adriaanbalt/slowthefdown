var router = require('express').Router(),
    fs = require('fs'),
    path = require('path');

// Set image specs
var acceptableFileTypes = ['png', 'jpeg', 'gif', 'jpg', 'mp4', 'webm'];
var maxImageSize = 41943040 * 20;

module.exports = (api) => {
  router.delete('/:imagename', (req, res, next) => {
    const imagePath = path.join(api.getValue('clientRootPath'), api.getValue('clientAssetUploadPath'), 'uploads', req.params.imagename);

    if (!fs.existsSync(imagePath)) {
      console.log(req.params.imagename + " doesn't exist");
      res.status(404).json({
        message: req.params.imagename + " doesn't exist, this is fine if you've hit 'publish' though"
      });
    } else {
      fs.unlink(imagePath);
      console.log(req.params.imagename + " deleted!");
      res.status(200).json({
        message: req.params.imagename + " deleted!"
      });
    }
  });

  router.post('/', (req, res, next) => {
    const image = req.body;
    if (!image.file) res.status(406).json({
      filename: 'noimage'
    });
    else if (acceptableFileTypes.indexOf(image.ext.toLowerCase()) === -1) res.status(406).json({
      filename: 'invalid_image - ' + image.ext
    });
    else if (image.size >= maxImageSize) res.status(406).json({
      filename: 'invalid_image_size'
    });
    else {
      // need to get rid of back slashes as these mess up front end filepaths
      //image.name = image.name.replace(/[ ',@&%~`'"|#:;<>=\-\+\*\?\{\}\[\]\(\)\^\$\.\\]/g, '_'); // for all except background image this works : /[#\\?%]/g

      const clientPath = path.join(api.getValue('clientAssetUploadPath'), 'uploads', image.name);
      const serverPath = path.join(api.getValue('clientRootPath'), clientPath);

      // Create file
      fs.writeFileAsync(serverPath,image.file.split(',').pop(), 'base64')
      .then((val) => res.status(200).json({
          filename: clientPath
        }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          filename: 'upload_failure'
        });
      });
    }
  });

  return router;
};
