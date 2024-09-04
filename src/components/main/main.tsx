"use client";

import React from 'react'

import { ILinkWithCategory } from '@/interfaces/link.interface';
import LinkType from "@/types/link.type";
import { Toaster } from 'sonner'
import DisplayPost from './display-post';
import ChooseFile from './choose-file';
import RestoreDeleted from  './restore-deleted';
import Subtitle from '../sidebar/subtitle';
import List from "../sidebar/list";
import { FaRegFileAlt, FaRegStar } from "react-icons/fa";

type Props = {
    recents: LinkType | null;
}

const Main = ({ recents }: Props) => {
    return (
        <div className="p-50 flex flex-col gap-y-30 w-full bg-primary">
            <div>
        <div className="px-20 mb-10">
          <Subtitle title="Recents" />
        </div>
        <div className="flex flex-col gap-y-5">
        <h3 className="subheading px-20">There are no recent posts</h3>
        </div>
      </div>
        </div>
    )
}

export default Main