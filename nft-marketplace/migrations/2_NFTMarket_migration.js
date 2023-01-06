const NFTMarket = artifacts.require("NFTMarket");

module.exports = (deployer) => {
    deployer.deploy(NFTMarket);
}