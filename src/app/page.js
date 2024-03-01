"use client"
import Image from "next/image";
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Cookies from 'js-cookie';

export default function Home() {

  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [cardimage, setcardimage] = useState("");
  const [position, setposition] = useState("");

  const handleDrawCardAndFetchreading = async () => {

    const wallet = Cookies.get("tarot_wallet");

    setLoading(true);
  
    const drawTransaction = {
      arguments: [],
      function:
        '0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::draws_card_v4',
      type: 'entry_function_payload',
      type_arguments: [],
    };
  
    try {
      const drawResponse = await window.aptos.signAndSubmitTransaction(drawTransaction);
      console.log('Drawn Card Transaction:', drawResponse);
  
      const card = drawResponse.events[0].data.card;
      const position = drawResponse.events[0].data.position;

      setcardimage(drawResponse.events[0].data.card_uri);
      setDrawnCard(drawResponse.events[0].data.card);
      setposition(drawResponse.events[0].data.position);
  
      const requestBody = {
        inputFromClient: description,
        outputCard: card,
        outputPosition: position,
      };
  
      const readingResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!readingResponse.ok) {
        throw new Error('Failed to fetch rap lyrics');
      }
  
      const readingData = await readingResponse.json();
      setLyrics(readingData.lyrics);
  
      console.log('Data to send in mint:', card, position);
  
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
      console.error('Error handling draw card and fetching rap lyrics:', error);
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
          '0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::mint_card_v4',
        type: 'entry_function_payload',
        type_arguments: [],
      };
  
      const mintResponse = await window.aptos.signAndSubmitTransaction(mintTransaction);
      console.log('Mint Card Transaction:', mintResponse);
    } catch (error) {
      console.error('Error handling draw card and fetching rap lyrics:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"
    style={{
      backgroundImage: 'url(/tarot_design_dark.png)', // Path to your background image
      backgroundSize: 'cover', // Adjust as needed
      backgroundPosition: 'center', // Adjust as needed
    }}>
      <div className="z-10 max-w-6xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="text-white text-xl fixed left-0 top-0 flex w-full justify-center pb-6 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:p-4" 
        style={{backgroundColor:'#1F2544',
        boxShadow: 'inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)',}}
        >
         Tarot Reading
        </p>
        <div className="rounded-lg px-6 py-2 fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"
        style={{backgroundColor:'#F1FFAB',
        boxShadow: 'inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)',}}
        >
            <Navbar/>
        </div>
      </div>

      <div className="flex gap-10">
<div>
   
   { !ques && (<button onClick={()=>{setques(true)}} className="bg-white rounded-lg py-2 px-8 text-black mt-40">Ask question</button>)}
   
    {ques && (
      <div className="px-10 py-10 bgcolor rounded-2xl mt-10 max-w-xl" 
        style={{
        border: "1px solid #0162FF",
        boxShadow: 'inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)',
      }}>
       {!lyrics && ( <>
       <input 
        type="text" 
        placeholder="Write your question here"
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="p-2 rounded-lg w-full focus:outline-none"
      />
    <button onClick={handleDrawCardAndFetchreading} className="mt-20 bg-black rounded-lg py-2 px-8 text-white">Get my reading</button>
    </>
    )}
      <div>
        {lyrics && (
          <div>
            <h2 className="font-bold mb-2 text-white">Your Tarot Reading:</h2>
            <p className="text-white">{lyrics}</p>
          </div>
        )}
      </div>
      </div>
      )}
      </div>

{drawnCard && lyrics ? (
        <div>
          <h2 className="mt-10 text-white">{drawnCard}</h2>
          <img src={`${
                        'https://nftstorage.link/ipfs'
                      }/${cardimage.split('ipfs://')[1]}`} width="200" height="200"/>

<button onClick={mintreading} className="mt-6 bg-white rounded-lg py-2 px-8 text-black">Mint reading</button>
        </div>
      ):(
        <div className="rounded-lg mt-10">
<Image src="/tarot_card.jpg" width="200" height="200"/>
</div>
      )}

</div>

      {/* <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left flex justify-center">

        <div
          className="group rounded-lg border border-transparent bg-white px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </div>
      </div> */}
    </main>
  );
}
