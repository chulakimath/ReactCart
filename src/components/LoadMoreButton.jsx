import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { FaCartShopping } from "react-icons/fa6";
const LoadMoreButton = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([])
    const [count, setCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartshow, setCartShow] = useState(false)
    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`https://dummyjson.com/products?limit=20&skip=${count === 0 ? 0 : count * 20}`);
            const data = await response.json();
            // console.log(data);
            if (data && data.products && data.products.length > 0) {
                setProducts(prev => [...prev, ...data.products]);
                setLoading(false)
            }

        } catch (e) {
            setLoading(false)
            setErrorMsg("Error has occoured due to - ", e.message);
        }
    }
    useEffect(() => {
        fetchProducts()
    }, [count]);
    // imp!!!!!
    useEffect(() => {
        if (products && products.length === 100) {
            setLoadMoreDisabled(true)
        }
    }, [products]);

    const handleLoadMore = () => {
        setCount(prev => prev + 1)
    }

    if (loading) {
        return (<div
            className='text-3xl text-blue-500 bg-slate-100 p-4 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
            Loading
        </div>)
    }
    if (errorMsg) {
        return (<div
            className='text-3xl text-red-400 bg-slate-200 p-4 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
            some error has occoured
        </div>)
    }
    const handlAddButton = (obj) => {
        setCart(prev => {
            const exist = prev.some((item) => item.id === obj.id);
            if (exist) {
                toast('product already exists in cart', {
                    icon: '👍',
                    duration: 4000,
                });
                return prev;
            }
            toast.success('Item added to Cart!', { duration: 4000, })
            return [...prev, obj]
        });
        // setCart(prev => {
        //     console.log(prev);
        //     return prev
        // })
    }

    return (
        <>
            <Toaster
                position="top-left"
                reverseOrder={false}
            />
            <div className='grid sm:grid-cols-4 gap-3 mx-2 my-2'>
                <div
                    onMouseLeave={() => { setCartShow(false) }}
                    className='bg-gray-400/60 px-4 py-4 rounded-full  right-5  top-5 fixed text-black transition-all duration-300'>
                    {/* <div
                        hidden={cartshow ? true : false}
                        className='absolute -top-3 -right-2 text-xl bg-red-400 rounded-full px-2 select-none text-white'>{cart.length}</div> */}
                    <div
                        hidden={cartshow ? true : false}
                        className='text-xl hover:scale-125 relative'>

                        <span>
                            <FaCartShopping className='cursor-pointer' onClick={() => { setCartShow(prev => !prev) }} />
                        </span>
                        {/* <span>
                            {cart.length}
                        </span> */}
                    </div>
                    <div
                        hidden={cartshow ? false : true}
                        className='bg-white w-auto h-auto p-4 m-2 rounded-xl text-left text-xl transition-all duration-300'>
                        <div className='flex gap-4 items-center'> <FaCartShopping color='blue' size={'25px'} /> <div className='-pt-2'> : {cart.length}</div></div>
                        <div> total : ${cart.reduce((accumulator, item) => accumulator + item.price, 0).toFixed(2)}</div>
                    </div>
                </div>
                {products && products.length > 0 ?
                    products.map((item, index) => (
                        <div
                            key={index + Date.now()}

                            className='border border-blue-500' >
                            <div className='flex flex-col items-center'>
                                <div className='my-2 p-2 '>
                                    <img className='w-[200px] h-[150px] object-scale-down hover:scale-110 transition-all duration-200' src={item.thumbnail} alt="image of product" />
                                </div>
                                <div className='p-2 text-clip truncate'>
                                    <p className='w-full text-wrap text-center'>{item.brand} {item.title}</p>
                                </div>
                                <div>
                                    price:${item.price}
                                </div>
                                <div className='truncate w-[310px] h-full p-4'>
                                    {item.description}
                                </div>
                                <button
                                    onClick={() => handlAddButton({ price: item.price, id: item.id })}
                                    className='bg-blue-400 rounded-lg px-4 py-2 mb-2'>Add <span className='text-white'>+</span></button>
                            </div>

                        </div>
                    ))
                    : null}
            </div>
            <div className='flex justify-center m-3'>
                <button
                    disabled={loadMoreDisabled}
                    onClick={handleLoadMore}
                    className={` ${loadMoreDisabled ? "bg-gray-800/50 text-white" : "bg-blue-300 text-black "} px-4 py-2 rounded-md cursor-pointer`}>Load More</button>
            </div>
            <div className='flex justify-center'>
                {loadMoreDisabled ? "Yoe have reached limit of 100" : null}
            </div>

        </>
    )
}

export default LoadMoreButton