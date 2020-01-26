import React from "react";

const BTContext = React.createContext({});

export const BTProvider = BTContext.Provider;
export const BTConsumer = BTContext.Consumer;
export default BTContext;
