pragma solidity ^0.8.17;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TutorialToken_AC is ERC20, AccessControl {
   bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
   address _owner;
   uint _counterProd;

   struct Product {
    uint id;
    string picture;
    string name;
    uint price;
    string console;
}

    
  mapping (uint256 => Product) public products;

   constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply) ERC20(name, symbol) {
      _mint(msg.sender, initialSupply);
      _owner = msg.sender;
      _counterProd = 0;
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
      preloadProduct();
   }

   function preloadProduct() public{
      products[0] = Product(0, "images/GodOfWar.jpg", "God Of War Ragnarok", 70, "PlayStation 5");
      products[1] = Product(1, "images/MW2.jpg", "Call of Duty: Modern Warfare II", 75, "PlayStation 5");
      products[2] = Product(2, "images/Horizon.jpg", "Horizon: Forbidden West", 53, "PlayStation 5");
      products[3] = Product(3, "images/FarCry6.jpg", "Far Cry 6", 20, "Xbox Series X");
      products[4] = Product(4, "images/CallistoProtocol.jpg", "The Callisto Protocol", 55, "Xbox Series X");
      products[5] = Product(5, "images/Metro.jpg", "Metro Exodus", 30, "Xbox Series X");
      products[6] = Product(6, "images/MarioBros.jpg", "New Super Mario Bros", 50, "Nintendo Switch");
      products[7] = Product(7, "images/Pokemon.jpg",  "Pokemon Violetto ", 48, "Nintendo Switch");
      products[8] = Product(8, "images/AnimalCrossing.jpg", "Animal Crossing: New Horizons", 58, "Nintendo Switch");
      _counterProd = 9;
   }



   function getAllProduct() public view returns (Product[] memory) {
    
    Product[] memory result = new Product[](_counterProd);
    for (uint i = 0; i < _counterProd; i++) {
      result[i] = products[i];
    }

    return result;
}

   function modifyProdId(uint id, string memory name, uint price, string memory console) public soloAdmin 
   {

      Product memory x = products[id];
      Product memory p = Product(id, x.picture, name, price,console);
      products[id] = p;

   }

   function addProduct(string memory name,string memory picture, uint price, string memory console) public soloAdmin
   {
      Product memory p = Product(_counterProd, picture, name, price,console);
      products[_counterProd] = p;
      _counterProd++;

   }


   event Debug(address user, address sender, bytes32 role, bytes32 adminRole, bytes32 senderRole);
   event ChecksoloAdmin(address user);
   event ChecksoloMinters(address user);

   modifier soloAdmin() {
      emit ChecksoloAdmin(msg.sender);
      require(isAdmin(msg.sender), "Restricted to admins");
      _;
   }

   modifier soloMinters() {
      emit ChecksoloMinters(msg.sender);
      require(isMinter(msg.sender), "Caller is not a minter");
      _;
   }

   function buyProduct(uint256 amount) public virtual returns(bool) {
      return transfer(_owner, amount);

   }

   function isAdmin(address account) public virtual view returns (bool) {
      return hasRole(DEFAULT_ADMIN_ROLE, account);
   }

   function isMinter(address account) public virtual view returns (bool) {
      return hasRole(MINTER_ROLE, account);
   }

   function showOwner() public virtual view returns(address){
      return _owner;
   }

   function mint(address to, uint256 amount) public soloMinters {
      _mint(to, amount);
    }

    function addMinterRole(address to) public soloAdmin {
      emit Debug(to, msg.sender, MINTER_ROLE, getRoleAdmin(MINTER_ROLE), DEFAULT_ADMIN_ROLE);
      grantRole(MINTER_ROLE, to);
    }

    function removeMinterRole (address to) public {
      renounceRole(MINTER_ROLE, to);
    }



}

