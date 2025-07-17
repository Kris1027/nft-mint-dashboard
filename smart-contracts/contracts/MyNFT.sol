// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage {
    uint256 public nextTokenId;
    address public admin;

    constructor() ERC721('MyNFT', 'MNFT') {
        admin = msg.sender;
    }

    function mint(address to, string memory tokenURI_) external {
        require(msg.sender == admin, "only admin can mint");
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        nextTokenId++;
    }
}
