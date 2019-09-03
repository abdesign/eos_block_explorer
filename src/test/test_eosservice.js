import { assert, expect } from "chai";
import EosService from '../util/eosservice';

describe("Invoke the EOS JS to get chain and block info", () => {
    
    let Eos;
    let chain_info;
    let block_info;
    
    it('should instantiate EOS object', (done) => {
        Eos = new EosService();
        expect(Eos).to.be.a('object');
        done();
    });
    
    it('should give back chain info', async () => {
        chain_info = await Eos.getChainInfo();
        expect(chain_info).to.not.be.undefined;
        expect(chain_info).to.be.a('object');
    });

    it('should have the correct data in the chain info', (done) => {
        expect(chain_info.head_block_num).to.be.a('number');
        expect(chain_info.chain_id).to.be.a('string');
        expect(chain_info.head_block_id).to.be.a('string');
        expect(chain_info.last_irreversible_block_num).to.be.a('number');
        expect(chain_info.server_version_string).to.be.a('string');
        expect(chain_info.last_irreversible_block_id).to.be.a('string');
        expect(chain_info.virtual_block_cpu_limit).to.be.a('number');
        expect(chain_info.virtual_block_net_limit).to.be.a('number');
        expect(chain_info.block_cpu_limit).to.be.a('number');
        expect(chain_info.block_net_limit).to.be.a('number');
        done();
    });

    it('should return block info using the head block number from the chain', async () => {
        block_info = await Eos.getBlockInfo(chain_info.head_block_num);
        expect(block_info).to.not.be.undefined;
        expect(block_info).to.be.a('array');
    });

    it('should have the correct data in each block in the block array', (done) => {

        expect(block_info.length).to.be.gt(0);
        expect(block_info.length).to.equal(10);

        block_info.forEach((block) => {
            expect(block).to.be.a('object');
            expect(block.timestamp).to.be.a('string');
            expect(block.producer).to.be.a('string');
            expect(block.confirmed).to.be.a('number');
            expect(block.block_num).to.be.a('number');
            expect(block.id).to.be.a('string');
            expect(block.transactions).to.be.a('array');
        });

        done();

    });

});

