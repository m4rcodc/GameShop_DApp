AppHeader = {
    web3Provider: null,
    contracts: {},


    init: async () => {
        return await AppHeader.initWeb3();        
    },
  
    initWeb3: async function() {
      
      // Modern dapp browsers...
  if (window.ethereum) {
    AppHeader.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });;
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    AppHeader.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    AppHeader.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(AppHeader.web3Provider);
  
  console.log("Sono in initWeb3");
      return await AppHeader.initContract();
    },
  
    initContract: async function() {
      
    await $.getJSON('TutorialToken_AC.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var ProductArtifact = data;
        AppHeader.contracts.TutorialToken_AC = TruffleContract(ProductArtifact);
      
        // Set the provider for our contract
        AppHeader.contracts.TutorialToken_AC.setProvider(AppHeader.web3Provider);

      });
      
  
      return AppHeader.verifyAdmin();
    },

    verifyAdmin: async () => {
        let productInstance;

        await web3.eth.getAccounts(function(error, accounts) {
            
            if (error) {
                console.log(error);
            }
            
            console.log('Sono qui before function');
            const account = accounts[0];
            AppHeader.contracts.TutorialToken_AC.deployed().then(function(instance) {
                productInstance = instance;

                return productInstance.isAdmin(account);

            }).then(function(result) {
                console.log('Sono qui');
                console.log(result);
                if(result != true)
                $(".create_hiding").hide();
                else
                $(".create_hiding").show();

            }).catch(function(err) {
                alert("Error in the event" + err)
            });

        });

    }
}
$(function() {
    $(window).load(function() {
        AppHeader.init();
    });
});