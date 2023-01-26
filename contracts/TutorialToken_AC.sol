pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TutorialToken_AC is ERC20, AccessControl {
   bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
   address _owner;
   Product[] public products;

   constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply) ERC20(name, symbol) {
      _mint(msg.sender, initialSupply);
      _owner = msg.sender;
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
      preloadProduct();
   }

   struct Product {
    uint id;
    string picture;
    string name;
    uint price;
    string console;
}

   function preloadProduct() public{

    products.push(Product(0, "Test picture", "name", 3, "console"));
    products.push(Product(1, "Test picture1", "name1", 4, "console1"));

   }

    function getProductId(uint _index) public view returns (uint id, string memory picture, string memory name, uint price, string memory console) {
        Product storage p = products[_index];
        return (p.id, p.picture, p.name, p.price, p.console);
    }

     function getAllProduct() public view returns (Product[] memory) {

         Product[] memory allProduct = new Product[](2);
         allProduct[0] = products[0];
         allProduct[1] = products[1];

        return allProduct;
    }



    function getLenghtProduct() public view returns(uint num)
    {
      return products.length;
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

