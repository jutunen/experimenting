import { createContext } from "react";
import { Store } from "./Store";

export const store = new Store();
export const StoreContext = createContext(store);
