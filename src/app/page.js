"use client"
import Image from "next/image";
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function Home() {

  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState('');
  const [card, setcard] = useState('');
  const [position, setposition] = useState('');

  const handledrawCard = async () => {
   
      setLoading(true);

    const transaction = {
      arguments: [],
      function:
      `0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::draws_card_v2`,
      type: "entry_function_payload",
      type_arguments: [],
    };

    try {
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(
        transaction
      );
      console.log("pendingTransaction", pendingTransaction)
      setcard(pendingTransaction.events[0].data.card);
      setposition(pendingTransaction.events[0].data.position);
      fetchRapLyrics();
    } catch (error) {
      console.error('Error drawing card:', error);
    }
     finally {
      setLoading(false);
   }
  };

  const [lyrics, setLyrics] = useState('');

  const fetchRapLyrics = async () => {

    const requestBody = {
      inputFromClient: description,
      outputCard: card,
      outputPosition: position
    };

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rap lyrics');
      }
      const data = await response.json();
      setLyrics(data.lyrics);
    } catch (error) {
      console.error('Error fetching rap lyrics:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"
    style={{
      backgroundImage: 'url(/tarot.avif)', // Path to your background image
      backgroundSize: 'cover', // Adjust as needed
      backgroundPosition: 'center', // Adjust as needed
      // Add more background properties as needed
      // width: '100vw', // Example width
      // height: '100vh', // Example height
    }}>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="bg-white text-xl fixed left-0 top-0 flex w-full justify-center pb-6 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:p-4">
         Tarot Reading
        </p>
        <div className="bg-white rounded-lg p-2 fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <Navbar/>
        </div>
      </div>

      {/* <button className="text-xl bg-black text-white py-2 px-8 rounded-lg" onClick={handledrawCard}>        
        Draw Card
      </button> */}

      <div className="flex gap-10">
<div>
   
   { !ques && (<button onClick={()=>{setques(true)}} className="bg-black rounded-lg py-2 px-8 text-white mt-40">Ask question</button>)}
   
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
    <button onClick={handledrawCard} className="mt-20 bg-black rounded-lg py-2 px-8 text-white">Get my reading</button>
    </>
    )}
      <div>
        {lyrics && (
          <div>
            <h2 className="font-bold mb-2">Your Tarot Reading:</h2>
            <p>{lyrics}</p>
          </div>
        )}
      </div>
      </div>
      )}
      </div>

{drawnCard ? (
        <div>
          <h2>Drawn Card: {drawnCard}</h2>
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
