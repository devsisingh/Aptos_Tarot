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
    <div className="w-full rounded-2xl" style={{ backgroundColor:'#202333', border: '1px solid #0162FF'}}>
      <div className="w-full h-full rounded-lg p-4">
        <div>
          <div className="flex gap-4 text-white">
        <Link href={`https://explorer.aptoslabs.com/txn/${metaData.last_transaction_version}/?network=randomnet`} target="_blank">
              <img src="/reviewicon.png" alt="" className=" p-1 w-2 h-2"/>
              </Link>
              <div>View on explorer</div>
              </div>
          <div className="flex flex-row gap-4">
            <div className="w-1/2">
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
                  <div className="text-xl font-bold mt-6">
                        {metaData.token_name}
                  </div>
                </div>
              </h3>

              <div className="rounded-xl">
                <div className="text-sm text-white text-start flex mt-2">
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
