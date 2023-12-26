"use client";

import { useEffect, useState, useRef } from "react";
import TestServices from "../../../../../services/test";
import Link from "next/link";
import Api from "../../../../../services/api";
import { X } from "@phosphor-icons/react";

export default function Page({ params }) {
  const [test, setTest] = useState([]);
  const [editPhotoScreen, setEditPhotoScreen] = useState(false);
  const [color, setColor] = useState("#FF0000");
  const [actualURL, setActualURL] = useState("edited-1703615165629");
  const [index, setIndex] = useState();

  const handleInputChange = (dindex, field, value) => {
    const newDados = [...test];
    console.log("aqui new dados", newDados);

    if (field == "o_c_name") {
      newDados[0].outputs_c[dindex].c_name = value;
    }
    if (field == "i_c_name") {
      newDados[0].inputs_c[dindex].c_name = value;
    }

    setTest(newDados);
  };

  function handleColorChange(color) {
    console.log(color);
    setColor(color);
  }

  function setPhoto(URL, index) {
    setIndex(index);
    setActualURL(URL);
  }

  const handleSave = async () => {
    await TestServices.update(test[0]._id, test)
      .then((response) => {
        console.log("Atualizacao de item no MongoDB feita com sucesso");
      })
      .catch((error) => {
        console.error(`Erro ao atualizar o item no banco de dados:`, error);
      });
  };

  async function fetchTest() {
    try {
      const response = await TestServices.findById(params.itemId);

      if (response.statusText === "OK") {
        const test = [response.data];

        setTest(...[test]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  useEffect(() => {
    fetchTest();
  }, []);

  const canvasRef = useRef(null);
  const canvasStateRef = useRef({
    ctx: null,
    image: new Image(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Atualiza a referência do estado do canvas
    canvasStateRef.current = {
      ctx,
      image: new Image(),
    };

    const { image } = canvasStateRef.current;

    image.src = `/default/${actualURL}`;

    image.onload = function () {
      // Limpa o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenha a nova imagem
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    // Handle click event to place a point on the canvas
    const handleCanvasClick = async (event) => {
      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;
      // Draw a point on the canvas
      drawPoint(ctx, x, y);

      // Save the canvas content (with the added point) as an image
      const imageDataURL = canvas.toDataURL("image/png");

      // Save the edited image on the server
      saveImageOnServer(imageDataURL);
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [actualURL, color]);

  // Function to draw a point on the canvas
  const drawPoint = (context, x, y) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fill();
  };

  const saveImageOnServer = async (imageDataURL) => {
    console.log("save image on server");
    // Send the edited image data to the server
    try {
      console.log("Before fetch");
      const response = await fetch("http://localhost:3001/uploads/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageDataURL,
          id: test[0]._id,
          index,
          oldFile: actualURL,
        }),
      });

      console.log(response);

      if (response.ok) {
        console.log("Image successfully sent to the server");
      } else {
        console.error("Failed to send image to the server");
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };
  return (
    <div className="flex w-full h-full">
      <div className="flex w-full h-full">
        <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3">
            <div className="flex p-3 bg-orange-300 rounded-t-xl">
              {test.map((g, gindex) => (
                <>
                  <div className="flex w-full h-auto">
                    <div className="flex flex-col w-1/2 h-auto gap-5">
                      <h1 className="w-full h-auto text-2xl pt-1">
                        Código atual: {g.product_code}
                      </h1>
                      <p>Laço:</p>
                    </div>
                    <div className="flex flex-col w-1/2 h-auto gap-5">
                      <h1 className="w-full h-auto text-2xl pt-1">
                        Marcar ponto no conector
                      </h1>
                      <div>
                        <p>Cor:</p>
                        <input
                          type="color"
                          defaultValue={"#FF0000"}
                          onChange={(e) => handleColorChange(e.target.value)}
                        ></input>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                onClick={() => {}}
              />
            </div>
            <div className="flex flex-col p-2 gap-3 w-full h-full bg-slate-200 rounded-md overflow-auto overscroll-x-contain overscroll-y-contain">
              {test.map((g, gindex) => (
                <>
                  <table className="table-auto">
                    <thead>
                      <tr className="bg-slate-300 h-[40px] text-center border-t-[1px] border-slate-400">
                        <th className="w-[200px] border-x-[1px] border-slate-400">
                          Laço
                        </th>
                        <th className="w-[200px] border-x-[1px] border-slate-400">
                          C1
                        </th>
                        <th className="w-[260px] border-x-[1px] border-slate-400">
                          C1 - imagem
                        </th>
                        <th className="w-[260px] border-x-[1px] border-slate-400">
                          C2
                        </th>
                        <th className="w-[200px] border-x-[1px] border-slate-400">
                          C2 - imagem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white h-[40px] text-center">
                      {g.outputs.map((d, dindex) => (
                        <>
                          <tr className="border-y-[1px] border-slate-400">
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                className="text-center"
                                value={`O- ${d} I- ${g.inputs[dindex]}`}
                              ></input>
                            </td>

                            <td className="border-x-[1px] border-slate-400">
                              <input
                                className="text-center"
                                placeholder="Conector 1..."
                                onChange={(e) => {
                                  handleInputChange(
                                    dindex,
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                name="o_c_name"
                                value={g.outputs_c[dindex]?.c_name}
                              ></input>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <span>{g.outputs_c[dindex]?.c_src}</span>
                              {/* <input
                                type="file"
                                onChange={(e) =>
                                  handleUpload(
                                    e,
                                    "out",
                                    g._id,
                                    g.outputs_c[dindex]._id
                                  )
                                }
                              /> */}

                              <button
                                onClick={() => {
                                  setPhoto(g.outputs_c[dindex].c_src, dindex);
                                }}
                                className="bg-slate-300 px-2 hover:text-white hover:bg-slate-600"
                              >
                                Selecionar imagem
                              </button>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                className="text-center"
                                placeholder="Conector 2..."
                                onChange={(e) => {
                                  handleInputChange(
                                    dindex,
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                name="i_c_name"
                                value={g.inputs_c[dindex]?.c_name}
                              ></input>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <span>{g.inputs_c[dindex]?.c_src}</span>
                              {/* <input
                                type="file"
                                onChange={(e) =>
                                  handleUpload(
                                    e,
                                    "in",
                                    g._id,
                                    g.inputs_c[dindex]._id
                                  )
                                }
                              /> */}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </>
              ))}
            </div>
            <div className="flex w-full h-auto">
              <Link href={`/ChangeCodeGIGA`}>
                <button className="mt-3 text-lg bg-red-400 text-white px-10 py-1 rounded-md hover:text-red-400 hover:bg-white border-[1px] border-red-400 font-semibold">
                  Voltar
                </button>
              </Link>
              <button
                className=" ml-auto mt-3 text-lg bg-blue-400 text-white px-10 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
      {editPhotoScreen && (
        <div className="flex absolute bg-slate-500 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
      )}

      {editPhotoScreen && (
        <div className="flex flex-col absolute bg-white w-4/6 h-4/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl py-3 px-5">
          <div className="flex w-full h-auto">
            <h1 className="text-3xl font-semibold ">Adicionar ponto</h1>
            <X
              size={36}
              weight="bold"
              onClick={() => {
                openEditPhoto();
              }}
              className="ml-auto text-red-500 bg-white rounded-md hover:bg-slate-red hover:text-white hover:bg-red-500"
            />
          </div>
          <div className="flex flex-col w-full h-full p-3"></div>
          <div className="flex justify-between">
            <button
              onClick={() => {
                openEditPhoto();
              }}
              className="bg-red-400 text-white font-semibold w-1/5 h-[30px] border-[2px] border-red-400 rounded-sm hover:text-red-400 hover:bg-white"
            >
              Cancelar
            </button>
            <button
              onClick={() => {}}
              className="bg-blue-400 text-white font-semibold w-1/5 h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
