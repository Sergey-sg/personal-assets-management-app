import React, { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import logo from '../assets/images/maglo_logo_invoice.png'

const MagloBaner: React.FC = () => {
  return (
    <div className="grid grid-rows-1 grid-flow-col columns-2 bg-black rounded-xl text-white py-5">
      <div className="container">
        <img className="float-left px-5" src={logo} alt="Logo" />
        <div className='px-5'>
          <div className="font-bold text-lg">Maglo</div>
          <div className="font-light">sales@maglo.com</div>
        </div>
      </div>
      <div className="container text-right font-medium px-5">
        <div>1333 Grey Fox Farm Road</div>
        <div>Houston, TX 77060</div>
        <div>Bloomfield Hills, Michigan(MI), 48301</div>
      </div>
    </div>
  );
};

const InvoiceInfoBaner: React.FC = () => {
  return (
    <div className="grid grid-rows-1 grid-flow-col columns-2 bg-[#F8F8F8] rounded-xl p-5">
      <div className="container">
        <div className="font-bold text-lg">Invoice Number</div>
        <br/>
        <div className="font-medium text-[#78778B]">MAG 2541420</div>
        <div className="font-medium text-[#78778B]">Issued Date: 10 Apr 2022</div>
        <div className="font-medium text-[#78778B]">Due Date: 20 Apr 2022</div>
      </div>
      <div className="container text-right">
        <div className="font-bold text-lg">Billed to</div>
        <br/>
        <div className="font-medium text-[#78778B]">Sajib Rahman</div>
        <div className="font-medium text-[#78778B]">3471 Rainy Day Drive</div>
        <div className="font-medium text-[#78778B]">Needham, MA 02192</div>
      </div> 
    </div>
  );
};

function InvoiceItemForm() {

  const [invoiceItems, setInvoiceItem] = useState([{}]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const InvoiceItems: React.FC = () => {
  
    const InputItem: React.FC = () => {
      const [name, setName] = useState('');
      const [number, setNumber] = useState('');
      const [price, setPrice] = useState('');

      function submitValue(e: any) {
        e.preventDefault();
        const sum = (obj: any) => {
          return Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);
        }
        const item = {
          id: Date.now(),
          name: name,
          number: number,
          price: price,
          total: parseFloat(price) * parseFloat(number) || 0
        };
        if (item.name && item.price && item.number) {
          if (Object.keys(invoiceItems[0]).length !== 0) {
            setInvoiceItem([...invoiceItems, item]);
          } else {
            setInvoiceItem([item]);
          }
          const sub = sum([...invoiceItems.map((itemOld: any) => itemOld.total), item.total]);
          setSubTotal(sub);
          setTotal(sub);
        }
      }

      return (
        <div className="columns-4">
          <div className="border border-[#F5F5F5] rounded-xl p-4"><input type={"text"} name="name" onChange={(e) => setName(e.target.value)}/></div>
          <div className="border border-[#F5F5F5] rounded-xl p-4"><input type={"number"} name="number" onChange={(e) => setNumber(e.target.value)}/></div>
          <div className="border border-[#F5F5F5] rounded-xl p-4"><input type={"number"} name="price" onChange={(e) => setPrice(e.target.value)}/></div>
          <button className="text-[#29A073] border border-[#F5F5F5] rounded-xl p-4" onClick={submitValue}>Add Item</button>
        </div>
      );
    }
  
    if (Object.keys(invoiceItems[0]).length !== 0) {
      return (
        <div className="font-medium">
          { invoiceItems.map( (item: any) => 
            <div key={item.id}>
              <div className="columns-4">
                <div className="border border-[#F5F5F5] rounded-xl p-4">{item.name}</div>
                <div className="text-center border border-[#F5F5F5] rounded-xl py-4">{item.number}</div>
                <div className="text-center border border-[#F5F5F5] rounded-xl py-4">${item.price}</div>
                <div className="text-right border border-[#F5F5F5] rounded-xl p-4">${item.total}</div>
              </div>
              <br/>
            </div>
          )}
          <InputItem/>
        </div>
      );
    } else { 
      return (<InputItem/>);
    }
    
  }

  return (
    <div>
      <div className="text-base font-bold">Item Details</div>
      <ReactTextareaAutosize className="w-full" name="detail" placeholder='Details item with more info'/>
      <br/>
      <br/>
      <div className="w-full">
        <div>
          <div className="text-[#929EAE] columns-4">
            <div className="text-left pl-4">ITEM</div>
            <div className="text-center">NUMBER OF ITEMS</div>
            <div className="text-center">PRICE</div>
            <div className="text-right pr-4">TOTAL PRICE</div>
          </div>
        </div>
        <br/>
        <InvoiceItems />
      </div>
      <br/>
      <div className="grid grid-rows-1 grid-flow-col columns-2">
        <div>
          {/* <button onClick={addNewItemRow} className="text-left text-[#29A073] px-4">Add Item</button> */}
        </div>
        <div className="columns-1"><br/></div>
        <div className="text-right">
          <div className="columns-1">
            <div className="columns-2 pb-4 px-4">
              <div>Subtotal</div>
              <div>${subTotal}</div> 
            </div> 
            <div className="columns-2 pb-4 px-4">
              <div>Discount</div>
              <button className="text-[#29A073]">Add</button>  
            </div> 
            <div className="columns-2 pb-4 px-4">
              <div>Tax</div>
              <button className="text-[#29A073]">Add</button> 
            </div>
            <hr className="border-[#E5E5E5]"/>
            <div className="columns-2 pt-4 px-4">
              <div>Total</div>
              <div>${total}</div> 
            </div>
          </div>      
        </div>
      </div>
    </div>
  );
}

const InvoiceCreatePage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold py-3 rounded-md">
        New Invoices: MGL524874
      </h1>
      <MagloBaner />
      <br/>
      <InvoiceInfoBaner />
      <br/>
      <InvoiceItemForm />
    </div>
  );
};

export default InvoiceCreatePage;
