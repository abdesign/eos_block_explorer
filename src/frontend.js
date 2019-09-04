import moment from 'moment';
import prettyHtml from 'json-pretty-html';
import mustache from 'mustache';
import MarkdownIt from 'markdown-it';
//const MarkdownIt = require('markdown-it');


/**
 * Renders a mustache template
 * 
 * @param {string} target_id id or class of the element to place rendered template into
 * @param {string} template_name name of the template file without extension
 * @param {object} template_data object containing the template variables to be rendered
 * @param {boolean} append flag to append instead of replace
 */
const loadTemplate = (target_id, template_name, template_data, append = false, cb = false) => {
    try{
        
        $.get('/templates/'+template_name+'.mustache', (template) => {
            
            let html = mustache.render(template, template_data);

            if(append === true){
                $(target_id).append(html);
            }else{
                $(target_id).html(html);
            }

            if(typeof cb === 'function') {
                cb();
            }

        }).fail((jqxhr, textStatus, error) => {
            console.log("Get Template File Request Failure", error);
        });

    }catch(err){
        console.log("Problem Loading Template", err);
    }

    
}

/**
 *  Rerieve the chain info from the API and set the initial table data
 */
const getChainInfo = () => {

    try{

        $.getJSON( '/api/chaininfo',  ( data ) => {

            let head_block_time = moment(data.head_block_time).format('MM/DD/YYYY, h:mm:ss a [UTC]')
            let template_data = {data : data, head_block_time : head_block_time};

            loadTemplate('#chain-info-container','chain_info', template_data, false);

            $('#load-btn').click(() => {
                getChainInfo();
            });

            getLatestBlocks(data.head_block_num);

        }).fail((jqxhr, textStatus, error) => {
            console.log("Json Request Failure", error);
        });

    }catch(err){
        console.log(err);
    }
    
}

/**
 * Retrieve the Latest 10 Blocks from the API
 * @param {number} blockid 
 */
const getLatestBlocks = (blockid) => {

    $('#table-block-list tbody').html('');

    try{
        $.getJSON( '/api/chaininfo/'+blockid, ( data ) => {

            data.forEach((block) => {
                
                let actions_md = getActions(block.transactions);
 
                prepareBlockRow(block, actions_md);
                setRowEvents(block);

            });
            
        }).fail((jqxhr, textStatus, error) => {
            console.log("Json Request Failure", error);
        });

    }catch(err){
        console.log(err);
    }
}

/**
 * Prepares the contract info in markdown
 * @param {array} transactions 
 */
const getActions = (transactions) =>{

    let actions = "";
    let markdownit = new MarkdownIt();

    if(transactions instanceof Array && transactions.length > 0){

        transactions.forEach((trx) => { 

            let check_actions = (((trx||{}).trx||{}).transaction||{}).actions;

            if(typeof check_actions !== 'undefined'){

                let expiration = moment(trx.trx.transaction.expiration).format('MM/DD/YYYY, h:mm:ss a [UTC]')

                actions += markdownit.render("### "+trx.trx.id);
                actions += markdownit.render("Expires: "+expiration);

                check_actions.forEach((action) => {
                    actions += markdownit.render("**Account:** "+action.account);
                    actions += markdownit.render("- "+action.name);
                    actions += markdownit.render("---");
                });

            }

        });

    }

    return actions;
}



/**
 * Prepares the HTML for a Row containing the block data
 * @param {object} row_data 
 */
const prepareBlockRow = (row_data, actions_md) =>{

    let block_json_html = prettyHtml(row_data, row_data.dimensions);
    let timestamp = moment(row_data.timestamp).format('MM/DD/YYYY, h:mm:ss a [UTC]');
    let trans_count = (row_data.transactions instanceof Array ? row_data.transactions.length : 0 );
    let template_data = {row_data : row_data, timestamp : timestamp, trans_count : trans_count, actions_md: actions_md, block_json_html: block_json_html};

    loadTemplate('#table-block-list tbody','block_rows', template_data, true);

}

/**
 * Prepares the even listeners for the rows of a specific block
 * @param {object} row_data 
 */
const setRowEvents = (row_data) => {

    $(document).on('click', '#row-'+row_data.block_num, ()=> {
        if($('#row-hidden-'+row_data.block_num).hasClass("row-hidden")){
            $('#row-hidden-'+row_data.block_num).show().removeClass("row-hidden");
        }else{
            $('#row-hidden-'+row_data.block_num).hide().addClass("row-hidden");
        }
    });      

    $(document).on('click', '#row-hidden-'+row_data.block_num, ()=> {
        $('#row-hidden-'+row_data.block_num).hide().addClass("row-hidden");
    });

}

$(document).ready(() => {
    getChainInfo();
});

