let id;

App = {
  web3Provider: null,
  contracts: {},
//test

  init: async () => {

    return await App.initWeb3();
  },

  initWeb3: async () => {
    
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
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
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);
    return await App.initContract();
  },

  initContract: async function() {
    
   await $.getJSON('GST_Token.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract

      var ProductArtifact = data;
      App.contracts.GST_Token = TruffleContract(ProductArtifact);
    
      // Set the provider for our contract
      App.contracts.GST_Token.setProvider(App.web3Provider);
    
      reloadBalance();

      loadProduct();

    });

    return App.verifyAdmin();
  
  },

  verifyAdmin: async () => {
    let productInstance;

    await web3.eth.getAccounts(function(error, accounts) {
        
        if (error) {
            console.log(error);
        }
        
        console.log('Sono qui in verifyAdmin');
        const account = accounts[0];
        AppHeader.contracts.GST_Token.deployed().then(function(instance) {
            productInstance = instance;

            return productInstance.isAdmin(account);

        }).then(function(result) {
          
        }).catch(function(err) {
            alert("Error in the event" + err)
        });

    });

    return App.bindEvents();

},

  bindEvents: function() {
    console.log("Sono in bindEvents");
    $(document).on('click', '.btn-buyProd', App.handleBuyProduct);
  },

  handleBuyProduct:  function(event) {
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

      App.contracts.GST_Token.deployed().then(function(instance) {
        contractInstance = instance;


        // Execute adopt as a transaction by sending account
        return contractInstance.buyProduct(price, {from : account});
      }).then(function(result) {
        // return App.markAdopted();
        
        alert("Acquisto riuscito");
        reloadBalance();
        
      }).catch(function(err) {
        alert("Acquisto non riuscito, token insufficienti");
        console.log(err.message);
      });

    });    
  },
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});

function reloadBalance(){

  var contractInstance;
  var accountBalance = $('#balance');

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }
  
    var account = accounts[0];

    App.contracts.GST_Token.deployed().then(function(instance) {
      contractInstance = instance;
    
      // Execute adopt as a transaction by sending account
      return contractInstance.balanceOf(account, {from: account});
    }).then(function(result) {
      // return App.markAdopted();
      console.log("Il saldo è "+ result);
  
      accountBalance.text(result + ' GST');

    }).catch(function(err) {
      console.log(err.message);
    });

  }); 
}



function  loadProduct()  {

  let contractInstance;
  var productRow = $('#productRow');
  var productTemplate = $('#productTemplate');


    web3.eth.getAccounts(function(error, accounts) {
        
    if (error) {
        console.log(error);
    }

    App.contracts.GST_Token.deployed().then(function(instance) {
      contractInstance = instance;
    
      // Execute adopt as a transaction by sending account
      var account = accounts[0];
      
      console.log('I am here');
      return contractInstance.getAllProduct.call({from: account});
    }).then(function(result) {
      console.log(result);
      var length = result.length;


      for (var i = 0; i < length; i++) {
        productTemplate.find('img').attr('src', result[i].picture);
        productTemplate.find('.product-name').text(result[i].name);
        productTemplate.find('.product-price').text(result[i].price + ' GST');
        productTemplate.find('.product-console').text(result[i].console);
        productTemplate.find('.btn-buyProd').attr('data-prezzo', result[i].price);
        productTemplate.find('.btn-modify').attr('data-id', result[i].id);
        productTemplate.find('.btn-modify').attr('data-prezzo', result[i].price);
        productTemplate.find('.btn-modify').attr('data-console', result[i].console);
        productTemplate.find('.btn-modify').attr('data-name', result[i].name);
        productRow.append(productTemplate.html());
      }
    

    }).catch(function(err) {
      console.log(err.message);
      console.log('Errore');
    });
  });
 
}






