// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts@3.0.0/token/ERC721/ERC721.sol";

contract SimpleCollectible is ERC721 {
    uint256 public tokenCounter;
    address private owner;

    modifier onlyOwner(){
        require(owner == msg.sender, "Only owner can mint it");
        _;
    }

    constructor () public ERC721 ("Impacto", "IMP"){
        tokenCounter = 0;
        owner = msg.sender;
    }

    //function init(address contrato) public {
        //require(msg.sender == owner);
        //owner = 
    //}

    function mint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
    }

    function createCollectible(string memory tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter = tokenCounter + 1;
        return newItemId;
    }

}
