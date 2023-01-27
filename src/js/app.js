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
    
   await $.getJSON('TutorialToken_AC.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract

      var ProductArtifact = data;
      App.contracts.TutorialToken_AC = TruffleContract(ProductArtifact);
    
      // Set the provider for our contract
      App.contracts.TutorialToken_AC.setProvider(App.web3Provider);
    
      reloadBalance();

      loadProduct();

    });

    return App.verifyAdmin();
  
  },

  /*
  loadProductInPage: async () => {
    

  let contractInstance;
  var productRow = $('#productRow');
  var productTemplate = $('#productTemplate');

   // App.contracts.TutorialToken_AC = new web3.eth.Contract(App.data.abi, account);

   await web3.eth.getAccounts(function(error, accounts) {
        
    if (error) {
        console.log(error);
    }

    App.contracts.TutorialToken_AC.deployed().then(function(instance) {
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
        productTemplate.find('.product-price').text(result[i].prezzo + ' GST');
        productTemplate.find('.product-console').text(result[i].console);
        productTemplate.find('.btn-adopt').attr('data-prezzo', result[i].prezzo);
        productTemplate.find('.btn-modify').attr('data-id', result[i].id);
        productTemplate.find('.btn-modify').attr('data-prezzo', result[i].prezzo);
        productTemplate.find('.btn-modify').attr('data-console', result[i].console);
        productTemplate.find('.btn-modify').attr('data-name', result[i].name);
        productRow.append(productTemplate.html());
      }
    

    }).catch(function(err) {
      console.log(err.message);
      console.log('Errore');
    });
  });

  },
*/
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
    id = parseInt($(event.target).data('id'));
    var priceProduct = parseInt($(event.target).data('prezzo'));
    var consoleProduct = $(event.target).data('console');
    var nameProduct = $(event.target).data('name');
    
    console.log(nameProduct + " prezzo: " + priceProduct + " Console:" + consoleProduct);

    console.log("id" + id);

    nameMd.value = nameProduct;
    priceMd.value = priceProduct;
    consoleMd.value = consoleProduct;
  
  },

  handleConfirmModify: function(event) {

    event.preventDefault();

    var nameProduct = nameMd.value;
    var priceProduct = priceMd.value;
    var consoleProduct = consoleMd.value;

    var contractInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];

      App.contracts.TutorialToken_AC.deployed().then(function(instance) {
        contractInstance = instance;
          

        return contractInstance.modifyProdId(id,nameProduct,priceProduct,consoleProduct, {from: account});
      }).then(function(result) {
        
        console.log("Modifica riuscita");
        
      }).catch(function(err) {
        console.log(err.message);
      });

    });


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

   // App.contracts.TutorialToken_AC = new web3.eth.Contract(App.data.abi, account);

    web3.eth.getAccounts(function(error, accounts) {
        
    if (error) {
        console.log(error);
    }

    App.contracts.TutorialToken_AC.deployed().then(function(instance) {
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
        productTemplate.find('.btn-adopt').attr('data-prezzo', result[i].price);
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

function retrieveArrayLenght(){

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }
  
    var account = accounts[0];

    App.contracts.TutorialToken_AC.deployed().then(function(instance) {
      contractInstance = instance;
    
      // Execute adopt as a transaction by sending account
      return contractInstance.getLenghtProduct({from: account}).call();
    }).then(function(result) {
      // return App.markAdopted();
      console.log("Il numero di prodotti è "+ result);
      return result;


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



