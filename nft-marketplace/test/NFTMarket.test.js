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
        value: _listingPrice
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
          value: _listingPrice
        });
      } catch (error) {
        assert(error, "NFT was minted with previosuly used URI");
      }
    });

    it("Should have one listed item", async () => {
      const _itemsCount = await _contract.getListeItemsCount();

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
});
