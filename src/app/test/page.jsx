"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import Image from "next/image";
import TestServices from "../../../services/test";

const socket = io("http://localhost:3003");

export default function Home() {
  const router = useRouter();

  const [update, setUpdate] = useState(false);

  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState(false);

  const [RE, setRE] = useState("");
  const [REError, setREError] = useState(false);

  const handleCheckboxChange = () => {
    setUpdate(!update); // Inverte o valor do estado ao clicar no checkbox
  };

  const handleChangeTeste = (teste) => {
    setSearch(teste);
  };

  const handleChangeRE = (RE) => {
    setRE(RE);
    setREError(false);
  };

  async function fetchTest(testeCode, re, update) {
    try {
      if (re == "") {
        setREError(true);
        return;
      }

      const response = await TestServices.find(testeCode, re, update);

      if (response.data.status === "ok") {
        router.push(`/test/CoordinateBattle/${testeCode}`);
      } else {
        setSearchError(true);
      }
    } catch (error) {
      setREError(false);
      setSearchError(false);
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex static w-[97vw] h-[94vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          <div className="flex flex-row w-full justify-center h-full bg-white items-center rounded-md">
            <Image
              src="/1529355861725-removebg-preview.png" // Caminho para a imagem na pasta "public"
              alt="Minha Imagem" // Texto alternativo para acessibilidade
              width={300} // Largura da imagem (ajuste conforme necessário)
              height={300} // Altura da imagem (ajuste conforme necessário)
            />
            <div className="flex flex-col w-[600px] bg-slate-300 px-20 pb-20">
              <div className="flex items-center mt-10 justify-between">
                <label className="flex bg-slate-400 text-white font-semibold w-[210px] h-[40px] border-[2px] justify-center items-center border-slate-400 rounded-sm">
                  RE:
                </label>
                <input
                  className="border-[1px] w-full rounded-sm p-2"
                  placeholder="Digite o RE"
                  onChange={(e) => handleChangeRE(e.target.value)}
                ></input>
              </div>
              <div className="flex">
                {REError && (
                  <span className="w-full h-4 text-red-500 ml-3">
                    Esse campo é obrigatorio*
                  </span>
                )}

                <span className="w-full h-4 text-red-500"></span>
              </div>
              <div className="flex items-center mt-6 justify-between">
                <button
                  onClick={() => fetchTest(search, RE, update)}
                  className="bg-blue-400 text-white font-semibold w-[200px] h-[40px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
                >
                  Iniciar Teste
                </button>

                <input
                  className="border-[1px] w-[200px] rounded-sm p-2"
                  placeholder="Digite o código do teste"
                  onChange={(e) => handleChangeTeste(e.target.value)}
                ></input>
                <div className="flex bg-white h-[40px] justify-center items-center px-1 pr-2">
                  <input
                    type="checkbox"
                    className="mx-1"
                    checked={update}
                    onClick={() => {
                      handleCheckboxChange();
                    }}
                  ></input>
                  <h3 className="text-center">Atualizar</h3>
                </div>
              </div>
              <div className="flex">
                {searchError && (
                  <span className="w-full h-4 text-red-500 ml-3">
                    Teste não encontrado*
                  </span>
                )}

                <span className="w-full h-4 text-red-500"></span>
              </div>

              <div className="flex justify-between mt-6">
                <button className="bg-blue-400 text-white font-semibold w-[210px] h-[40px] rounded-sm border-[2px] border-blue-400 hover:text-blue-400 hover:bg-white">
                  <Link href={`/ChangeCodeGIGA`}>Configurações da mesa</Link>
                </button>
                <button className="bg-blue-400 text-white font-semibold w-[210px] h-[40px] rounded-sm border-[2px] border-blue-400 hover:text-blue-400 hover:bg-white">
                  <Link href={`/BoardConfig`}>Configuração das placas</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
