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
 
export function InvoiceInfoBaner (props: any) {
    return (
      <div className="grid grid-rows-1 grid-flow-col columns-2 bg-[#F8F8F8] rounded-xl p-5">
        <div className="container">
          <div className="font-bold text-lg">Invoice Number</div>
          <br />
          <div className="font-medium text-[#78778B]">MAG 2541420</div>
          <div className="font-medium text-[#78778B]">
            Issued Date: 10 Apr 2022
          </div>
          <div className="font-medium text-[#78778B]">Due Date: 20 Apr 2022</div>
        </div>
        <div className="container text-right">
          <div className="font-bold text-lg">Billed to</div>
          <br />
          <div className="font-medium text-[#78778B]">Sajib Rahman</div>
          <div className="font-medium text-[#78778B]">3471 Rainy Day Drive</div>
          <div className="font-medium text-[#78778B]">Needham, MA 02192</div>
        </div>
      </div>
    )
}

export function FooterItems (props: any) {
    return (
      <div className="grid grid-cols-7 gap-4 font-semibold text-right">
        <div className="col-span-4"></div>
        <div className="col-span-3">
          <div className="grid grid-cols-4 gap-4 p-3">
            <div className="col-span-2">Subtotal</div>
            <div className="col-span-2 mx-auto">${props.subTotal}</div>
          </div>
          <div className="grid grid-cols-4 gap-4 p-3">
            <div className="col-span-2">Discount</div>
            <button className="text-[#29A073] col-span-2 w-2/4 mx-auto">
              Add
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 p-3">
            <div className="col-span-2">Tax</div>
            <button className="text-[#29A073] col-span-2 w-2/4 mx-auto">
              Add
            </button>
          </div>
          <hr className="col-span-2 border-[#E5E5E5]" />
          <div className="grid grid-cols-4 gap-4 p-3">
            <div className="col-span-2">Total</div>
            <div className="col-span-2 mx-auto">${props.total}</div>
          </div>
        </div>
      </div>
    )
  }