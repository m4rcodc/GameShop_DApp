var TutorialToken_AC = artifacts.require("TutorialToken_AC");

module.exports = function(deployer) {
  deployer.deploy(TutorialToken_AC, 'GameShopToken', 'GST', '1000000');

};