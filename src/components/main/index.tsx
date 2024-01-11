'use client'
import { CategoryType, FoodsType, SubcatType } from '@/types'
import React, { useEffect, useState } from 'react'
import axios from '@/axios'
import Loading from '../UI/Loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useRouter } from 'next/router';
import TextSpace from '../UI/TextSpace';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css/effect-coverflow';
import Image from 'next/image';
import CartCounter from '../cart/CartCounter';

interface Props {
    data: SubcatType[] | null,
    error: string,
    loading: boolean
}


export default function Index({ cat }: { cat: CategoryType }) {
    const { locale } = useRouter()
    const [{ data, loading, error }, setData] = useState<Props>({
        data: null,
        error: '',
        loading: true
    })
    const [activedItem, setACtivedItem] = useState<FoodsType | undefined>(undefined)
    const [activedCatIndex, setActivedCatIndex] = useState(0)
    const [activeIndex, setActivedIndex] = useState(0)

    useEffect(() => {
        if (cat) {
            axios.get(`/subcats/${cat._id}`)
                .then((res) => {
                    setData(prev => ({ data: res.data, loading: false, error: '' }))
                    if (res.data.length < 1) {
                        setACtivedItem(undefined)
                    }
                    setACtivedItem(res.data[activedCatIndex].value[activeIndex])
                })
                .catch((err) => setData(prev => ({ ...prev, error: err?.response?.data.error ?? "Ошибка при получении", loading: false })))
        }
    }, [cat])

    return (
        <div className='flex w-full flex-col h-[85vh] main-container relative'>
            {
                loading ? <Loading /> : null
            }
            {
                (data && data.length > 0) ? <Swiper
                    className='m-0 w-full'
                    slidesPerView={1}
                    direction='vertical'
                    initialSlide={0}
                    speed={200}
                    scrollbar={{ draggable: true }}
                    onSlideChange={(swiper) => {
                        setActivedIndex(0)
                        if (data.at(swiper.activeIndex)?.value?.length) {
                            setACtivedItem(data.at(swiper.activeIndex)?.value?.at(0))
                        }
                        setActivedCatIndex(swiper.activeIndex)
                    }}
                >
                    {data && data.length > 0 ? data.map((item: SubcatType) => {
                        if (!item.value?.length) {
                            return null
                        }
                        return (
                            <>
                                <h1>asdasd</h1>
                                <SwiperSlide key={item._id}>
                                    <div className={`w-full`}>
                                        <TextSpace text={locale == 'ru' ? item.title || item.title_ky : item.title_ky || item.title} />
                                        <Swiper
                                            className='m-0 w-full min-h-[300px] overflow-auto'
                                            slidesPerView={1}
                                            initialSlide={0}
                                            centeredSlides
                                            modules={[EffectCoverflow, Pagination]}
                                            effect='coverflow'
                                            coverflowEffect={{
                                                rotate: 0,
                                                stretch: 150,
                                                depth: 200,
                                                modifier: 1,
                                                slideShadows: false,
                                                scale: .4,
                                            }}
                                            direction='horizontal'
                                            speed={400}
                                            scrollbar={{ draggable: true }}
                                            onSlideChange={(swiper) => {
                                                setActivedIndex(swiper.activeIndex)
                                                setACtivedItem(item?.value ? item.value[swiper.activeIndex] : undefined)

                                            }}
                                        >
                                            {item.value.map((item: FoodsType, index) => {

                                                return (
                                                    <>
                                                        <SwiperSlide className='h-full w-[80%] my-food-swiper min-w-[300px]' key={item._id}>
                                                            <div className={`w-full h-full flex justify-center items-center mb-4`}>
                                                                <div className='w-full flex flex-col justify-center items-center'>
                                                                    {
                                                                        activeIndex == index ?
                                                                            <h1 className='text-white text-[24px] mt-2 text-center'>{locale == 'ru' ? item.title ?? item.title_ky : item.title_ky ?? item.title} </h1>
                                                                            : null
                                                                    }
                                                                    <div className='w-full justify-center items-center flex h-full'>
                                                                        <Image width={250} height={250} src={`https://online-back-8jc6.onrender.com${item.img}`} alt="Img" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>

                                                    </>
                                                )
                                            })
                                            }
                                        </Swiper>
                                    </div>
                                </SwiperSlide>

                            </>

                        )
                    })
                        : null
                    }
                </Swiper> : null
            }
            {
                activedItem ? <div className='w-full min-h-40 on-line absolute bottom-8'>
                    <div className='px-4 py-2'>
                        <div className='flex flex-col'>
                            <p className='text-white font-light food-desc'>{locale == 'ru' ? activedItem.desc || activedItem.desc_ky : activedItem.desc_ky || activedItem.desc}</p>
                            <button className='text-primary self-end mr-2 underline cursor-pointer'>{locale == 'ru' ? 'Подробно' : 'Маалымат'}</button>
                        </div>
                        <div className='flex flex-col px-9 gap-5'>
                            <h1 className='text-white text-center font-extrabold'>{activedItem.size} / {activedItem.price}c</h1>
                            <div className='flex justify-between'>
                                <CartCounter item={activedItem} />
                            </div>
                        </div>
                    </div>
                </div>
                    : null
            }
            {
                (data?.length == 0) ?
                    <div className={`w-full px-4 relative m-0 overflow-hidden h-full flex justify-center items-center`}>
                        <TextSpace line={true} text={locale == 'ru' ? 'Ой а тут пусто :(' : "Ой бул жерде бош :("} />
                    </div>
                    : null
            }

        </div >
    )
}
