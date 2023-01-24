App = {
  web3Provider: null,
  contracts: {},
//test
  init: async function() {
    // Load pets.
    $.getJSON('../product.json', function(data) {
      var productRow = $('#productRow');
      var productTemplate = $('#productTemplate');
      var accountBalance = $('#balance');
  
      
      var contractInstance;

    
      for (i = 0; i < data.length; i ++) {
        productTemplate.find('img').attr('src', data[i].picture);
        productTemplate.find('.product-name').text(data[i].name);
        productTemplate.find('.product-price').text(data[i].prezzo);
        productTemplate.find('.product-console').text(data[i].console);
        //productTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        productTemplate.find('.btn-adopt').attr('data-prezzo', data[i].prezzo);

        productRow.append(productTemplate.html());
      }

    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);



console.log("Sono in initWeb3");
    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON('TutorialToken_AC.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ProductArtifact = data;
      App.contracts.TutorialToken_AC = TruffleContract(ProductArtifact);
    
      // Set the provider for our contract
      App.contracts.TutorialToken_AC.setProvider(App.web3Provider);

  
    
      // Use our contract to retrieve and mark the adopted pets
     //return App.markAdopted(); //?
    });
    

    return App.bindEvents();
  },

  bindEvents: function() {
    console.log("Sono in bindEvents");
    $(document).on('click', '.btn-adopt', App.handleAdopt);
   // $(document).on('click', '.btn-admin', App.handleTransferAdmin);
  }, 

/*
  handleTransferAdmin: function(event) {
    event.preventDefault();
    
    console.log(event.target.value);
    console.log(event.target);

    
    
  
    var contractInstance;

    web3.eth.getAccounts(function(error, accounts) {


      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];


    }); 
    
  },

  */
 

  handleAdopt:  function(event) {
    event.preventDefault();
    console.log("Sono in handleAdopt");
   // var petId = parseInt($(event.target).data('id'));
    var price = parseInt($(event.target).data('prezzo'));
    console.log("Il prezzo selezionato è: " + price);

    var contractInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];



      App.contracts.TutorialToken_AC.deployed().then(function(instance) {
        contractInstance = instance;
      
        // Execute adopt as a transaction by sending account
        return contractInstance.tran(account,price, {from: account});
      }).then(function(result) {
        // return App.markAdopted();
        console.log("Trasfer success");
  
        
      }).catch(function(err) {
        console.log(err.message);
      });

    });    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

