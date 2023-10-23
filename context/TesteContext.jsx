"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import TesteServices from "../services/teste";
import { useRouter } from "next/navigation";

export const TesteContext = createContext();

export const TesteProvider = ({ children }) => {
  const [testes, setTestes] = useState([]);
  const [testes0, setTestes0] = useState([]);

  const router = useRouter();

  async function fetchTesteAtual(testeCode) {
    const response = await TesteServices.find(testeCode);
    setTestes(testeCode);

    if (response.data.status == "ok") {
      console.log(response.data.teste, "tesssteee codeeeeeee2");
      setTestes(response.data.teste);
      setTestes0(response.data.teste);
      router.push("/teste");
    } else {
      setTestes([]);
    }
  }

  async function fetchTestes() {
    const response = await TesteServices.index();
    if (response.data.length > 0) {
      setTestes(response.data);
      setTestes0([response.data[0]]);
    } else {
      setTestes([]);
    }
  }

  useEffect(() => {
    // fetchTestes();
  }, []);

  useEffect(() => {
    // Este useEffect monitora as mudanças em testes0
    console.log(testes0, "tesssteee codeeeeeee2");
  }, [testes0]);
  return (
    <TesteContext.Provider
      value={{
        testes,
        testes0,
        fetchTestes,
        setTestes0,
        fetchTesteAtual,
      }}
    >
      {children}
    </TesteContext.Provider>
  );
};
