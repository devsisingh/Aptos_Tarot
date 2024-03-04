import React, {useEffect, useState} from "react";
import axios from "axios";

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
  const [attributes, setAttributes] = useState(null);

  useEffect(() => {
    const fetchMetaData = async () => {
      const ipfsCid = metaData?.current_token_data?.token_uri.replace("ipfs://", "");

  // Fetching metadata from IPFS
  const metadataResponse = await axios.get(`https://ipfs.io/ipfs/${ipfsCid}`);
  const metadata = metadataResponse.data;

  console.log("Metadata minted readings:", metadata);
  setImageSrc(metadata?.image.replace("ipfs://", ""));
  setAttributes(metadata?.attributes);
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
    <div className="w-full rounded-2xl" style={{ backgroundColor:'#202333', border: '1px solid #0162FF'}}>
      <div className="w-full h-full rounded-lg p-4">
        <div>
          <div className="flex flex-col">
            <div className="">
              <img
                      alt="alt"
                      src={`${
                        "https://nftstorage.link/ipfs"
                      }/${imageSrc}`}
                      className=""
                    />
            </div>
            <div className="w-full">
              <h3 className="leading-12 mb-2 text-white">
                <div className="lg:flex md:flex justify-between">
                  <div className="text-xl font-semibold mt-6">
                    
                    {
                      metaData.current_token_data.token_name.slice(0, 4) === "ipfs" ? (
                        <div>
                          {metaData.current_token_data.token_name.slice(0, 4)}...{metaData.current_token_data.token_name.slice(-4)}
                        </div>
                      ):(
                        <div>
                        {metaData.current_token_data.token_name}
                        </div>
                      )
                    }
                    
                  </div>
                </div>
              </h3>

              <div className="rounded-xl">
                <div className="text-sm text-white text-start flex mt-2">
                  <div className="">
                    {metaData.current_token_data.description}
                  </div>
                </div>
              </div>

              {attributes && (
                <div className="flex-wrap flex gap-2 text-xs text-white rounded-full px-4 py-2 mt-4" style={{backgroundColor:'#0162FF'}}>
                  <div>Role: {attributes.Role}</div>
                  <div className="ml-4">Agility: {attributes.Agility}</div>
                  <div className="ml-4">Strength: {attributes.Strength}</div>
                  <div>Endurance: {attributes.Endurance}</div>
                  <div className="ml-4">Intelligence: {attributes.Intelligence}</div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftdataCard;
