import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { shareOnTwitter } from './shareOnTwitter';

const NftShareCard = ({ metaData }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchMetaData = async () => {
      const ipfsCid = metaData.token_uri.replace("ipfs://", "");

      setImageSrc(ipfsCid);
    };
    fetchMetaData();
  }, [metaData]);


    const handleShare = () => {
      const url = window.location.href; // The URL you want to share
      const text = "Check this out🤩 Got my reading done through Aptos Tarot✨"; // Custom text for the tweet
      const hashtags = ["Aptos", "NFT", "Tarot", "Reading", "Horoscope"]; // Hashtags
      const imageUrl = "";

      shareOnTwitter(url, text, hashtags, imageUrl);
    };

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
    <div className="w-full rounded-2xl">
      <div className="w-full h-full rounded-lg p-4">
        <div>
          <div className="flex flex-row">
            <div className="">
              <div
                className="text-white text-center mb-2 font-semibold"
                style={{ fontStyle: "italic" }}
              >
                {metaData.token_properties["PROPERTY_KEY_CARD_NAME"]}
              </div>
              {metaData.token_properties["PROPERTY_KEY_CARD_POSITION"] ===
              "upright" ? (
                <img
                  alt="alt"
                  src={`${"https://nftstorage.link/ipfs"}/${imageSrc}`}
                  width="550"
                />
              ) : (
                <img
                  alt="alt"
                  src={`${"https://nftstorage.link/ipfs"}/${imageSrc}`}
                  width="550"
                  style={{ transform: "rotate(180deg)" }}
                />
              )}
            </div>
            <div
              className="w-1/2 rounded-3xl p-10"
              style={{
                boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <div className="text-black font-semibold text-sm">
                {new Date(
                  metaData.token_properties["PROPERTY_KEY_TIMESTAMP"] * 1000
                ).toLocaleString()}
              </div>

              <h3 className="leading-12 mb-2 text-black">
                <div className="text-2xl font-bold mt-6">
                  {metaData.token_name}
                </div>
              </h3>

              {metaData.token_properties["PROPERTY_KEY_QUESTION"] ? (
                <div className="text-2xl text-black text-start flex mt-2 font-bold">
                  Question :{" "}
                  {metaData.token_properties["PROPERTY_KEY_QUESTION"]}
                </div>
              ) : (
                <div className="text-2xl text-black text-start flex mt-2 font-bold">
                  Horoscope:{" "}
                  {metaData.token_properties["PROPERTY_KEY_HOROSCOPE"]}
                </div>
              )}

              <div className="text-xl text-black text-start flex mt-4 w-2/3">
                {metaData.description}
              </div>

<div className="flex gap-10 w-full">
              <Link
                href={`https://explorer.aptoslabs.com/txn/${metaData.last_transaction_version}/?network=mainnet`}
                target="_blank"
              >
                <div
                  className="text-lg font-bold border px-10 py-3 text-black z-10 text-center rounded-xl"
                  style={{ border: "1px solid black", marginTop: "50px" }}
                >
                  View on explorer
                </div>
              </Link>

                <button
                  className="text-lg font-bold border px-10 py-3 text-black z-10 text-center rounded-xl"
                  style={{ border: "1px solid black", marginTop: "50px" }}
                  onClick={handleShare}
                >
                  Share on Twitter
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftShareCard;
