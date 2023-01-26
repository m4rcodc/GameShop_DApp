App = {
  web3Provider: null,
  contracts: {},
//test
  init: async function() {

    // Load pets.
    $.getJSON('../product.json', function(data) {
      var productRow = $('#productRow');
      var productTemplate = $('#productTemplate');
    
      for (i = 0; i < data.length; i ++) {
        productTemplate.find('img').attr('src', data[i].picture);
        productTemplate.find('.product-name').text(data[i].name);
        productTemplate.find('.product-price').text(data[i].prezzo + ' GST');
        productTemplate.find('.product-console').text(data[i].console);
        productTemplate.find('.btn-adopt').attr('data-prezzo', data[i].prezzo);
        productTemplate.find('.btn-modify').attr('data-id', data[i].id);
        productTemplate.find('.btn-modify').attr('data-prezzo', data[i].prezzo);
        productTemplate.find('.btn-modify').attr('data-console', data[i].console);
        productTemplate.find('.btn-modify').attr('data-name', data[i].name);
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

      reloadBalance();

      // Use our contract to retrieve and mark the adopted pets
     //return App.markAdopted(); //?
    });
    //return App.bindEvents();
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
        AppHeader.contracts.TutorialToken_AC.deployed().then(function(instance) {
            productInstance = instance;

            return productInstance.isAdmin(account);

        }).then(function(result) {
          
          if(result != true){
            console.log('I am here 1');
            $('.btn-modify').css('display', 'none')
          }
          else {
            $('.btn-modify').css('display', 'inline')
          }

        }).catch(function(err) {
            alert("Error in the event" + err)
        });

    });

    return App.bindEvents();

},

  bindEvents: function() {
    console.log("Sono in bindEvents");
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-modify', App.handleModify);
    $(document).on('click', '.btn-confirmModify', App.handleConfirmModify);
   
  },

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
        return contractInstance.buyProduct(price, {from : account});
      }).then(function(result) {
        // return App.markAdopted();
        
        console.log("Trasferimento riuscito");
        reloadBalance();
        
      }).catch(function(err) {
        console.log(err.message);
      });

    });    
  },

  handleModify:  function(event) {
    event.preventDefault();
    //console.log("Sono in handleModify");
    var id = parseInt($(event.target).data('id'));
    var priceProduct = parseInt($(event.target).data('prezzo'));
    var consoleProduct = $(event.target).data('console');
    var nameProduct = $(event.target).data('name');
    
    console.log(nameProduct + " prezzo: " + priceProduct + " Console:" + consoleProduct);

    nameMd.value = nameProduct;
    priceMd.value = priceProduct;
    consoleMd.value = consoleProduct;

  },

  handleConfirmModify: function(event) {


    event.preventDefault();

    var nameProduct = nameMd.value;
    var priceProduct = priceMd.value;
    var consoleProduct = consoleMd.value;
    

  $.getJSON("../product.json", function(data) {
        
    data[0].name = 'Prova';
    const jsonString = JSON.stringify(data);
    jsonStrin
    console.log(jsonString);
    
})
  } 
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

    App.contracts.TutorialToken_AC.deployed().then(function(instance) {
      contractInstance = instance;
    
      // Execute adopt as a transaction by sending account
      return contractInstance.balanceOf(account, {from: account});
    }).then(function(result) {
      // return App.markAdopted();
      console.log("Il saldo è "+ result);
  
      accountBalance.text(result.toFixed(2) + ' GST');

    }).catch(function(err) {
      console.log(err.message);
    });

  }); 
}

function openModal() {
  console.log("Sono in openModal");
  document.getElementById("modal-form").classList.add("show");
}

function closeModal() {
  document.getElementById("modal-form").classList.remove("show");
}

function updateProduct() {

}



