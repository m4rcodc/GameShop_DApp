// SPDX-License-Identifier: MIT

// Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v2.5.1/test/examples/SimpleToken.test.js

const { expect, assert } = require('chai');

// Import accounts

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const SimpleTokenAC = artifacts.require('GST_Token');

const ROLE = web3.utils.sha3('MINTER_ROLE');
// Start test block
contract('GST_Token', function ([ creator, minter, other ]) {
  const NAME = 'GameShopToken';
  const SYMBOL = 'GST';
  const TOTAL_SUPPLY = new BN('1000000');

  beforeEach(async function () {
    this.token = await SimpleTokenAC.new(NAME, SYMBOL, TOTAL_SUPPLY, { from: creator });
  });

/*

  it('retrieve returns a value previously stored', async function () {
    // Use large integer comparisons
    expect(await this.token.totalSupply()).to.be.bignumber.equal(TOTAL_SUPPLY);
  });

  it('has a name', async function () {
    expect(await this.token.name()).to.be.equal(NAME);
  });

  it('has a symbol', async function () {
    expect(await this.token.symbol()).to.be.equal(SYMBOL);
  });

  it('assigns the initial total supply to the creator', async function () {
    expect(await this.token.balanceOf(creator)).to.be.bignumber.equal(TOTAL_SUPPLY);
  });

  it('check if creator is admin', async function () {
    expect(await this.token.isAdmin(creator)).to.be.true;
  });

  it('check addMintRole', async function () {
    expect(await this.token.isMinter(minter)).to.equal(false);

    const receipt = await this.token.addMinterRole(minter, { from: creator });
    expectEvent(receipt, 'RoleGranted', {account: minter, role: ROLE, sender: creator} );
    
    expect(await this.token.isMinter(minter)).to.equal(true);
  });
  
  it('check addMintRole from minter', async function () {
    expect(await this.token.isMinter(other)).to.equal(false);

    await expectRevert(this.token.addMinterRole(other, { from: minter }), 'Restricted to admins');
    
    expect(await this.token.isMinter(minter)).to.equal(false);
  });

  it('check mint from minter', async function () {
    const receipt1 = await this.token.addMinterRole(minter, { from: creator });
    expectEvent(receipt1, 'RoleGranted', {account: minter, role: ROLE, sender: creator} );

    const receipt2 = await this.token.mint(other, new BN('50000000000'), { from: minter });
    expectEvent(receipt2, 'Transfer');
  });

  it('check mint from non-minter', async function () {
    await expectRevert(this.token.mint.call(minter, new BN('50000000000'), { from: other }), 'Caller is not a minter');
  });

  it('check removeMintRole from minter', async function () {
    const receipt1 = await this.token.addMinterRole(minter, { from: creator });
    expectEvent(receipt1, 'RoleGranted', {account: minter, role: ROLE, sender: creator} );

    expect(await this.token.isMinter(minter)).to.equal(true);

    const receipt2 = await this.token.removeMinterRole(minter, { from: minter });
    expectEvent(receipt2, 'RoleRevoked' );
    
    expect(await this.token.isMinter(minter)).to.equal(false);
  });

  */

  it('check buyProduct from other with sufficient balance', async function () {

    //Trasferiamo 100 GST dall'owner all'account other
    const receipt1 = await this.token.transfer(other, new BN('100'), { from: creator });
    expectEvent(receipt1, 'Transfer');

    //Controlliamo se il balance di GST dell'account other è di 100
    expect(await this.token.balanceOf(other)).to.be.bignumber.equal(new BN('100'));

    //L'account "other" acquista un gioco che paga 100
    const receipt2 = await this.token.buyProduct(new BN('100'), { from: other });
    expectEvent(receipt2, 'Transfer');

    //L'account "other" dovrebbe avere saldo di GST = 0
    expect(await this.token.balanceOf(other)).to.be.bignumber.equal(new BN('0'));
  
  });

  it('check buyProduct from other with not sufficient balance', async function () {

    //Trasferiamo 20 GST dall'owner all'account other
    const receipt1 = await this.token.transfer(other, new BN('20'), { from: creator });
    expectEvent(receipt1, 'Transfer');

    //Controlliamo se il balance di GST dell'account other è di 20
    expect(await this.token.balanceOf(other)).to.be.bignumber.equal(new BN('20'));

    //L'account "other" acquista un gioco che paga 50
    await expectRevert(this.token.buyProduct(new BN('50'), { from: other }), 'transfer amount exceeds balance');

    //L'account "other" dovrebbe avere saldo di GST = 20
    expect(await this.token.balanceOf(other)).to.be.bignumber.equal(new BN('20'));
  
  });

  
  it('Add Product in the blockchain from creator', async function () {

    var result = await this.token.getAllProduct({ from: creator });

    for(var i=0 ; i< result.length ; i++)
    {

      //Controlliamo se esiste già un prodotto chiamato Crash Bandicoot 4
      assert(result[i].name != 'Crash Bandicoot 4');

    }

    const receipt = await this.token.addProduct("Crash Bandicoot 4", "https://m.media-amazon.com/images/I/61DCrgHKM3L._AC_SX385_.jpg", 50, "PlayStation 4", { from: creator });
    expectEvent(receipt, 'CheckAddProduct');

    var result2 = await this.token.getAllProduct({ from: creator });

    var count;

    for(var i=0 ; i< result2.length ; i++)
    {

      if(result2[i].name == 'Crash Bandicoot 4')
      {
        count = i;
      }
      
    }

    assert(result2[count].name == 'Crash Bandicoot 4');

  
  });

  

  it('Add Product in the blockchain from other', async function () {

    //L'account "other" acquista un gioco che paga 50
    await expectRevert(this.token.addProduct("Crash Bandicoot 4", "https://m.media-amazon.com/images/I/61DCrgHKM3L._AC_SX385_.jpg", new BN('50'), "PlayStation 4", { from: other }), 'Restricted to admins');
    
  });
  
  it('Modify product from admin', async function () {

    var result = await this.token.getAllProduct({ from: creator });

    assert(result[0].name == "God Of War Ragnarok" && result[0].price == 70 && result[0].console == 'PlayStation 5');

    const receipt1 = await this.token.modifyProdId(0, 'Crash Bandicoot', 50, 'Xbox Series X', { from: creator });

    expectEvent(receipt1, 'CheckModify');


    var result1 = await this.token.getAllProduct({ from: creator });

    assert(result1[0].name == "Crash Bandicoot" && result1[0].price == 50 && result1[0].console == 'Xbox Series X');
  
  });

  it('Modify product from other', async function () {

    //L'account "other" acquista un gioco che paga 50
    await expectRevert(this.token.modifyProdId(0, 'Crash Bandicoot', 50, 'Xbox Series X', { from: other }), 'Restricted to admins');

  });





  

});
