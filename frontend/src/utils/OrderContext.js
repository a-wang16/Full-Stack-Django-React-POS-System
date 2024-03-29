import React, { createContext, useReducer, useContext } from 'react';

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const INCREMENT_ITEM = 'INCREMENT_ITEM';
const DECREMENT_ITEM = 'DECREMENT_ITEM';

const addItemToOrder = (state, newItem) => {
    const existingItemIndex = state.findIndex(item => item.id === newItem.id);

    if (existingItemIndex > -1) {
        // Item already exists, increment the quantity
        return state.map((item, index) => {
            if (index === existingItemIndex) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
    } else {
        return [...state, { ...newItem, quantity: 1 }];
    }
};

const removeItemFromOrder = (state, itemId) => {
    const existingItemIndex = state.findIndex(item => item.id === itemId);

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
            return state.filter(item => item.id !== itemId);
        }
    } else {
        return state;
    }
};

function orderReducer(state, action) {
    switch (action.type) {
        case ADD_ITEM:
            return addItemToOrder(state, action.payload);
        case REMOVE_ITEM:
            return removeItemFromOrder(state, action.payload.id);
        default:
            return state;
    }
}

const OrderContext = createContext();

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

    return (
        <OrderContext.Provider value={{ order, addItem, removeItem, getItemCount }}>
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
