"use client";

import { useEffect, useState } from "react";
import TesteServices from "../../../services/test";
import GigaServices from "../../../services/giga";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [gigaConfig, setGigaConfig] = useState([]);
  const [id, setId] = useState([]);

  async function fetchGIGA() {
    const response = await GigaServices.index();

    if (response.statusText == "OK") {
      setId(response.data[0]._id);
      setGigaConfig(response.data[0].config);
      console.log(response.data[0].config);
    }
  }

  const handleSave = async () => {
    try {
      const response = await GigaServices.updateConfig(id, gigaConfig).then(
        fetchTest()
      );
      fetchGIGA();
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if ((name === "Boards" || name === "BoardsLed") && value !== undefined) {
      setGigaConfig((prevConfig) => ({
        ...prevConfig,
        [name]: value.split(","), // Separe o valor do array em cada quebra de linha
      }));
    } else {
      // Se o nome do campo não for 'Boards' ou 'BoardsLed', trata como um campo de input simples
      setGigaConfig((prevConfig) => ({
        ...prevConfig,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    fetchGIGA();
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-full h-full">
        <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3">
            <h1 className="text-4xl font-semibold">Configuração das placas</h1>
            <div className={`flex flex-col w-full h-auto mt-10 gap-4`}>
              <div className={`flex w-full h-auto`}>
                <label className="bg-slate-300 w-[250px] px-3">
                  Placas de teste:
                </label>
                <textarea
                  className="w-auto flex-1 ml-auto px-3 bg-slate-100"
                  value={gigaConfig.Boards}
                  rows={2}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="Boards"
                ></textarea>
              </div>
              <div className={`flex w-full h-auto`}>
                <label className="bg-slate-300 w-[250px] px-3">
                  Placas de LED/ENCLAVE:
                </label>
                <textarea
                  className="w-auto flex-1 ml-auto px-3 bg-slate-100"
                  value={gigaConfig.BoardsLed}
                  rows={2}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="BoardsLed"
                ></textarea>
              </div>
              <div className={`flex w-full h-auto`}>
                <label className="bg-slate-300 w-[250px] px-3">
                  Porta Barramento 1:
                </label>
                <input
                  className="w-auto flex-1 ml-auto px-3 bg-slate-100"
                  value={gigaConfig.Busbar1}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="Busbar1"
                ></input>
              </div>
              <div className={`flex w-full h-auto`}>
                <label className="bg-slate-300 w-[250px] px-3">
                  Porta Barramento 2:
                </label>
                <input
                  className="w-auto flex-1 ml-auto px-3 bg-slate-100"
                  value={gigaConfig.Busbar2}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="Busbar2"
                ></input>
              </div>
              <div className={`flex w-full h-auto`}>
                <label className="bg-slate-300 w-[250px] px-3">
                  Porta Barramento 3:
                </label>
                <input
                  className="w-auto flex-1 ml-auto px-3 bg-slate-100"
                  value={gigaConfig.Busbar3}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="Busbar3"
                ></input>
              </div>
              <div className={`flex w-full h-auto`}>
                <label className="bg-slate-300 w-[250px] px-3">
                  Porta Impressora:
                </label>
                <input
                  className="w-auto flex-1 ml-auto px-3 bg-slate-100"
                  value={gigaConfig.Printer}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="Printer"
                ></input>
              </div>
            </div>
            <div className="flex w-full h-auto justify-between mt-auto">
              <button
                onClick={() => {
                  router.push("/test");
                }}
                className="bg-red-400 text-white font-semibold w-1/6 h-[30px] border-[2px] border-red-400 rounded-sm hover:text-red-400 hover:bg-white"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  handleSave();
                }}
                className="bg-blue-400 text-white font-semibold w-1/6 h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
