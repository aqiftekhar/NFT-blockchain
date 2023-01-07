const NFTMarket = artifacts.require("NFTMarket");

contract("NFTMarket", (accounts) => {
  let _contract = null;

  before(async () => {
    _contract = await NFTMarket.deployed();
  });

  describe("Mint Token", async () => {
    const _tokenURI = "https://test.com"
    before(async() => {
        await _contract.mintToken(_tokenURI, {
            from: accounts[0]
        });
    })
    it("Owner of the token should be account zero", async() => {
        const owner = await _contract.ownerOf(1);

      assert(owner == accounts[0], "Owner is not zero");
      assert.equal(owner, accounts[0], "Owner is not zero");
    });

  });
});
