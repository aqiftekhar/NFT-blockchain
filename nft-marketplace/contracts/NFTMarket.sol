// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    //All token ids in array
    uint256[] private _allNfts;

    mapping(string => bool) private _usedtokenURI;
    mapping(uint => NFTItem) private _idToNFTItem;
    mapping(uint => uint) private _idToNftIndex;

    mapping (address => mapping(uint => uint)) private _ownedTokens;
    mapping(uint => uint) private _idToOwnIndex;

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

    function totalSupply() public view returns(uint) {
        return _allNfts.length;
    }
    function tokenByIndex(uint index) public view returns(uint){
        require(index < totalSupply(), "index out of bound");
        return _allNfts[index];
    }

    function tokenOfOwnerByIndex(address owner, uint index) public view returns(uint){
        require(index < ERC721.balanceOf(owner), "index out of bound");
        return _ownedTokens[owner][index];
    }

    //Before transfer token function always exectures after the minting
    function _beforeTokenTransfer(address from, address to, uint tokenId, uint batchSize) internal virtual override{
        if(batchSize == 0){
            batchSize = 1;
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        //if Address is zero means we are minting the token
        if (from == address(0)) {
            _AddTokenToAllTokensEnumeration(tokenId);
        } else {
            
        }
        if(to != from){
            _AddTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _AddTokenToAllTokensEnumeration(uint tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }

    function _AddTokenToOwnerEnumeration(address to, uint tokenId) private {
        uint _length = ERC721.balanceOf(to);

        _ownedTokens[to][_length] = tokenId;
        _idToOwnIndex[tokenId] = _length;
    }

    function getOwnedNFTs() public view returns (NFTItem[] memory) {
        uint ownedItemsCount = ERC721.balanceOf(msg.sender);
        NFTItem[] memory items = new NFTItem[](ownedItemsCount);

        for (uint256 i = 0; i < ownedItemsCount; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);

            NFTItem storage item = _idToNFTItem[tokenId];
            items[i] = item;
        }
        return items;
    }

    function getAllNftItemsOnSale() public view returns(NFTItem[] memory) {
        uint allItemscount = totalSupply();
        uint currentIndex = 0;
        NFTItem[] memory items = new NFTItem[](_listedItems.current());

        for (uint i = 0; i < allItemscount; i++) {
            uint tokenId = tokenByIndex(i);
            NFTItem storage item = _idToNFTItem[tokenId];

            if(item.isListed == true) {
                items[currentIndex] = item;
                currentIndex += 1;
            }

        }
        return items;
    }
}