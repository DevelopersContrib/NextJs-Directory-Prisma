"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { likeAction, countLikesAction } from "@/actions/like.action";
import { unlikeAction, countUnlikesAction } from "@/actions/unlike.action";
import { toast } from "sonner";
import { BiDislike, BiLike } from "react-icons/bi";

type Props = {
  id: string;
};

const Likes = ({ id }: Props) => {

  const [likes, setLikes] = useState<number>(0);
  const [unlikes, setUnlikes] = useState<number>(0);
  const [isMutation, setIsMutation] = useState<boolean>(false);
  const [isUnlikeMutation, setUnlikeMutation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [likesRes, unlikesRes] = await Promise.all([
          countLikesAction(id, '/'),
          countUnlikesAction(id, '/')
        ]);
        
        if (likesRes.data !== null) {
          setLikes(likesRes.data);
        }
        if (unlikesRes.data !== null) {
          setUnlikes(unlikesRes.data);
        }
      } catch (error) {
        console.error('Error fetching likes/unlikes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const clientAction = async () => {
    if (isMutation) return null;
    setIsMutation(true);

    try {
      const res = await likeAction({
        LinkId: id,
        userId: '8c903015-2300-4dad-b4bd-db1ed4b43508',
        path: '/',
      });
      if (res.message === "Like created successfully") {
        setLikes(likes + 1);
        toast.success("Liked successfully!");
      }
    } catch (error) {
      console.info("[ERROR_CLIENT_ACTION]", error);
      toast.error("Something went wrong");
    } finally {
      setIsMutation(false);
    }
  };

  const clientUnlikeAction = async () => {
    if (isUnlikeMutation) return null;
    setUnlikeMutation(true);

    try {
      const res = await unlikeAction({
        LinkId: id,
        userId: '8c903015-2300-4dad-b4bd-db1ed4b43508',
        path: '/',
      });
      if (res.message === "Unlike created successfully") {
        setUnlikes(unlikes + 1);
        toast.success("Unliked successfully!");
      }
    } catch (error) {
      console.info("[ERROR_CLIENT_ACTION]", error);
      toast.error("Something went wrong");
    } finally {
      setUnlikeMutation(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center space-x-2 py-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clientAction} 
            disabled={isMutation}
            className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
          >
            <BiLike className={`text-lg transition-all duration-300 ${isMutation ? 'text-gray-400' : 'text-gray-600 group-hover:text-blue-600'}`} />
            <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              {likes}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clientUnlikeAction} 
            disabled={isUnlikeMutation}
            className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
          >
            <BiDislike className={`text-lg transition-all duration-300 ${isUnlikeMutation ? 'text-gray-400' : 'text-gray-600 group-hover:text-red-600'}`} />
            <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors">
              {unlikes}
            </span>
          </Button>
        </div>
        
        {/* Engagement Indicator */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500">Active</span>
        </div>
      </div>
    </>
  );
};

export default Likes;
