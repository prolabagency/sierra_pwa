import { FoodsType } from '@/types'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
export default function CartCounter({ item }: { item: FoodsType }) {
    const { locale } = useRouter()
    const [cart, setCart] = useState<FoodsType[]>([])
    const [itemVal, setItemVal] = useState<any>({})
    const [isCart, setIsCart] = useState(false)
    useEffect(() => {
        let myCart = JSON.parse(localStorage.getItem('cart') ?? '[]')
        let myChangedItem = myCart.find((el: FoodsType) => el._id == item._id)
        if (myChangedItem) {
            setItemVal(({ ...item, count: myChangedItem.count }))
            setIsCart(true)
        } else {
            setIsCart(false)
            setItemVal({ ...item, count: 1 })
        }
        setCart(myCart)
    }, [item._id])


    useEffect(() => {
        let data = cart.map(el => el._id == item._id ? itemVal : el)
        localStorage.setItem('cart', JSON.stringify(data))
    }, [itemVal.count, cart])


    const handlePlus = () => {
        setItemVal((prev: any) => ({ ...prev, count: prev.count + 1 }))
    }
    const handleMinus = () => {
        if (itemVal.count > 1) {
            setItemVal((prev: any) => ({ ...prev, count: prev.count - 1 }))
        }
    }
    const handleAdd = () => {
        if (isCart) {
            setCart(prev => prev.filter(el => el._id != item._id))
        } else {
            setCart(prev => [...prev, itemVal])
        }
        setIsCart(prev => !prev)
    }

    return (
        <div className='flex justify-between relative z-10 gap-5'>
            <div className='text-white flex gap-3 items-center font-extrabold'>
                <button className='w-5 h-5' onClick={handleMinus}>
                    <Image className='text-white ' height={20} width={20} src="/vectors/arrow.png" alt="-" />
                </button>
                {itemVal.count}
                <button className='w-5 h-5' onClick={handlePlus}>
                    <Image className='text-white rotate-180' height={20} width={20} src="/vectors/arrow.png" alt="+" />
                </button>
            </div>
            <div>
                <button onClick={handleAdd} className='text-primary flex border border-primary rounded-md px-8 py-3 gap-2'>{locale == 'ru' ? 'Добавить' : 'Тандоо'}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={`${isCart ? 'fill-primary' : 'fill-transparent'} stroke-primary`} d="M9.15299 5.408C10.42 3.136 11.053 2 12 2C12.947 2 13.58 3.136 14.847 5.408L15.175 5.996C15.535 6.642 15.715 6.965 15.995 7.178C16.275 7.391 16.625 7.47 17.325 7.628L17.961 7.772C20.421 8.329 21.65 8.607 21.943 9.548C22.235 10.488 21.397 11.469 19.72 13.43L19.286 13.937C18.81 14.494 18.571 14.773 18.464 15.117C18.357 15.462 18.393 15.834 18.465 16.577L18.531 17.254C18.784 19.871 18.911 21.179 18.145 21.76C17.379 22.342 16.227 21.811 13.925 20.751L13.328 20.477C12.674 20.175 12.347 20.025 12 20.025C11.653 20.025 11.326 20.175 10.671 20.477L10.076 20.751C7.77299 21.811 6.62099 22.341 5.85599 21.761C5.08899 21.179 5.21599 19.871 5.46899 17.254L5.53499 16.578C5.60699 15.834 5.64299 15.462 5.53499 15.118C5.42899 14.773 5.18999 14.494 4.71399 13.938L4.27999 13.43C2.60299 11.47 1.76499 10.489 2.05699 9.548C2.34999 8.607 3.57999 8.328 6.03999 7.772L6.67599 7.628C7.37499 7.47 7.72399 7.391 8.00499 7.178C8.28499 6.965 8.46499 6.642 8.82499 5.996L9.15299 5.408Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
