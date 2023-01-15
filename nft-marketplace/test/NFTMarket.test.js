const NFTMarket = artifacts.require("NFTMarket");
const { ethers } = require("ethers");

contract("NFTMarket", (accounts) => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.1").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NFTMarket.deployed();
  });

  describe("Mint Token", async () => {
    const _tokenURI = "https://test.com";
    before(async () => {
      await _contract.mintToken(_tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });
    it("Owner of the token should be account zero", async () => {
      const owner = await _contract.ownerOf(1);

      assert(owner == accounts[0], "Owner is not zero");
      assert.equal(owner, accounts[0], "Owner is not zero");
    });

    it("First token should point to the correct TokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert(actualTokenURI == _tokenURI, "Token URI is not correct");
    });

    it("Should not create token with existing URI", async () => {
      try {
        await _contract.mintToken(_tokenURI, _nftPrice, {
          from: accounts[0],
          value: _listingPrice,
        });
      } catch (error) {
        assert(error, "NFT was minted with previosuly used URI");
      }
    });

    it("Should have one listed item", async () => {
      const _itemsCount = await _contract.getListeItemsCount();
      console.log("_listedItemsCount : ", _itemsCount.toNumber());
      assert(_itemsCount.toNumber() == 1, "Items length is not one");
    });

    it("Should have create NFT item", async () => {
      const _nftItem = await _contract.getNFTItem(1);
      // console.log(_nftItem);
      assert(_nftItem.tokenId == 1, "token Id is not equal");
      assert(_nftItem.price == _nftPrice, "NFT price is not same");
      assert(_nftItem.creator == accounts[0], "creator is not same");
      assert(_nftItem.isListed == true, "NFT is not Listed");
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNFT(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });
    it("Should unlist the item", async () => {
      const _listedItem = await _contract.getNFTItem(1);
      assert.equal(_listedItem.isListed, false, "Item is still listed");
    });
    it("Should decrease listed item count", async () => {
      const _listedItemsCount = await _contract.getListeItemsCount();
      console.log("_listedItemsCount : ", _listedItemsCount.toNumber());
      assert.equal(
        _listedItemsCount.toNumber(),
        0,
        "Listed item count has not been decremented"
      );
    });
    it("Should change the owner", async () => {
      const _currentOwner = await _contract.ownerOf(1);
      assert.equal(_currentOwner, accounts[1], "Owner has not been changed");
    });
  });

  describe("Token Transfers", () => {
    const tokenURI = "https://test-json2.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("Should have two NFTs created", async () => {
      const _totalSupply = await _contract.totalSupply();
      assert.equal(
        _totalSupply.toNumber(),
        2,
        "total supply of tokens is not correct"
      );
    });

    it("Should be abl to retrive NFT by index", async () => {
      const _nft_id_1 = await _contract.tokenByIndex(0);
      const _nft_id_2 = await _contract.tokenByIndex(1);
      assert.equal(
        _nft_id_1.toNumber(),
        1,
        "No NFT found at index one"
      );
      assert.equal(
        _nft_id_2.toNumber(),
        2,
        "No NFT found at Index two"
      );
    });
  });
});
