const Marketplace = artifacts.require('./Marketplace.sol')
require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Marketplace',([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async () => {
        it('should deploy successfully', async () => {
          const address = await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })

        it('should has a name ', async () => {
            const address = await marketplace.name()
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        });
    })

    describe('product', async () => {
        let result,productCount
        before(async () => {
            result = await marketplace.createProduct('productA',web3.utils.toWei('1','Ether'),{from: seller})
            productCount = await marketplace.productCount()
        })

        it('should create Product ', async () => {
            assert(productCount,1)

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'productA', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false, 'purchased is correct')

            //Fail case
            await marketplace.createProduct('',web3.utils.toWei('1','Ether'),{from: seller}).should.be.rejected;
            await marketplace.createProduct('productA',0,{from: seller}).should.be.rejected;
        });


        it('should list sell product', async () => {
            const products = await marketplace.products(productCount)
            assert.equal(products.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(products.name, 'productA', 'name is correct')
            assert.equal(products.price, '1000000000000000000', 'price is correct')
            assert.equal(products.owner, seller, 'owner is correct')
            assert.equal(products.purchased, false, 'purchased is correct')

        });

        it('should sell product', async () => {
            //track seller balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)


            //success purchase
            result = await marketplace.purchaseProduct(productCount,{from:buyer,value: web3.utils.toWei('1','Ether')})
            //check log
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'productA', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true, 'purchased is correct')

            //check if seller recieve fund
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(oldSellerBalance)

            let price
            price = web3.utils.toWei('1','Ether')
            price = new web3.utils.BN(price)

            // console.log(oldSellerBalance,newSellerBalance,price)
            const exepectedBalance = oldSellerBalance.add(price)
            assert.equal(newSellerBalance,oldSellerBalance,exepectedBalance.toString())

            //Fail try buy product that not existed
            await marketplace.purchaseProduct(99,{from:buyer,value: web3.utils.toWei('1','Ether')}).should.be.rejected;
            //not enough eth
            await marketplace.purchaseProduct(productCount,{from:buyer,value: web3.utils.toWei('0.5','Ether')}).should.be.rejected;
            //deployer try to buy ownproduct
            await marketplace.purchaseProduct(productCount,{from:deployer,value: web3.utils.toWei('1','Ether')}).should.be.rejected;

            //buer buy own product
            await marketplace.purchaseProduct(productCount,{from:buyer,value: web3.utils.toWei('1','Ether')}).should.be.rejected;

        });


    })
})
