// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Impacto {

    struct Etapa {
        uint128 stepId;
        string text;
        uint256 cost;
        address donor; // if address(0) no completed
    }

    struct Projeto {
        bool concluded;
        string projectName;
        address payable ongAddress;
        uint128 quantEtapas;
        uint256 totalCost;
    }

    mapping(uint128 => Projeto) private projetos;
    mapping(uint128 => Etapa[]) private etapas;
    mapping(uint128 => uint128) quantEtapasConcluidas; // armazena a quantidade de etapas concluídas de cada projeto
    uint128[] private indexOf; // guarda os identificadores dos projetos

    constructor () payable {}
    
    modifier onlyOng(uint128 id){
        require(projetos[id].ongAddress == msg.sender, "Not permitted");
        _;
    }

    function createProject(
        string calldata _projectName,
        address payable _ongAddress,
        uint128 _quantTotalEtapas,
        uint128 length,
        string[] calldata _text,
        uint256[] calldata _cost
    ) external {
        require(msg.sender == _ongAddress, "Not permitted");
        uint128 id = uint128(indexOf.length);
        projetos[id].concluded = false;
        projetos[id].projectName = _projectName;
        projetos[id].ongAddress = _ongAddress;
        projetos[id].quantEtapas = _quantTotalEtapas;
        createSteps(id, length, _text, _cost);
        quantEtapasConcluidas[id] = 0;
        indexOf.push(id);
    }

    function createSteps(uint128 id, uint128 length, string[] calldata _text, uint256[] calldata _cost) private {
        uint256 _totalCost;
        for(uint128 i=0; i < length; i++){
            _totalCost += _cost[i];
            etapas[id].push( Etapa (
                {
                    stepId: i,
                    text: _text[i],
                    cost: _cost[i],
                    donor: address(0)
                }));
        }
        projetos[id].totalCost = _totalCost;
    }

    //function changeVisibility(uint128 id, uint128 _status) public onlyOng(id) { // only ong modifier
        //projetos[id].projectStatus = _status;
    //}

    function isConcluded(uint128 id) public view returns (bool) {
        return projetos[id].concluded;
    }

    //TODO:
    //function etapaConcluida(uint128 id, uint128 stepId) public onlyOng(id) {
    function etapaConcluida(uint128 id) public onlyOng(id) {
        if(projetos[id].quantEtapas == quantEtapasConcluidas[id]){
            projetos[id].concluded = true;
        }
    }
}
