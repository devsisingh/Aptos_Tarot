"use client";
import React from "react";
import NftdataCard from "./NftdataCard";
import Link from "next/link";

const NftdataContainer = ({
  metaDataArray,
  MyReviews = false,
}) => {
  const handleReviewDeleted = () => {
    window.location.reload();
  };

  const renderNoReviewsFound = () => (
    <div className="w-full text-center mt-40">
      <h2 className="font-bold text-white" style={{fontSize:30}}>No Readings Minted</h2>
      <div className="text-black font-bold rounded-full mx-auto mt-4" style={{backgroundColor:'#E8C6AA', paddingTop:10, paddingBottom:10}}>
        <Link href="/">Mint Now</Link>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="mx-auto lg:px-10 min-h-screen py-10"
      >
        {metaDataArray?.length === 0 ? (
          renderNoReviewsFound()
        ) : (
          <div
          className="grid-container"
          >
            {metaDataArray?.map((metaData, index) => (
              <div
                key={index}
                className="py-2 flex"
              >
                <NftdataCard
                  metaData={metaData}
                  MyReviews={MyReviews}
                  onReviewDeleted={handleReviewDeleted}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NftdataContainer;
