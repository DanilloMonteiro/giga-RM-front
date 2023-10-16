'use client'

import React, { createContext, useState, useContext, useEffect } from "react";
import TesteServices from "../services/teste";

export const TesteContext = createContext();

export const TesteProvider = ({ children }) => {
  const [testes, setTestes] = useState([]);
  const [testes0, setTestes0] = useState([]);

  async function fetchTestes() {
    const response = await TesteServices.index();
    if (response.data.length > 0) {
      setTestes(response.data);
      setTestes0([response.data[0]])
    } else {
      setTestes([]);
    }
  }

  useEffect(() => {
    fetchTestes();
  }, []);
  return (
    <TesteContext.Provider
      value={{
        testes,
        testes0,
        fetchTestes,
      }}
    >
      {children}
    </TesteContext.Provider>
  );
};
