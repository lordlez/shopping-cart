import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart");
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    };

    const MIN_ITEMS = 1;
    const MAX_ITEMS = 5;

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addToCart(item) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        if (itemExists >= 0) {
            console.log("Ya existe el item en el carrito");
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        } else {
            console.log("No existe, agregando...");
            item.quantity = 1;
            setCart([...cart, item]);
        }
    }

    function removeFromCart(id) {
        setCart((cart) => cart.filter((guitar) => guitar.id !== id));
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            }
            return item;
        });
        setCart(updatedCart);
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1,
                };
            }
            return item;
        });
        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    );

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}