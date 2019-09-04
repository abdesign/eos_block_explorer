import express from 'express';
import EosService from '../util/eosservice';

let router = express.Router();

/**
 * Return the chain info using the EosService class
 */
router.get('/chaininfo', async (req, res, next) => {

  let Eos = new EosService();
  let chaininfo = await Eos.getChainInfo();
  
  if (!chaininfo) {
    res.status(500).send('Unable to load chain info.')
  } else {
    res.json(chaininfo);
  }
 
});

/**
 * Return the block info using the EosService class
 */
router.get('/chaininfo/:blockid', async (req, res, next) => {

  if (!req.params.blockid) {
    res.status(500).send('Unable to load block info.')
  } else {

    let Eos = new EosService();
    let blockInfo = await Eos.getBlockInfo(req.params.blockid);
    
    res.json(blockInfo);
  }
 
});

/**
 * Return the ABI for the specified account
 */
router.get('/abi/:accountid', async (req, res, next) => {

  if (!req.params.accountid) {
    res.status(500).send('Unable to load ABI info.')
  } else {

    
    let Eos = new EosService();
    let abi_info = await Eos.getAbi(req.params.accountid);
    
    res.json(abi_info);
  }
 
});

export default router;
