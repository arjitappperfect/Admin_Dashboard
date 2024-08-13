import React from 'react'
interface CountingProps {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    count: number;
  } 

const counting:React.FC<CountingProps>=({value,onChange,count})=> {
  return (
    <>
     <div className='bg-blue-200 p-4 rounded-lg mb-6 shadow'>
                    <span className='text-lg font-semibold text-gray-700'>Total User: {count}</span>
                    {/* <Search items ={items}/> */}
                    <input
                        type='text'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Search...'
                        value={value}
                        onChange={onChange}
                    />
                </div>
     
    </>
  )
}

export default counting;
