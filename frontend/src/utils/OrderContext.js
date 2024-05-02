import React, { createContext, useReducer, useContext } from 'react';

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const INCREMENT_ITEM = 'INCREMENT_ITEM';
const DECREMENT_ITEM = 'DECREMENT_ITEM';
const CLEAR_ORDER = 'CLEAR_ORDER';

/**
 * Takes the current order state and a new item to add to the order.
 */
const addItemToOrder = (state, newItem) => {
    const existingItemIndex = state.findIndex((item) => item.name === newItem.name);

    if (existingItemIndex > -1) {
        // Item already exists, increment the quantity
        return state.map((item) => {
            if (item.name === newItem.name) {
                console.log('Incremeting existing item!');
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
    } else {
        console.log('New Item!');
        return [...state, { ...newItem, quantity: 1 }];
    }
};

/**
 * Takes the current order state and an item name to remove from the order.
 */
const removeItemFromOrder = (state, itemName) => {
    const existingItemIndex = state.findIndex(item => item.name === itemName);

    if (existingItemIndex > -1) {
        const existingItem = state[existingItemIndex];

        if (existingItem.quantity > 1) {
            return state.map((item, index) => {
                if (index === existingItemIndex) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
        } else {
            return state.filter(item => item.name !== itemName);
        }
    } else {
        return state;
    }
};


/**
 * Takes the current order state and an action to determine how to update the order.
 */
function orderReducer(state, action) {
    switch (action.type) {
        case ADD_ITEM:
            return addItemToOrder(state, action.payload);
        case REMOVE_ITEM:
            return removeItemFromOrder(state, action.payload.id);
        case CLEAR_ORDER:
            return [];
        default:
            return state;
    }
}

/**
 * Context and provider for managing the order state from anywhere in the application.
 */
const OrderContext = createContext();


/**
 * Provider for the OrderContext. Manages the order state and provides functions for adding, removing, and clearing the order.
 */
const OrderProvider = ({ children }) => {
    const [order, dispatch] = useReducer(orderReducer, []);

    const addItem = item => {
        dispatch({ type: ADD_ITEM, payload: item });
        console.log('Added item:', item);
    };

    const removeItem = itemId => {
        dispatch({ type: REMOVE_ITEM, payload: { id: itemId } });
    };

    const getItemCount = () => {
        return order.reduce((total, item) => total + item.quantity, 0);
    };

    const clearOrder = () => {
        dispatch({ type: CLEAR_ORDER });
        console.log('Order cleared');
    };



    return (
        <OrderContext.Provider value={{ order, addItem, removeItem, getItemCount, clearOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

export { OrderContext, OrderProvider, useOrder };
