// SPDX-License-Identifier: MIT
/* 
    essa versao vai mudar
 */
pragma solidity ^0.8.2;

contract Impactov01 {
    
    mapping(address => bool) etapasCompletas;

    constructor () payable {}
    // vai sair daqui, onde vamos colocar? ideiasss
    struct Etapa {
        address payable ong;
        string text;
        uint256 cost;
        bool completed;
    }

    Etapa[] public etapas;

    function create(string calldata _text, uint256 _cost) public {
        etapas.push(Etapa(
            {
            ong: payable(msg.sender),
            text: _text,
            cost: _cost ,
            completed: false
            }));
    }


    // como podemos pensar para que isso possa existir? nao vejo ser uma boa! somente se for adicionado algum snapshot para verificar essa mudanca
/*     function update(uint _index, string memory _text) public {
        Etapa storage etapa = etapas[_index];
        etapa.text = _text;
    } */

    function etapaConcluida(uint _index) public  { // precisamos ter um modifier que somente a ONG X possa chamar essa funcao
        /*require( 
            como vamos verificar se etapa foi concluida?
            vamos delimitar um tempo?
            );
        */
        Etapa storage etapa = etapas[_index];
        etapa.completed = !etapa.completed;
    }

    // essa eh uma funcao segura? qual pode ser a vulnerabildade? 
    function doar(uint _index) public payable {
        Etapa storage etapa = etapas[_index];
        require(msg.value >= etapa.cost, "valor invalido");
        address payable x = etapa.ong;
        sendViaCall(x);

    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }


    receive() external payable {}
}