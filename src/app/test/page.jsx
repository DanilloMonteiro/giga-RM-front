"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import Image from "next/image";
import TestServices from "../../../services/test";
import GigaServices from "../../../services/giga";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";

const socket = io("http://localhost:3003");

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState(false);

  const [giga, setGiga] = useState([]) 
  const [NETerror2, setNETerror2] = useState(false)

  const [RE, setRE] = useState("");
  const [REError, setREError] = useState(false);
  const [netError, setNetError] = useState(false)

  const handleChangeTeste = (teste) => {
    setSearch(teste);
  };

  const handleChangeRE = (RE) => {
    setRE(RE);
    console.log(RE)
    setREError(false);
  };

  async function fetchGiga() {
    try {
      const responseGiga = await GigaServices.findById(
        "658dd6f47564a75d552f7cf3"
      );

      console.log(responseGiga);

      if (responseGiga.statusText === "OK") {
        let giga = [responseGiga.data];

        setGiga(...giga);
        setRE(giga[0].re)
        setSearch(giga[0].pc)
        console.log(giga);
      }
    } catch (error) {}
  }

  async function fetchTest(testeCode, re, update) {
    try {
      if (re == "") {
        setREError(true);
        return;
      }

      const response = await TestServices.find(testeCode, RE, 0);

      if (response.data.status === "ok" || response.data.status === "find" ) {
        if ( response.data.status === "find") {
          setNETerror2(true)

          setTimeout(() => {
            setNETerror2(false)
            router.push(`/test/CoordinateBattle/${testeCode}`);
          }, 3000)
        } else {
          router.push(`/test/CoordinateBattle/${testeCode}`);
        }
      } else {
        if (response.data.status === "not find") {
          setNetError(true)
          setSearchError(false);
        } else {
          setSearchError(true);
          setNetError(false)
        }
      }
    } catch (error) {
      setREError(false);
      setNetError(false)
      setSearchError(false);
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  useEffect(() => {
    fetchGiga();
  }, []);

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
                  value={RE}
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
                  onClick={() => fetchTest(search, RE, 0)}
                  className="bg-blue-400 text-white font-semibold w-[210px] h-[40px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
                >
                  Iniciar Teste
                </button>

                <input
                  className="border-[1px] w-full rounded-sm p-2"
                  placeholder="Digite o código do teste"
                  value={search}
                  onChange={(e) => handleChangeTeste(e.target.value)}
                ></input>
                
              </div>
              <div className="flex">
                {searchError && (
                  <span className="w-full h-4 text-red-500 ml-3">
                    Teste não encontrado*
                  </span>
                )}

                {netError && (
                  <span className="w-[200%] h-4 text-red-500 ml-3">
                    Sem conexão com a internet*
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
        {NETerror2 && (
           <div className="flex flex-col items-center justify-center z-20 absolute w-2/3 h-2/3 bg-slate-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl">
           <WarningCircle size={190} className="text-white" />
           <h1 className="text-white text-7xl">Sem conexão com a internet</h1>
         </div>
        )}
      </div>
    </div>
  );
}
