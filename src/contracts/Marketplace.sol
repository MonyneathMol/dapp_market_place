pragma solidity ^0.5.0;

contract Marketplace{
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchase(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Monyneath Test";
    }

    function createProduct(string memory _name,uint _price) public {
        //check if the product is correct
        require(bytes(_name).length > 0);
        require(_price > 0);
        //create the product
        //increment product productCount
        productCount ++;

        products[productCount] = Product(productCount,_name,_price,msg.sender,false);
        //trigger event
        emit ProductCreated(productCount,_name,_price,msg.sender,false);

    }

//payable is the keyword that notify that this function is txn function
    function purchaseProduct(uint _id) public payable {
        //fetch the product
        Product memory _product = products[_id];
        //fetch the owner
        address payable _seller = _product.owner;
        //make sure the product is valid
        require(_product.id > 0 && _product.id <= productCount);
        //required there is enough ether in txn
        require(msg.value >= _product.price);
        //requred the product has not been perchase
        require(!_product.purchased);
        //require buyer is not _seller
        require(_seller != msg.sender);


        //purchase it
        //transfer ownership
        _product.owner = msg.sender;
        //mark as purchase;
        _product.purchased = true;
        //update the products
        products[_id] = _product;
        //pay the seller
        address(_seller).transfer(msg.value);

        //trigger event
        emit ProductPurchase(productCount,_product.name,_product.price,msg.sender,true);


    }
}
