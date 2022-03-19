// SPDX-License-Identifier: MIT
/* 
    essa versao vai mudar
 */
pragma solidity ^0.8.2;

contract Impactov01 {
    // numero de vezes que um address doou
    //mapping(address => uint256) public doador;

    // vai sair daqui, onde vamos colocar? ideiasss

    //Etapa[] public etapas;

    struct Etapa {
        string text;
        uint256 cost;
        bool completed;
    }

    struct Projeto {
        string projectName;
        address ongAddress;
    }

    mapping(uint128 => Projeto) private projetos;
    mapping(uint128 => Etapa[]) private etapas;
    uint256[] private indexOf; // guarda os identificadores dos projetos

    constructor () payable {}

    //function create(string calldata _text, uint256 _cost) public {
    function create(uint128 id, uint128 length, string[] _text, uint256[] _cost) public {
        for(uint128 i=0;i<length;i++){
            etapas[id].push(Etapa(
                {
                    ong: payable(msg.sender),
                    text: _text[i],
                    cost: _cost[i],
                    completed: false
                }));
        }
        
    }

    // como podemos pensar para que isso possa existir? nao vejo ser uma boa! somente se for adicionado algum snapshot para verificar essa mudanca
/*     function update(uint _index, string memory _text) public {
        Etapa storage etapa = etapas[_index];
        etapa.text = _text;
    } */

    function etapaConcluida(uint _index) public { // precisamos ter um modifier que somente a ONG X possa chamar essa funcao
        /*require( 
            como vamos verificar se etapa foi concluida?
            vamos delimitar um tempo?
            );
        */
        Etapa storage etapa = etapas[_index];
        etapa.completed = !etapa.completed;
        nEtapas[msg.sender]++;
    }

    // essa eh uma funcao segura? qual pode ser a vulnerabildade? 
    function doar(uint _index) public payable {
        Etapa storage etapa = etapas[_index];
        require(msg.value >= etapa.cost, "valor invalido");
        address payable x = etapa.ong;
        sendViaCall(x);
        doador[msg.sender]++;

    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }


    receive() external payable {}
}
