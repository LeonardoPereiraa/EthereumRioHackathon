// SPDX-License-Identifier: MIT
/* 
    essa versao vai mudar
 */
pragma solidity ^0.8.2;

contract Doadores {

    address[] private doadores;
    mapping (address => mapping (uint128 => uint128)) valorDoado; // quanto um doador x doou para um projecto y

    constructor () payable {}

    // essa eh uma funcao segura? qual pode ser a vulnerabildade? 
    function donation(address ongAddress) external payable {
        Etapa storage etapa = etapas[_index];
        require(msg.value >= etapa.cost, "valor invalido");
        address payable x = etapa.ong;
        sendViaCall(x);
        doador[msg.sender]++;


        //setar etapa para address
    }

    //TODO:
    function cancel(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");
        require(block.timestamp < campaign.startAt, "started");

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }


    receive() external payable {}
}
