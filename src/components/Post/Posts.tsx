import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postAtom";
import { auth, firestore } from "@/firebase/firebase";
import usePostData from "@/hooks/usePostData";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import Loader from "./Loader";

interface IProps {
  communityData: Community;
}

const Posts: React.FC<IProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePostData();
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={postStateValue?.postVotes?.find(vote => vote.postId === post.id)?.voteValue}
              onVote={onVote}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
