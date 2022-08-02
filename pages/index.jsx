import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {NFTCard} from "./components/nftCard"

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [pages, setPages] = useState(0);
  const [loadPage, setLoadPage] = useState(1);
  const [nftChunk, setNftChunk] = useState([]);
  const [fetchForCollection, setFetchForCollection]=useState(false);

  const fetchNFTs = async() => {
    let nfts; 
    console.log("fetching nfts");
    const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: 'GET'
      };
     
      const fetchURL = `${baseURL}?owner=${wallet}`;
  
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
      setPages(0);
      setLoadPage(1);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts);
        setPages(0);
        setLoadPage(1);
      }
    }
  }

  useEffect(() => {
      const loadSelectedPageData = (page) => {
        console.log("-----------loadSelectedPageData--------------");
        let start = (page-1) * 10;
        let end = start+9;
        let nftChunk = NFTs.slice(start, end);
        console.log('----NFTS:', NFTs)
        console.log('----nftChunk:', nftChunk)
        setNftChunk(nftChunk);
        setPages(Math.ceil(NFTs.length/10));
      }
      loadSelectedPageData(loadPage);
  }, [NFTs, loadPage]);
  

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection}  className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            }else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          nftChunk.length && nftChunk.map((nft,i) => {
            return (
              <NFTCard key={i} nft={nft}></NFTCard>
            )
          })
        }
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          pages > 0 && (
            [...Array(pages)].map((elementInArray, index) => ( 
              (index+1) == loadPage ? (
                  <button className={"text-white bg-red-400 px-3 py-1 mt-1"} key={index} onClick={() => {setLoadPage(index+1)}}>{index+1}</button>
              ):(
                  <button className={"text-white bg-blue-400 px-3 py-1 mt-1"} key={index} onClick={() => {setLoadPage(index+1)}}>{index+1}</button>
              )
              ))
          )
        }
      </div>
    </div>
  )
}

export default Home