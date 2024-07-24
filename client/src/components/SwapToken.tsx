import React, { useEffect, useState } from 'react';
import { FaWallet, FaExchangeAlt, FaEthereum, FaBitcoin, FaDollarSign } from 'react-icons/fa';
import { MdSwapVert } from "react-icons/md";
import { RiBnbLine } from "react-icons/ri";
import CrowdSaleContract from '../contracts/CrowdSaleContract.ts';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import Loading from './Loading.tsx';
import SuccessModal from './SuccessModal.tsx';
import LCKContract from '../contracts/LCKContract.ts';

declare var window: any;

const SwapToken = () => {
   const [nameToken, setNameToken] = useState("");
   const [amount, setAmount] = useState(0);
   const [equivalent, setEquivalent] = useState(0);

   const [rate, setRate] = useState(0);
   const [web3Provider, setWeb3Provider] = useState<any>();
   const [address, setAddress] = useState('');
   const [balance, setBalance] = useState(0);
   const [txHash, setTxHash] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const getRate = async () => {
      const crowdContract = new CrowdSaleContract();
      const _rate = await crowdContract.getBnbRate();
      setRate(_rate);
   }

   const getBalance = async () => {
      if (web3Provider && address) {
         const lckContract = new LCKContract(web3Provider);
         const balance = await lckContract.balanceOf(address);
         setBalance(balance);
      }
   }
   const connectWallet = async (requestAccess = false) => {
      if (window.ethereum) {
         try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            let accounts: any;
            if (requestAccess) {
               accounts = await provider.send("eth_requestAccounts", []);
            } else {
               accounts = await provider.send("eth_accounts", []);
            }
            if (accounts.length > 0) {
               const signer = provider.getSigner();
               const address = await signer.getAddress();
               setWeb3Provider(provider);
               setAddress(address);
               localStorage.setItem("isWalletConnected", "true");
               //await getBalance();
            } else {
               Swal.fire('Opps', 'Không tài khoản nào được chọn', 'error');
               localStorage.removeItem("isWalletConnected");
            }
         } catch (error) {
            console.log(error);
            localStorage.removeItem("isWalletConnected");
         }
      }
   };

   useEffect(() => {
      if (localStorage.getItem("isWalletConnected") === "true") {
         connectWallet(false); // Kiểm tra trạng thái kết nối hiện tại mà không yêu cầu quyền truy cập
      }
   }, [])

   useEffect(() => {
      const handleAccountsChanged = async (accounts: any) => {
         if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWeb3Provider(provider);
            setAddress(address);
         } else {
            setWeb3Provider(null);
            setAddress("");
            setBalance(0);
            localStorage.removeItem("isWalletConnected");
         }
      };

      const handleDisconnect = () => {
         setWeb3Provider(null);
         setAddress("");
         setBalance(0);
         localStorage.removeItem("isWalletConnected");
      };

      if (window.ethereum) {
         window.ethereum.on("accountsChanged", handleAccountsChanged);
         window.ethereum.on("disconnect", handleDisconnect);
      }

      return () => {
         if (window.ethereum) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("disconnect", handleDisconnect);
         }
      };
   }, []);

   console.log(balance)

   useEffect(() => {
      const handleBlock = () => {
         getBalance(); // Gọi getBalance để cập nhật số dư khi có block mới
      };
      if (web3Provider) {
         const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
         provider.on("block", handleBlock);

         return () => {
            provider.removeListener("block", handleBlock); // Loại bỏ listener khi component bị unmount
         };
      }
   }, [web3Provider]);

   useEffect(() => {
      getRate();
      if (address) {
         getBalance(); // Gọi getBalance khi component mount và có địa chỉ ví
      }
   }, [address]);

   const handleTokenChange = (e: any) => {
      setNameToken(e.target.value);
   };

   const handleAmountChange = (e: any) => {
      const value = e.target.value;
      setAmount(value);
      setEquivalent(value * rate);
   };

   const handleBuyToken = async () => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true)
         const crowdContract = new CrowdSaleContract(web3Provider);
         let hash = await crowdContract.buyTokenByBnB(amount);
         console.log(amount)
         setTxHash(hash);
         setIsOpenModal(true);
      } catch (error) {
         Swal.fire('Opps', 'Giao dịch thất bại', 'error');
      } finally {
         setAmount(0)
         setEquivalent(0)
         setIsLoading(false);
      }
   }

   const getTokenIcon = (nameToken: string) => {
      switch (nameToken) {
         case 'ETH':
            return <FaEthereum className="ml-2" size={22} />;
         case 'BTC':
            return <FaBitcoin className="ml-2 text-red-600" size={28} />;
         case 'USD':
            return <FaDollarSign className="ml-2 text-green-700" size={22} />;
         case 'BNB':
            return <RiBnbLine className="ml-2 text-yellow-600" size={28} />;
         default:
            return null;
      }
   };

   return (
      <div className="flex flex-col min-h-screen">
         {isLoading && <Loading />}
         {isOpenModal && <SuccessModal setIsOpenModal={setIsOpenModal} txHash={txHash} title='Mua token LCK' />}
         <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl">ICO Project</h1>
            <div>
               {(address && web3Provider) ? <>{address} | <span className='text-green-400'> {balance} LCK</span></> :
                  <button
                     onClick={() => connectWallet(true)}
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-[4px] px-4 rounded flex items-center"
                  >
                     <FaWallet className="mr-2" />
                     Connect Wallet
                  </button>}
            </div>
         </header>

         <main className="flex-grow p-4 mt-5">
            <form className="max-w-md mx-auto">
               <div className="mb-4">
                  <label htmlFor="token" className="block text-gray-700 text-sm font-bold mb-2">Select Token:</label>
                  <div className="flex items-center">
                     <select
                        id="token"
                        value={nameToken}
                        onChange={handleTokenChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline appearance-none"
                     >
                        <option value="">-- Select a token --</option>
                        <option value="ETH">Ethereum</option>
                        <option value="BTC">Bitcoin</option>
                        <option value="USD">USD Coin</option>
                        <option value="BNB">BNB Coin</option>
                     </select>
                     {getTokenIcon(nameToken)}
                  </div>
               </div>

               <div className="mb-4">
                  <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Enter Amount:</label>
                  <input
                     id="amount"
                     type="number"
                     value={amount}
                     onChange={handleAmountChange}
                     className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
               </div>
               <MdSwapVert className='mx-auto text-gray-700' size={22} />
               <div className="mb-4">
                  <label htmlFor="equivalent" className="block text-gray-700 text-sm font-bold mb-2">Equivalent (at rate {rate}):</label>
                  <input
                     id="equivalent"
                     type="number"
                     value={equivalent}
                     readOnly
                     className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
               </div>

               <button
                  type="button" onClick={handleBuyToken}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center"
               >
                  Swap
               </button>
            </form>
         </main>

         <footer className="bg-gray-800 text-white p-4 text-center">
            <p>Ads information about the ICO project...</p>
         </footer>
      </div>
   );
};

export default SwapToken;
