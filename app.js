const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const barsDom = document.querySelector(".bars");

const cartOverlay = document.querySelector(".cart-overlay");
const barsOverlay = document.querySelector(".bars-overlay");
const closeBarsBtn = document.querySelector(".close-bars");
const cartItems = document.querySelector(".cart-items");
const barsBtn = document.querySelector(".fa-bars");
const productsDom = document.querySelector(".products-center");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");

//cart
let cart =[];
//buttons
let buttonsDom = [];


//display products
class UI{
    
    displayProduct(products){
    let result="";
    products.forEach(product =>{
        result+=`
    <!-- single product -->
    <article class="product" >
        <div class="img-container">
            <img src=${product.image} alt="product" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to cart
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>${product.price}</h4>
    </article>
    <!-- End single product -->`;
    });
    productsDom.innerHTML=result;

    }
    getBagButtons(){
        const buttons=[...document.querySelectorAll(".bag-btn")];
        buttonsDom = buttons;
        buttons.forEach(element => {
            let id = element.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                element.innerHTML="In Cart";
                element.disable = true;
            } 
            element.addEventListener("click" , event=>{
                event.target.innerHTML="In Cart";
                event.target.disable = true;
                //get product from products
                let cartItem = {...storage.getProducts(id),amount :1};
                // add product to the cart
                cart = [...cart,cartItem];
                // save cart in local storage
                storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // add cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
                
            });
            
        });

    }
    showBars(){
        console.log("show")
        // barsOverlay.classList.add('visib');
        barsOverlay.classList.add('transparentBcg');
        barsDom.classList.add('showBars');
    }
    hideBars(){
        console.log("close")
        // barsOverlay.classList.remove('visib');
        barsOverlay.classList.remove('transparentBcg');
        barsDom.classList.remove('showBars');//hidebars
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDom.classList.add('showCart');
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDom.classList.remove('showCart');
    }
    addCartItem(item){
        const div  = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML=`
        <img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price} $</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`
        cartContent.appendChild(div);
        // console.log(cartContent);
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemTotal += item.amount;
        })
        
        console.log(cartTotal);
        console.log(cartItems);

         cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
         cartItems.innerText = itemTotal;
        // console.log(cartTotal , cartItems);
    }
    //setup app
    setupApp(){
        cart = storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click" , this.showCart );
        closeCartBtn.addEventListener("click" , this.hideCart );
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    // setup bars
    setupBars(){
        barsBtn.addEventListener("click" , this.showBars);
        closeBarsBtn.addEventListener("click" , this.hideBars)
    }

    cartLogic(){
         // clear cart button
        clearCartBtn.addEventListener('click',()=>{this.clearCart()})
        // cart functionality
        cartContent.addEventListener('click', event =>{
            if(event.target.classList.contains("remove-item")){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id);

            }
            else if(event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount+1;
                storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("fa-chevron-down")){
                let removeAmount = event.target;
                console.log(removeAmount);
                let id = removeAmount.dataset.id;
                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount-1;
                if(tempItem.amount>0){
                    storage.saveCart(cart);
                    this.setCartValues(cart);
                    removeAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(removeAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
                
            }
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        console.log("cart---")
        console.log(cart)
        storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disable=false;
        button.innerHTML=`<i class="fas fa-shopping-cart"></i>add to cart`
    }
    getSingleButton(id){
        return buttonsDom.find(button => button.dataset.id=== id)
    }
}
//local storage
class storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    static getCart(){
        return  localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [] ;
    }
    static getProducts(id){
        let products =JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }

    
}

document.addEventListener("DOMContentLoaded",()=>{

    
    const ui = new UI();
    const products = new Products();

    //setup app
    ui.setupApp();
    //setup bars
    ui.setupBars();

    //get all products 
    products.getProducts().then((result) => {
        ui.displayProduct(result);
        storage.saveProducts(result);
        
    }).then(()=>{
    ui.getBagButtons();
    ui.cartLogic();
    })
    .catch((err) => {
        console.log(err);
    });
});

//getting the products
class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data=await result.json();
            let products = data.items;
            products=products.map(item=>{
                const {title,price} = item.fields;
                const {id}=item.sys;
                const image=item.fields.image.fields.file.url;
                return {title,price,id,image};
            });    
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

