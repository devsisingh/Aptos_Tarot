import React, {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";

const truncateDescription = (
  description,
  maxLength
) => {
  const words = description.split(" ");
  const truncatedWords = words.slice(0, maxLength);
  return truncatedWords.join(" ") + (words.length > maxLength ? "..." : "");
};

const NftdataCard = ({
  metaData,
}) => {

  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchMetaData = async () => {
    const ipfsCid = metaData.token_uri.replace("ipfs://", "");

  setImageSrc(ipfsCid);
    }
    fetchMetaData();
  }, [metaData]);

  if (!metaData) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div
          className="w-full h-72 p-5 bg-center bg-cover"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="animate-spin rounded-full h-32 w-32 mx-auto border-t-2 border-b-2 border-green-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl" 
    style={{ 
      boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
      backgroundColor: "rgba(255, 255, 255, 0.7)"}}>
      <div className="w-full h-full rounded-lg p-4">
        <div>
        <div className="text-black mt-2 font-semibold text-sm">{new Date(metaData.token_properties["PROPERTY_KEY_TIMESTAMP"]* 1000).toLocaleString()}</div>

          <div className="justify-end flex">

        <Link href={`https://explorer.aptoslabs.com/txn/${metaData.last_transaction_version}/?network=mainnet`} target="_blank">
        <div className="flex gap-4 text-black">
        <div className="text-lg mt-4 font-bold">View on explorer</div>
              <img src="/reviewicon.gif" alt="" className="" width="80" height="50" />
              </div>
              </Link>
              </div>
          <div className="flex flex-row gap-4">
            <div className="w-1/2">
            <div className="text-black text-center mb-2 font-semibold" style={{fontStyle:'italic'}}>{metaData.token_properties["PROPERTY_KEY_CARD_NAME"]}</div>
            {metaData.token_properties["PROPERTY_KEY_CARD_POSITION"] === "upright" ? (
              <img
                      alt="alt"
                      src={`${
                        "https://nftstorage.link/ipfs"
                      }/${imageSrc}`}
                      className=""
                    />
            ):(
              <img
                alt="alt"
                src={`${
                  "https://nftstorage.link/ipfs"
                }/${imageSrc}`}
                className=""
                style={{ transform: "rotate(180deg)" }}
              />
            )}
            <div className="text-center text-black w-1/2 mx-auto mt-4 rounded-lg" style={{border:'1px solid #5A639C', backgroundColor:'#F9D689'}}>
            <Link href={`/nfts/${metaData.token_data_id}`} >Share</Link>
            </div>
            </div>
            <div className="w-full">
              <h3 className="leading-12 mb-2 text-black">
                <div className="lg:flex md:flex justify-between">
                  <div className="text-xl font-bold mt-6">
                        {metaData.token_name}
                  </div>
                </div>
              </h3>

{metaData.token_properties["PROPERTY_KEY_QUESTION"] ? (
  <div className="text-sm text-black text-start flex mt-2 font-bold">
  Question : {metaData.token_properties["PROPERTY_KEY_QUESTION"]}
</div>
) :(
  <div className="text-sm text-black text-start flex mt-2 font-bold">
    Horoscope: {metaData.token_properties["PROPERTY_KEY_HOROSCOPE"]}
                </div>
)}

              <div className="rounded-xl">
                <div className="text-sm text-black text-start flex mt-4">
                    {metaData.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftdataCard;
