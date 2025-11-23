const express = require('express');
const router = express.Router();

const {
  createLinkHandler,
  listLinksHandler,
  getLinkStatsHandler,
  deleteLinkHandler
} = require('../controllers/linkController');


router.post('/', createLinkHandler);
router.get('/', listLinksHandler);
router.get('/:code', getLinkStatsHandler);
router.delete('/:code', deleteLinkHandler);

module.exports = router;
