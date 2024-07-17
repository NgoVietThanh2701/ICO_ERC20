import React, { useEffect } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const showShortAddress = (address: string, amount: number): string => {
   return `${address?.substring(0, amount)}...${address?.substring(
      address.length - amount,
      address.length
   )}`
}

const SuccessModal = ({ txHash, title, setIsOpenModal }: any) => {

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center'>
         <div className='flex flex-col gap-3 mt-10 items-center h-[165px] w-[400px] bg-[#272F3E] relative group rounded-lg py-4'>
            <button className='absolute top-2 right-2' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline color='white' size={24} />
            </button>
            <h3 className='text-white text-3xl'>{title}</h3>
            <p className='text-white text-sm'>(Giao dịch thành công)</p>
            <Link to={`https://testnet.bscscan.com/tx/${txHash}`} target='_blank' className='bg-[#fedf56] rounded-lg px-2  py-2 text-333 '>
               {showShortAddress(txHash, 18)}
            </Link>
         </div>
      </div>
   )
}

export default SuccessModal