import { Api, JsonRpc, RpcError } from 'eosjs';

const fetch = require('node-fetch');    

/**
 * Provides a class to interact with the EosJS library to build data sets
 */
class EosService {

  constructor() {
    this.EosRpc =  new JsonRpc('http://jungle2.cryptolions.io:', {fetch});
  }

  /**
   * Returns the info about the block chain
   */
  async getChainInfo(){

    try{
      
      let chainInfo =  await this.EosRpc.get_info();
      return chainInfo;

    }catch(err){
      console.log("Error Getting Chain Info", err);
    }

  }

  /**
   * Returns an array of the last 10 blocks from the head block of the chain
   * @param {number} blockid 
   */
  async getBlockInfo(blockid){
    
    let blocks = [];

    try{

      for (let i = blockid - 9; i <= blockid; i++) {
        let blockInfo = await this.EosRpc.get_block(i);
        blocks.push(blockInfo);
      }

      return blocks;

    }catch(err){
      console.log("Error Getting Block Info", err);
    }
    
  }

}

export default EosService;