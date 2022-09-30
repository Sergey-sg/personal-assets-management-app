import React from 'react'

const InvoicesPage = () => {
  return (
    <div className='container mx-auto mb-10'>
      <h1 className="container text-3xl font-bold rounded-md px-10 pt-4">Invoices</h1>
      <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className='container col-span-1 grid grid-cols-12 gap-4'>
          <input className='col-span-3' placeholder='Search invoices' name='searchInput' />
          <button className='col-span-3'>Create Invoice</button>
          <button className='col-span-3'>Filters</button>
        </div>
        <div className='container col-span-1'>
          <div>NAME/CLIENT</div>
          <div>DATE</div>
          <div>ORDERS/TYPE</div>
          <div>TOTAL</div>
          <div>STATUS</div>
          <div>ACTION</div>
        </div>
        <a href='create'>new invoice</a>
        </div>  
    </div>
  )
}

export default InvoicesPage
