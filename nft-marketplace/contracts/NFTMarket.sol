// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    mapping(string => bool) private _usedtokenURI;
    mapping(uint => NFTItem) private _idToNFTItem;

    uint public _listingPrice = 0.025 ether;

    struct NFTItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

    event NFTItemCreated (
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );

    constructor() ERC721("CreaturesNFT", "CNFT"){}

    function mintToken(string memory tokenURI, uint price) public payable returns(uint) {

        require(!tokenURIExists(tokenURI), "Token URI already exists");
        require(msg.value == _listingPrice, "price must be equal to listing price");

        _tokenIds.increment();
        _listedItems.increment();

        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNFTItem(newTokenId, price);
        _usedtokenURI[tokenURI] = true;

        return newTokenId;
    }

    function buyNFT(uint tokenId) public payable{
        uint price = _idToNFTItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.sender != owner, "You already own this NFT");
        require(msg.value == price, "Please submit the requested price");

        //Unlist item first
        _idToNFTItem[tokenId].isListed = false;

        //Listeditem should be decremented now
        _listedItems.decrement();

        //Transfer ownership
        _transfer(owner, msg.sender, tokenId);

        //Pay to Owner
        payable(owner).transfer(msg.value);


    }
    function tokenURIExists(string memory tokenURI) public view returns(bool) {
        return _usedtokenURI[tokenURI] == true;
    }

    function _createNFTItem(uint tokenId, uint price) private {
        require(price > 0, "Price must be atleast 1 wei");

        _idToNFTItem[tokenId] = NFTItem(tokenId, price, msg.sender, true);
        emit NFTItemCreated(tokenId, price, msg.sender, true);
    }

    function getNFTItem(uint tokenId) public view returns(NFTItem memory){
        return _idToNFTItem[tokenId];
    }
    
    function getListeItemsCount() public view returns (uint) {
        return _listedItems.current();
        
    }
}