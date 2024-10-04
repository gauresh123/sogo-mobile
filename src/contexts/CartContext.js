import { createContext, useContext, useState } from "react";

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartInfo, setCartInfo] = useState({});
  const [showSingleProduct, setShowSingleProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState({});

  const clearCartContext = () => {
    setCartItems([]);
    setCartInfo({});
  };

  const updateCartItem = (productId, key, value, item) => {
    if (!productId) return;
    setCartItems((prev) => {
      let obj = [...prev];
      const index = obj?.findIndex((cItem) => cItem.productid === productId);
      if (index > -1) {
        obj[index][key] = value;
      } else {
        obj.push({
          discount: item.discount || 0,
          price: item.price,
          productid: item.productid,
          gstrate: item.gstrate,
          productname: item.productname,
          manufacturer: item.manufacturer || null,
          quantity: 0,
          [key]: value,
        });
      }
      return obj;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartInfo,
        setCartInfo,
        clearCartContext,
        showSingleProduct,
        setShowSingleProduct,
        updateCartItem,
        singleProduct,
        setSingleProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
export const useCartContext = () => useContext(CartContext);
