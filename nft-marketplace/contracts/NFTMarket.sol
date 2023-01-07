// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    mapping(string => bool) private _usedtokenURI;

    constructor() ERC721("CreaturesNFT", "CNFT"){}

    function mintToken(string memory tokenURI) public payable returns(uint) {

        require(!tokenURIExists(tokenURI), "Token URI already exists");

        _tokenIds.increment();
        _listedItems.increment();

        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _usedtokenURI[tokenURI] = true;

        return newTokenId;
    }

    function tokenURIExists(string memory tokenURI) public view returns(bool) {
        return _usedtokenURI[tokenURI] == true;
    }

    
}