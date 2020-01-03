const express = require('express');

const router = express.Router();

router.get('/', getDetections);
router.get('/:cameraId/get-detections', getDetections);
router.get('/:cameraId/get-shot', getShot);

module.exports = router;

