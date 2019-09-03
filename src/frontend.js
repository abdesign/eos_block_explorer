import moment from 'moment';
import prettyHtml from 'json-pretty-html';

/**
 *  Rerieve the chain info from the API and set the initial table data
 */
const getChainInfo = () => {

    try{

        $.getJSON( '/api/chaininfo',  ( data ) => {

            let head_block_time = moment(data.head_block_time).format('MM/DD/YYYY, h:mm:ss a [UTC]')

            let tc = '<tr>';
            tc += '<td>'+data.server_version_string+'</td>';
            tc += '<td>'+data.chain_id+'</td>';
            tc += '<td>'+data.virtual_block_cpu_limit+'</td>';
            tc += '<td>'+data.virtual_block_net_limit+'</td>';
            tc += '<td>'+data.block_cpu_limit+'</td>';
            tc += '<td>'+data.block_net_limit+'</td>';
            tc += '</tr>';
        
            $('#chain-table-one tbody').html(tc);

            tc = '<tr>';
            tc += '<td>'+data.head_block_num+'</td>';
            tc += '<td>'+data.head_block_id+'</td>';  
            tc += '<td>'+head_block_time+'</td>';
            tc += '<td>'+data.head_block_producer+'</td>';
            tc += '</tr>';
        
            $('#chain-table-two tbody').html(tc);

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

    let tc = '';

    $('#table-block-list tbody').html('');

    try{
        $.getJSON( '/api/chaininfo/'+blockid, ( data ) => {
            
            $.each(data, (key, val) => {
                tc += prepareBlockRow(val);
                setRowEvents(val);
            });

            $('#table-block-list tbody').append(tc);
            
        }).fail((jqxhr, textStatus, error) => {
            console.log("Json Request Failure", error);
        });

    }catch(err){
        console.log(err);
    }
}

/**
 * Prepares the HTML for a Row containing the block data
 * @param {object} row_data 
 */
const prepareBlockRow = (row_data) =>{

    let block_json_html = prettyHtml(row_data, row_data.dimensions);
    let timestamp = moment(row_data.timestamp).format('MM/DD/YYYY, h:mm:ss a [UTC]');
    let trans_count = (row_data.transactions instanceof Array ? row_data.transactions.length : 0 );
    
    let tc = '<tr id="row-'+row_data.block_num+'">';
    tc += '<td>'+timestamp+'</td>';
    tc += '<td>'+row_data.producer+'</td>';
    tc += '<td>'+row_data.block_num+'</td>';
    tc += '<td>'+row_data.id+'</td>';
    tc += '<td>'+row_data.confirmed+'</td>';
    tc += '<td>'+trans_count+'</td>';
    tc += '</tr>';
    tc += '<tr class="row-content row-hidden" id="row-hidden-'+row_data.block_num+'">';
    tc += '<td colspan="6"><h3>Raw Block Info</h3>'+block_json_html+'</tr>';
    tc += '</tr>'

    return tc;

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

