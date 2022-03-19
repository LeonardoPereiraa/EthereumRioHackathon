// SPDX-License-Identifier: MIT
/* 
    essa versao vai mudar
 */
pragma solidity ^0.8.2;
// todo criar eventos 
contract Impactov01 {
    
    mapping(address => bool) etapasCompletas;
    enum status { inCreation, inProgress, concluded } 
    
    constructor () payable {}
    // vai sair daqui, onde vamos colocar? ideiasss
    struct Etapa {
        string text;
        uint256 cost;
        bool completed;
    }
    struct projeto{
        uint256 id;
        address payable ong;
        status projectStatus;
        string projectName;        
    } 
    mapping(uint256 => Etapa[])etapas;
    mapping(uint256 => projeto)projetos;
    uint256 count;
    function createProject(string memory name) public {
        projetos[count].projectName = name;
        count++;
    }
    function create(string calldata _text, uint256 _cost,uint256 id) public {
        etapas[id].push(Etapa(
            {
            
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
//todo adicionar um mapping para verificar que foi concluida
    function etapaConcluida(uint _index, uint256 id ) public  { // precisamos ter um modifier que somente a ONG X possa chamar essa funcao
        /*require( 
            como vamos verificar se etapa foi concluida?
            vamos delimitar um tempo?
            );
        */
        Etapa storage etapa = etapas[id][_index];
        etapa.completed = !etapa.completed;
    }

    // essa eh uma funcao segura? qual pode ser a vulnerabildade? 
    function doar(uint _index,uint256 id) public payable {
        Etapa storage etapa = etapas[id][_index];
        require(msg.value >= etapa.cost, "valor invalido");
        address payable x = projetos[id].ong;
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
