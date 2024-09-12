"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { countClicksAction } from "@/actions/click.action";
import { historyAction } from "@/actions/history.action";
import { toast } from "sonner";

type Props = {
  id: string;
};
import { BiDislike, BiLike } from "react-icons/bi";

const Clicks = ({ id }: Props) => {

    const [likes, setLikes] = useState<number>(0);
    
    useEffect(() => {
        const fetchLikes = async () => {
            const res = await countClicksAction(id,'/');
            if (res.data !=null) {
                setLikes(res.data);
            }
        };

       
        fetchLikes();
       
    }, []);

    

    

  return (
    <>
      <span className="">{likes}</span>
      
    </>
  );
};

export default Clicks;