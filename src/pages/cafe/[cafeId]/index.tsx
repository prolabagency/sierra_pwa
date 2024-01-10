import React, { useState } from 'react'
import axios from '@/axios'
import Header from '@/components/header'
import { CafeType, CategoryType } from '@/types'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next/types';
import Loading from '@/components/UI/Loading'
import Main from '@/components/main'




interface MyProps {
    data: CategoryType[] | null,
    cafe: CafeType | null,
    error: string
}






export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await axios.get('/cafes/all');
    const paths = data.map((cafe: CafeType) => ({
        params: { cafeId: cafe._id.toString() },
    }));

    return {
        paths,
        fallback: true,
    };
};
export const getStaticProps: GetStaticProps<MyProps> = async ({ params }) => {
    try {
        const cafeId = params?.cafeId as string;
        const { data } = await axios.get(`/cafe/${cafeId}`)

        return {
            props: {
                data: data.categories,
                cafe: data.cafe,
                error: '',
            },
        };
    } catch (error) {
        return {
            props: {
                data: null,
                cafe: null,
                error: 'Error fetching data',
            },
        };
    }
};


export default function Index({ data, error }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { locale } = useRouter()
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className='w-full relative font-geo'>
            <Header />
            <div className='sel-no w-full py-3 flex flex-col gap-4'>
                <Swiper
                    className='m-0'
                    spaceBetween={10}
                    slidesPerView={3}
                    navigation
                    loop
                    speed={200}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    initialSlide={activeIndex}
                >
                    {
                        !(data && !error) ? <Loading /> : null
                    }
                    {data ? data.map((item: CategoryType, index) => (
                        <SwiperSlide key={item._id}>
                            <div className={`w-full flex justify-center `}>
                                <h1 onClick={() => setActiveIndex(index)} className={`${activeIndex == index ? 'text-primary' : 'text-white'}  overflow-hidden whitespace-nowrap overflow-ellipsis  cursor-pointer text-[20px]`}>{locale == 'ru' ? item.title : item.title_ky ?? item.title}</h1>
                            </div>
                        </SwiperSlide>
                    ))
                        : null
                    }
                </Swiper>
            </div>
            {
                data ? <Main cat={data[activeIndex]} /> : null
            }

        </div >
    )
}

