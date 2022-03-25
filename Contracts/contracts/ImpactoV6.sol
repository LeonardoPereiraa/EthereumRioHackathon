// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImpactoV6 is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string RevealeadURI = "ipfs://QmQYKXSUXvv1jGUGyuzJhsSFRageA7Brj7eUJxCkhpVJm6/metadata.json"; 
    string public baseExtension = ".json";
    uint256 public maxSupply = 10; //3000
    uint256 public maxMintAmount = 2; //1
    bool public paused = false;
    bool public revealed = false;
    mapping(address => uint256) public addressMintedBalance;

    constructor(
    ) ERC721("Teste Conexao Impacto", "IMP") {
        for(uint256 i = 1; i <= 5; i++) {
            mint(1);
        }
}

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return RevealeadURI;
    }

    //public
    function mint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0 && _mintAmount <= 1, "YOU CAN'T MINT MORE THAN AVALABLE TOKEN COUNT");
        require(supply + _mintAmount <= maxSupply, "YOU CAN'T MINT MORE THAN MAXIMUM SUPPLY");
        require( tx.origin == msg.sender, "CANNOT MINT THROUGH A CUSTOM CONTRACT");

        if(msg.sender != owner()) {
            require(addressMintedBalance[msg.sender] + _mintAmount <= maxMintAmount, "max NFT per address exceeded");
        }
        _safeMint(msg.sender, supply + 1);
        addressMintedBalance[msg.sender]++;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
        tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
        _exists(tokenId),
        "ERC721Metadata: URI query for nonexistent token"
        );
        
            return RevealeadURI;
    }

    //only owner
    
    function setmaxSupply(uint256 _newmaxSupply) public onlyOwner {
        maxSupply = _newmaxSupply;
    }


    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
    
    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

}