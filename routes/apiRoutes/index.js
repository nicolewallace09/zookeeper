const router = require('express').Router();
const animalRoutes = require('./animalRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes')); 

module.exports = router; 