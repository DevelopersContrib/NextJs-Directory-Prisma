"use client"

import { ICategoryOption } from '@/interfaces/category.interface';
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    title: string;
    icon: JSX.Element;
    active: boolean;
    activeColor?: string;
    categoryId?: string;
    linkId?: string;
    
}

const List = ({ title, icon, active, activeColor, categoryId, linkId }: Props) => {
    const router = useRouter();

    const redirectTo = () => {
        

        
        if (categoryId && linkId) {
            router.push(`/?categoryId=${categoryId}&linkId=${linkId}`);
        } else {
            router.push(`/?categoryId=${categoryId}`);
        }
    }

    const trimmedTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;

    return (
        <div onClick={redirectTo} className={`py-10 px-20 h-40 w-full flex items-center gap-x-15 cursor-pointer ${active ? activeColor : "opacity-60"}`}>
            {icon}
            <h3 className="font-sans text-16 font-semibold text-white">{trimmedTitle} - {linkId}</h3>
        </div>
    )
}

export default List;