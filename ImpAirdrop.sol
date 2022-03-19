// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ImpactoAirdrop is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public MaxSupply = 20;
    //limite de nft por address
    uint256 public nftPerAddressLimit = 1;
    
    string public baseURI = "ipfs://";

    mapping(address => uint256) public addressMintedBalance;


    constructor() ERC721("ImpactoAirdrop", "IMP") {
        // para criadores, devs e giveaway
    for(uint256 i = 1; i < 6; i++){ 
        safeMint();
    }
    }

    function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
    }

    function safeMint() public {
        require(totalSupply() + 1 <= MaxSupply, "YOU CAN'T MINT MORE THAN MAXIMUM SUPPLY");
        require( tx.origin == msg.sender, "CANNOT MINT THROUGH A CUSTOM CONTRACT");
        if(msg.sender != owner()){
            require(addressMintedBalance[msg.sender]  < nftPerAddressLimit, "max NFT per address exceeded");
        }
        uint256 tokenId = _tokenIdCounter.current();
        addressMintedBalance[msg.sender]++;
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
