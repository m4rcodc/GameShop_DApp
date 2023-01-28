var GST_Token = artifacts.require("GST_Token");

module.exports = function(deployer) {
  deployer.deploy(GST_Token, 'GameShopToken', 'GST', '1000000');

};