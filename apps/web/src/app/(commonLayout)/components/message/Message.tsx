"use client";
import { Textarea } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";
import { IUser } from "@/types/IUser";
import {
  useCreateComment,
  useReplyComment,
  useUpdateComment,
} from "@/hooks/comment.hook";
import Messages from "./_components/Messages";
import { TPost } from "@/types/TPost";
import { TComment } from "@/types/TComment";
import { useSocket  } from "@/context/socket.provider";

const Message = ({ user, post }: { user: IUser; post: TPost }) => {
  const [comment, setComment] = useState<TComment>();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [seeMore, setSeeMore] = useState(false);
  const [updateComment, setUpdateComment] = useState(false);
  const { startTyping, stopTyping, typingUsers } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // data fetch or manipulate
  const { mutate: handleCreateComment } = useCreateComment();
  const { mutate: handleReplyComment } = useReplyComment();
  const { mutate: handleUpdateComment } = useUpdateComment();

  // Get typing users for this post
  const typingInThisPost = Array.from(typingUsers.values()).filter(
    (t) => t.postId === post._id && t.isTyping
  );

  // Handle typing indicator
  const handleTextChange = (value: string) => {
    setText(value);
    
    // Start typing indicator
    if (value.length > 0) {
      startTyping(post._id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(post._id);
      }, 2000);
    } else {
      stopTyping(post._id);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping(post._id);
    };
  }, [post._id, stopTyping]);

  // handle comment
  const handleComment = async () => {
    // Stop typing when submitting
    stopTyping(post._id);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (replyTo && comment) {
      const commentData = {
        commentId: comment?._id,
        data: {
          postId: post?._id,
          commentText: text,
          commentUser: {
            name: user?.name,
            photo: user?.profilePhoto,
            nickName: user?.nickName as string,
          },
          createdAt: new Date(),
        },
      };
       handleReplyComment(commentData);
      setText("");
    } else if (updateComment && comment) {
      // edit comment logic here
      const updateCommentData = {
        commentId: comment?._id,
        data: {
          postId: post._id,
          commentText: text,
          commentUser: {
            name: comment?.commentUser.name,
            photo: comment?.commentUser.photo,
            nickName: user?.nickName as string,
          },
          createdAt: new Date(),
        },
      };

       handleUpdateComment(updateCommentData);
    } else {
      const commentData = {
        postId: post?._id,
        commentText: text,
        commentUser: {
          name: user?.name,
          photo: user?.profilePhoto,
          nickName: user?.nickName as string,
        },
        createdAt: new Date(),
      };
      await handleCreateComment(commentData);
      setText(""); // Clear the text after submission
    }
  };
  
  return (
    <div className="">
      <button className="" onClick={() => setSeeMore(!seeMore)}>
        view more comments
      </button>
      {/* Comment Section */}
      <Messages
        post={post}
        setReplyTo={setReplyTo}
        seeMore={seeMore}
        setComment={setComment}
        setText={setText}
        setUpdateComment={setUpdateComment}
      />
      
      {/* Typing Indicator */}
      {typingInThisPost.length > 0 && (
        <div className="px-2 py-1 text-xs text-default-500 italic flex items-center gap-1">
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
          <span>
            {typingInThisPost.length === 1
              ? `${typingInThisPost[0].userName} is typing...`
              : `${typingInThisPost.length} people are typing...`}
          </span>
        </div>
      )}
      
      {/* comment textarea */}
      <div className="mt-2 flex gap-2">
        <div className="flex  ">
          <Image
            src={user?.profilePhoto}
            alt={user?.name}
            width={30}
            height={30}
            className="rounded-full h-[30px] w-[30px] object-cover"
          />
        </div>
        <div className="flex-1">
   

            <Textarea
              value={text} // Use undefined instead of null
              onChange={(e) => handleTextChange(e.target.value)}
              label={
                replyTo ? (
                  <span className="text-xs text-primary">
                    replying to @{replyTo}
                  </span>
                ) : null
              }
              variant="faded"
              placeholder="Write a comment"
              disableAnimation
              disableAutosize
              endContent={
                text && (
                  <button onClick={() => handleComment()}>
                    <SendHorizonal className="text-primary" />
                  </button>
                )
              }
              classNames={{
                input: "resize-y",
              }}
            />
  
         
        </div>
      </div>
    </div>
  );
};

export default Message;
