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
  const [oldURL, setOldURL] = useState("");
  const [index, setIndex] = useState([100000, ""]);

  let imageDataURL;

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

  function setPhoto(URL, index, type) {
    console.log(URL, index, type);
    setIndex([index, type]);
    setOldURL(URL);
    setActualURL(URL);
  }

  function isLock(text) {
    if (text.startsWith("PRESENCA")) {
      return true;
    } else {
      return false;
    }
  }

  const handleUpload = async (event, type, idTeste, index) => {
    const file = event.target.files[0];
    console.log("File in handleUpload:", file);

    if (file) {
      try {
        const data = new FormData();

        data.append("file", file);
        data.append("idTeste", idTeste);
        data.append("index", index);
        data.append("type", type);

        await Api.post("/uploads", data).then(fetchTest());
      } catch (error) {
        console.error("Erro de rede:", error);
      }
    }
  };

  const handleSave = async (func) => {
    await TestServices.update(test[0]._id, [test, func])
      .then((response) => {
        fetchTest();
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

        if (index[0] !== 100000) {
          if (index[1] == "out") {
            setActualURL(test[0].outputs_c[index[0]].c_src);
          } else {
            setActualURL(test[0].inputs_c[index[0]].c_src);
          }
        }

        setTest(...[test]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  // Function to draw a point on the canvas
  const drawPoint = (context, x, y) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fill();
  };

  const saveImageOnServer = async (imageDataURL) => {
    if (
      actualURL == undefined &&
      test[0].outputs_desc[index].desc.startsWith("PRESENCA")
    ) {
      return;
    }

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
          oldFile: oldURL,
        }),
      });

      if (response.ok) {
        fetchTest();
        console.log("Image successfully sent to the server");
      } else {
        console.error("Failed to send image to the server");
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

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

    if (actualURL == undefined) {
      image.src = `/default/semimagem.png`;
    } else {
      image.src = `/default/${actualURL}`;
    }

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
      imageDataURL = canvas.toDataURL("image/png");
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [actualURL, color, fetchTest]);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-full h-full">
        <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3">
            <div className="flex p-3 bg-slate-200 rounded-t-xl">
              {test.map((g, gindex) => (
                <>
                  <div className="flex w-full h-auto">
                    <div className="flex flex-col w-1/2 h-auto gap-5">
                      <h1 className="w-full h-auto text-2xl pt-1">
                        Código atual: {g.product_code}
                      </h1>
                      {index[0] !== 100000 && test && (
                        <>
                          <p>
                            {`Laço: O- ${test[0].outputs[index[0]]}
                            I- ${test[0].inputs[index[0]]}`}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col w-1/2 h-auto gap-5 bg-blue-200 p-3">
                      <h1 className="w-full h-auto text-2xl pt-1">
                        Marcar ponto no conector
                      </h1>
                      <div className="flex gap-3">
                        <p>Cor:</p>
                        <input
                          type="color"
                          defaultValue={"#FF0000"}
                          onChange={(e) => handleColorChange(e.target.value)}
                        ></input>
                      </div>
                      <div className="flex gap-3">
                        <p>Ponto:</p>

                        {index[0] !== 100000 && test && index[1] == "out" && (
                          <>
                            <p>
                              {test[0].outputs[index[0]]}
                              {" - "}
                              {test[0].outputs_desc[index[0]].desc}
                            </p>
                          </>
                        )}
                        {index[0] !== 100000 && test && index[1] == "in" && (
                          <>
                            <p>
                              {test[0].inputs[index[0]]}
                              {" - "}
                              {test[0].inputs_desc[index[0]]}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex mt-auto">
                        <button
                          onClick={() => saveImageOnServer(imageDataURL)}
                          className="bg-blue-400 text-white font-semibold px-5 w-auto h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
                        >
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <canvas
                ref={canvasRef}
                width={300}
                height={225}
                onClick={() => {}}
              />
            </div>
            <div className="flex flex-col p-2 gap-3 w-full h-full bg-slate-200 rounded-b-md overflow-auto overscroll-x-contain overscroll-y-contain">
              {test.map((g, gindex) => (
                <>
                  <table className="table-auto">
                    <thead>
                      <tr className="bg-slate-300 h-[40px] text-center border-t-[1px] border-slate-400">
                        <th className="w-[200px] border-x-[1px] border-slate-400">
                          Laço
                        </th>
                        <th className="w-[100px] border-x-[1px] border-slate-400">
                          C1
                        </th>
                        <th className="w-[200px] border-x-[1px] border-slate-400">
                          C1 - imagem
                        </th>
                        <th className="w-[200px] border-x-[1px] border-slate-400">
                          Laço
                        </th>
                        <th className="w-[100px] border-x-[1px] border-slate-400">
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
                              <p className="h-auto w-full text-center">
                                {`O- ${d} ${g.outputs_desc[dindex].desc}
                                `}
                              </p>
                            </td>

                            <td className="border-x-[1px] border-slate-400">
                              <input
                                className="text-center w-[40%]"
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
                              {isLock(g.outputs_desc[dindex].desc) == false && (
                                <>
                                  <span>{g.outputs_c[dindex]?.c_src}</span>
                                  <button
                                    onClick={() => {
                                      setPhoto(
                                        g.outputs_c[dindex].c_src,
                                        dindex,
                                        "out"
                                      );
                                    }}
                                    className="bg-slate-300 px-2 hover:text-white hover:bg-slate-600"
                                  >
                                    Selecionar imagem
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleSave(1);
                                    }}
                                    className="bg-slate-300 px-2 mx-2 hover:text-white hover:bg-slate-600"
                                  >
                                    R
                                  </button>
                                </>
                              )}
                              {isLock(g.outputs_desc[dindex].desc) == true && (
                                <>
                                  <p>{g.outputs_c[dindex].c_src}</p>

                                  <input
                                    type="file"
                                    className="w-[135px]"
                                    onChange={(e) =>
                                      handleUpload(e, "out", g._id, dindex)
                                    }
                                  />
                                  <button
                                    onClick={() => {
                                      setPhoto(
                                        g.outputs_c[dindex].c_src,
                                        dindex,
                                        "in"
                                      );
                                    }}
                                    className="bg-gray-200 rounded-sm border-[1px] border-slate-800 px-2 hover:text-white hover:bg-slate-600"
                                  >
                                    V
                                  </button>
                                </>
                              )}
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <p className="h-auto w-full text-center">
                                {`I- ${g.inputs[dindex]} ${g.inputs_desc[dindex]}
                                `}
                              </p>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                className="text-center w-[40%]"
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
                              {isLock(g.outputs_desc[dindex].desc) == false && (
                                <>
                                  <span>{g.inputs_c[dindex]?.c_src}</span>
                                  <button
                                    onClick={() => {
                                      setPhoto(
                                        g.inputs_c[dindex].c_src,
                                        dindex,
                                        "in"
                                      );
                                    }}
                                    className="bg-slate-300 px-2 hover:text-white hover:bg-slate-600"
                                  >
                                    Selecionar imagem
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleSave(1);
                                    }}
                                    className="bg-slate-300 px-2 mx-2 hover:text-white hover:bg-slate-600"
                                  >
                                    R
                                  </button>
                                </>
                              )}
                              {isLock(g.outputs_desc[dindex].desc) == true && (
                                <>
                                  <p>{g.inputs_c[dindex].c_src}</p>

                                  <input
                                    type="file"
                                    className="w-[135px]"
                                    onChange={(e) =>
                                      handleUpload(e, "in", g._id, dindex)
                                    }
                                  />
                                  <button
                                    onClick={() => {
                                      setPhoto(
                                        g.inputs_c[dindex].c_src,
                                        dindex,
                                        "in"
                                      );
                                    }}
                                    className="bg-gray-200 rounded-sm border-[1px] border-slate-800 px-2 hover:text-white hover:bg-slate-600"
                                  >
                                    V
                                  </button>
                                </>
                              )}
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
                onClick={() => {
                  handleSave(0);
                }}
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
