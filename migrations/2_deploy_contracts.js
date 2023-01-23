var TutorialToken_AC = artifacts.require("TutorialToken_AC");

module.exports = function(deployer) {
  deployer.deploy(TutorialToken_AC, 'SimpleToken_AC', 'SIM_AC', '10000000000000000000000');

};