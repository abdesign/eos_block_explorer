import { Api, JsonRpc, RpcError } from 'eosjs';

const fetch = require('node-fetch');    

/**
 * Provides a class to interact with the EosJS library to build data sets
 */
class EosService {

  constructor() {
    //this.EosRpc =  new JsonRpc('http://jungle2.cryptolions.io:', {fetch});
    this.EosRpc =  new JsonRpc('https://api.eosnewyork.io', {fetch});
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

  /**
   * Returns the ABI object for the specified account id
   * @param {number} accountid 
   */
  async getAbi(accountid){
    
    let blocks = [];

    try{
      console.log("EOS SERVICE ABI",accountid)
      let abi_info = await this.EosRpc.get_abi(accountid);
      
      return abi_info;

    }catch(err){
      console.log("Error Getting Block Info", err);
    }
    
  }

}

export default EosService;