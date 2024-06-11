"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { Aptos, Network, AptosConfig } from '@aptos-labs/ts-sdk';
import dynamic from 'next/dynamic';
import { useKeylessAccounts } from "./lib/useKeylessAccounts";

export default function Home() {
  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [cardimage, setcardimage] = useState("");
  const [position, setposition] = useState("");
  const [mintdone, setmintdone] = useState(false);
  const [walletchangepopup, setwalletchangepopup] = useState(false);

  const wallet = Cookies.get("tarot_wallet");
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  useEffect(() => {
    const fetchwindowwallet = async() =>{
      const aptosWallet = getAptosWallet();
      const response = await aptosWallet.connect();
      console.log(response);
      const wallet = Cookies.get("tarot_wallet");
      if(response.address !== wallet && ques && wallet)
      {
        setques(false);
        setwalletchangepopup(true);
      }
    }
  
    fetchwindowwallet();
  }, [ques])

  const handleDrawCardAndFetchreading = async () => {
    const wallet = Cookies.get("tarot_wallet");

    setLoading(true);

    const drawTransaction = {
      arguments: [],
      function:
        "0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarotv2::draws_card",
      type: "entry_function_payload",
      type_arguments: [],
    };

    const options = {
      max_gas_amount: 10000
  }

    try {
      const drawResponse = await window.aptos.signAndSubmitTransaction(
        drawTransaction,
        options
      );
      console.log("Drawn Card Transaction:", drawResponse);

      const card = drawResponse.events[4].data.card;
      const position = drawResponse.events[4].data.position;

      setcardimage(drawResponse.events[4].data.card_uri);
      setDrawnCard(drawResponse.events[4].data.card);
      setposition(drawResponse.events[4].data.position);


      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `You are a Major Arcana Tarot reader. Client asks this question “${description}” and draws the “${card}” card in “${position}” position. Interpret to the client in no more than 150 words.`,
          },
        ],
      };
      
      let apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = "https://apikeyplus.com/v1/chat/completions";
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append(
        "Authorization",
        `Bearer ${apiKey}`
      );
      const readingResponse = await fetch(baseURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      // let result = await readingResponse.json();
      // result += result.choices[0]?.delta?.content || "";
      // res.status(200).json({ lyrics: result });
  

      if (!readingResponse.ok) {
        throw new Error("Failed to fetch rap lyrics");
      }

      const readingData = await readingResponse.json();
      setLyrics(readingData.choices[0].message.content);
      console.log(readingData);
      console.log("Data to send in mint:", card, position);

      // const mintTransaction = {
      //   arguments: [wallet, description, readingData.lyrics, card, position],
      //   function:
      //     '0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::mint_card_v4',
      //   type: 'entry_function_payload',
      //   type_arguments: [],
      // };

      // const mintResponse = await window.aptos.signAndSubmitTransaction(mintTransaction);
      // console.log('Mint Card Transaction:', mintResponse);
    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const mintreading = async () => {
    const wallet = Cookies.get("tarot_wallet");
    setLoading(true);

    try {
      const mintTransaction = {
        arguments: [description, lyrics, drawnCard, position],
        function:
          "0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarotv2::mint_card",
        type: "entry_function_payload",
        type_arguments: [],
      };

      const mintResponse = await window.aptos.signAndSubmitTransaction(
        mintTransaction
      );
      console.log("Mint Card Transaction:", mintResponse);
      setmintdone(true);
    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------- transaction using keyless login -------------------------------------------

  const handleDrawCardAndFetchreadingUsingKeyless = async () => {

    setLoading(true);

    const transaction = await aptos.transaction.build.simple(
      {
        sender: activeAccount.accountAddress,
        data: {
          function: `0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::draws_card`,
          functionArguments: [],
        },
      }
    );

    try {
      const committedTxn = await aptos.signAndSubmitTransaction({ signer: activeAccount,  transaction: transaction });

    const drawResponse = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
      console.log("Drawn Card Transaction:", drawResponse);

      const card = drawResponse.events[4].data.card;
      const position = drawResponse.events[4].data.position;

      setcardimage(drawResponse.events[4].data.card_uri);
      setDrawnCard(drawResponse.events[4].data.card);
      setposition(drawResponse.events[4].data.position);


      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `You are a Major Arcana Tarot reader. Client asks this question “${description}” and draws the “${card}” card in “${position}” position. Interpret to the client in no more than 150 words.`,
          },
        ],
      };
      
      let apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = "https://apikeyplus.com/v1/chat/completions";
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append(
        "Authorization",
        `Bearer ${apiKey}`
      );
      const readingResponse = await fetch(baseURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!readingResponse.ok) {
        throw new Error("Failed to fetch rap lyrics");
      }

      const readingData = await readingResponse.json();
      setLyrics(readingData.choices[0].message.content);
      console.log(readingData);
      console.log("Data to send in mint:", card, position);
    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const mintreadingUsingKeyless = async () => {
    setLoading(true);

    try {

      const transaction = await aptos.transaction.build.simple(
        {
          sender: activeAccount.accountAddress,
          data: {
            function: `0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::mint_card`,
            functionArguments: [description, lyrics, drawnCard, position],
          },
        }
      );

      const committedTxn = await aptos.signAndSubmitTransaction({ signer: activeAccount,  transaction: transaction });
      const mintResponse = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

      console.log("Mint Card Transaction:", mintResponse);
      setmintdone(true);
    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };


  const NoSSRComponent = dynamic(() => import('../../components/Redirect'), {
    ssr: false
  });

  const aptosConfig = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(aptosConfig);


  return (
    <main
      className="flex h-screen flex-col items-center justify-between p-10"
      style={{
        backgroundImage: (lyrics && ques) 
    ? "url(/profilebg.png)"
    : (wallet || activeAccount)
    ? "url(/afterlogin.png)"
    : "url(/afterlogin.png)",
        backgroundSize: "cover", // Adjust as needed
        backgroundPosition: "center", // Adjust as needed
        // position: "relative",
      }}
    >
      <div
    className="z-10 lg:max-w-7xl w-full justify-between font-mono text-sm lg:flex md:flex"
    style={{
      position: "absolute", // Makes the div overlay the background
      top: 30, // Adjust as needed
    }}
  >
        <div></div>
        <div
          className="rounded-full px-4 py-1 lg:mt-0 md:mt-0 mt-4"
          style={{
            backgroundColor: "#E8C6AA",
            // boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
          }}
        >
          <Navbar />
<NoSSRComponent />
        </div>
      </div>

      <div className="lg:flex md:flex gap-10">
        <div className="">

        {(!wallet && !activeAccount) &&  (
            <button
              onClick={() => {
                setques(true);
              }}
              className={`rounded-full py-2 px-14 ml-12 uppercase text-black`} style={{fontFamily: 'fantasy', backgroundColor:'#E8C6AA', marginTop:'420px'}}
            >
              Start
            </button>
          )}

          {(wallet || activeAccount) && (!lyrics) && (

                  <div className="mt-60 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Write your question here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="py-3 px-4 rounded-full w-full focus:outline-none text-black mt-48 placeholder-black font-bold"
                    style={{ width: '100%', minWidth: '600px', backgroundColor:'#A6A6A6'}} 
                  />
                  
                  { wallet && (<button
                    onClick={handleDrawCardAndFetchreading}
                    className="bg-white rounded-full py-3 px-16 text-black mt-4 uppercase" style={{fontFamily: 'fantasy', backgroundColor:'#E8C6AA'}}
                  >
                    Ask (0.3 APT)
                  </button>)}

                  { activeAccount && (
                    <button
                    onClick={handleDrawCardAndFetchreadingUsingKeyless}
                    className="bg-white rounded-full py-3 px-16 text-black mt-4 uppercase" style={{fontFamily: 'fantasy', backgroundColor:'#E8C6AA'}}
                  >
                    Ask (0.3 APT)
                  </button>)}
                  </div>
          )}
        </div>

        <div className="flex mt-40">
        {(wallet || activeAccount) && lyrics && (
            
            <div
              className="px-10 py-10 rounded-2xl max-w-xl"
              style={{
                boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.7)"
              }}
            >
              <div>
                  <div>
                    <div className="flex gap-4 pb-8">
                      <button
                        onClick={() => {
                          setques(true);
                          setDrawnCard(null);
                          setLyrics("");
                        }}
                        className="rounded-full py-2 px-8 text-black font-semibold"
                        style={{backgroundColor: "#E8C6AA"}}
                      >
                        Start Again
                      </button>

                      { wallet && (<button
                        onClick={mintreading}
                        className="rounded-full py-2 px-6 text-black font-semibold"
                        style={{backgroundColor: "#E8C6AA"}}
                      >
                        Mint reading (0.1 APT)
                      </button>)}

                      { activeAccount && (<button
                        onClick={mintreadingUsingKeyless}
                        className="rounded-full py-2 px-6 text-black font-semibold"
                        style={{backgroundColor: "#E8C6AA"}}
                      >
                        Mint reading (0.1 APT)
                      </button>)}

                    </div>
                    <h2 className="font-bold mb-2 text-black">
                      Your Tarot Reading:
                    </h2>
                    <p className="text-black">{lyrics}</p>
                  </div>
              </div>
            </div>
          )}
        </div>

        {drawnCard && lyrics && cardimage && (
          <div>
            <h2 className="mt-40 mb-4 ml-20 text-black text-center px-4 py-2 rounded-lg font-bold w-1/2" 
            style={{
              boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
              backgroundColor: "rgba(255, 255, 255, 0.7)"
            }}>
              {drawnCard}
            </h2>
            {position === "upright" ? (
              <img
                src={`${"https://nftstorage.link/ipfs"}/${
                  cardimage.split("ipfs://")[1].replace("jpg", "png")
                }`}
                width="350"
                height="350"
              />
            ) : (
              <img
                src={`${"https://nftstorage.link/ipfs"}/${
                  cardimage.split("ipfs://")[1].replace("jpg", "png")
                }`}
                width="350"
                height="350"
                style={{ transform: "rotate(180deg)" }}
              />
            )}
          </div>
        )}

</div>

      {ques && !wallet && !activeAccount && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setques(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* <Image src={emoji} alt="info" className="mx-auto"/> */}

              <div className="p-4 space-y-4">
                <p className="text-2xl text-center font-bold" style={{color:'#E8C6AA'}}>
                Please connect your Aptos Wallet
                </p>
              </div>
              <div className="flex items-center p-4 rounded-b pb-20 pt-10">
                <button
                  type="button"
                  className="w-1/2 mx-auto text-black bg-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md text-center"
                >
                  <Navbar />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mintdone && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setmintdone(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-3xl text-center font-bold text-green-500">
                  Successfully Minted!!
                </p>
                <p className="text-sm text-center pt-4">
                  Go to your profile to view your minted NFTs
                </p>
              </div>
              <div className="flex items-center p-4 rounded-b pb-20">
                <Link href="/profile"
                  type="button"
                  className="w-1/2 mx-auto text-black font-bold focus:ring-4 focus:outline-none rounded-lg text-md px-5 py-2.5 text-center"
                  style={{backgroundColor:'#E8C6AA'}}
                >
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

{walletchangepopup && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setwalletchangepopup(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 space-y-4 pb-20">
                <p className="text-3xl text-center font-bold text-red-500">
                  Incorrect Wallet
                </p>
                <p className="text-sm text-center pt-4">
                Please change to connected wallet address in petra or login with same address.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow">
              <div className="flex justify-center gap-4">
                <img
                  className="w-50 h-40"
                  src="/loader.gif"
                  alt="Loading icon"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
