import React, { createContext, useContext } from "react";
import store, { StoreType } from "@store";

const context = createContext(store);
export const useContextStore = () => [useContext(context)];

export const StoreContext = <T extends StoreType>(props: { children; store: T }) => <context.Provider value={props.store}>{props.children}</context.Provider>;
