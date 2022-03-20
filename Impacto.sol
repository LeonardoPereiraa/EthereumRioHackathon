// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Impacto {

    struct Etapa {
        uint128 stepId;
        string text;
        uint256 cost;
        address donor; // é diferente de address(0) se alguém doar apenas para a etapa
    }

    struct Projeto {
        bool concluded;
        string projectName;
        address payable ongAddress;
        uint128 quantEtapas;
        uint256 totalCost;
        address donor; // é diferente de address(0) se alguém doar para o projeto todo
    }

    mapping(uint128 => Projeto) private projetos;
    mapping(uint128 => Etapa[]) private etapas;
    mapping(uint128 => uint128) quantEtapasConcluidas; // armazena a quantidade de etapas concluídas de cada projeto
    uint128[] private indexOf; // guarda os identificadores dos projetos

    address[] private doadores; // lista de doadores
    mapping (address => mapping (uint128 => uint256)) valorDoado; // quanto um doador x doou para um projeto y

    constructor() payable {}

    receive() external payable {}
    
    modifier onlyOng(uint128 id){
        require(projetos[id].ongAddress == msg.sender, "Not permitted");
        _;
    }

    modifier availableToPay(uint128 id){
        require(!projetos[id].concluded, "Not available");
        _;
    }

    function createProject(
        string calldata _projectName,
        address payable _ongAddress,
        uint128 _quantTotalEtapas,
        string[] calldata _text,
        uint256[] calldata _cost
    ) external {
        require(msg.sender == _ongAddress, "Not permitted");
        uint128 id = uint128(indexOf.length);
        projetos[id].projectName = _projectName;
        projetos[id].ongAddress = _ongAddress;
        projetos[id].quantEtapas = _quantTotalEtapas;
        createSteps(id, _quantTotalEtapas, _text, _cost);
        quantEtapasConcluidas[id] = 0;
        indexOf.push(id);
        //emit eventCreateProject(  projetos[id].ongAddress,projetos[id].quantEtapas,quantEtapasConcluidas[id]);
    }

    function createSteps(uint128 id, uint128 _quantTotalEtapas, string[] calldata _text, uint256[] calldata _cost) private {
        require(_quantTotalEtapas == _text.length && _quantTotalEtapas == _cost.length, "Valores");
        uint256 _totalCost;
        for(uint128 i = 0; i < _quantTotalEtapas; i++){
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

    function isConcluded(uint128 id) public view returns (bool) {
        return projetos[id].concluded;
    }


    //metodos get, cancel?, eventos

    //function getProjects() returns (uint128[]){
        //return indexOf;
    //}

    // essa eh uma funcao segura? qual pode ser a vulnerabildade? 
    function donation(uint128 projectId, uint128 stepId, bool payment) external availableToPay(projectId) payable { // false - paga o projeto inteiro; true - paga uma etapa
        if (payment){
            require(msg.value >= etapas[projectId][stepId].cost, "Insufficient funds");
            address payable x = projetos[projectId].ongAddress;
            sendViaCall(x);
            etapas[projectId][stepId].donor = msg.sender;
            quantEtapasConcluidas[projectId]++;
        } else {
            require(msg.value >= projetos[projectId].totalCost, "Insufficient funds");
            address payable x = projetos[projectId].ongAddress;
            sendViaCall(x);
            projetos[projectId].donor = msg.sender;
            quantEtapasConcluidas[projectId] = projetos[projectId].quantEtapas;
        }

        doadores.push(msg.sender);
        valorDoado[msg.sender][projectId] += msg.value;
        
        if(projetos[projectId].quantEtapas == quantEtapasConcluidas[projectId]){
            projetos[projectId].concluded = true;
        }
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
