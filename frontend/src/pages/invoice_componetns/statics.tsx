import React from 'react';
import logo from '../../assets/images/maglo_logo_invoice.png';

export const MagloBaner: React.FC = () => {
    return (
        <div className="grid grid-rows-1 grid-flow-col columns-2 bg-black rounded-xl text-white py-5">
        <div className="container">
            <img className="float-left px-5" src={logo} alt="Logo" />
            <div className='columns-1'>
            <div className="font-bold text-lg">Maglo</div>
            <div className="font-light">sales@maglo.com</div>
            </div>
        </div>
        <div className="container columns-1 text-right font-medium px-5">
            <div>1333 Grey Fox Farm Road</div>
            <div>Houston, TX 77060</div>
            <div>Bloomfield Hills, Michigan(MI), 48301</div>
        </div>
        </div>
    );
};

export const HeaderItems: React.FC = () => {
    return (
        <div className="container py-4 grid grid-cols-12 gap-4 text-[#929EAE] font-semibold">
        <div className="text-left pl-4 col-span-5">ITEM</div>
        <div className="text-center col-span-3">NUMBER OF ITEMS</div>
        <div className="text-center col-span-2">PRICE</div>
        <div className="text-right pr-4 col-span-2">TOTAL PRICE</div>
        </div>
    )
}
  