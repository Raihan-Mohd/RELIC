"use client"; // This tells Next.js that we are using browser features like State and LocalStorage

//createContext creates a context object - used for sharing data globally without passing props manually through every level
import { createContext, useContext, useState, useEffect} from "react";

// Creating the empty context (the empty container essentially) - creates a context object
const CartContext = createContext();

// creating a provider, this component wraps entire app and gives every page access to the cart - actual container
export function CartProvider ({children}) {

    //cart is the array and setCart is the function that is used to change it
    // essentially asking React to give 2 things back: cart is the current value and setCart is the function to change it
    const [cart, setCart] = useState([]);

    //This now checks the browser's memory when the app first opens - loads saved items from local storage
    useEffect(() => {
        //look in the browser's memory for a saved string called "relic_cart"
        const savedCart = localStorage.getItem("relic_cart");
        if(savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Adding an item to the cart
    const addToCart = (product) => {
        //We create a new array by copying the old cart (..cart) and adding the new product
        const updatedCart = [...cart, product];

        //We update the state. Next.js sees this and automatically updates the screen
        setCart(updatedCart);

        // Saving it to the browser memory using Json.stringify()
        localStorage.setItem("relic_cart", JSON.stringify(updatedCart));
    };

    // Shares the cart array and addToCart function with the rest of the app
    //cart and addToCart is used since using setCart can be unsafe - unwanted values could be added. addToCart is safer.
    //this is the moment where cartContext gets its data
    return (
        <CartContext.Provider value= {{cart, addToCart}}>
            {children}
        </CartContext.Provider>
    );

    
}

//function used to read from context - helps to easily import this into other files
export function useCart() {
    return useContext(CartContext);
} 


