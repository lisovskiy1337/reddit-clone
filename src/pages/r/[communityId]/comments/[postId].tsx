import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postAtom";
import About from "@/components/Communities/About";
import PageContent from "@/components/Layout/PageContent";
import Comments from "@/components/Post/PostForm/Comments/Comments";
import PostItem from "@/components/Post/PostItem";
import { auth, firestore } from "@/firebase/firebase";
import useCommunityData from "@/hooks/useCommunityData";
import usePostData from "@/hooks/usePostData";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostPage = () => {
  const [user] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePostData();
  const router = useRouter();
  const communityData = useCommunityData().communityStateValue;
  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("fetch error:", error);
    }
  };

  useEffect(() => {
    if (postStateValue.selectedPost) return;
    const { postId } = router.query;
    if (postId && !postStateValue.selectedPost) {
      fetchPost(postId as string);
    }
   
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContent>
      {postStateValue.selectedPost && (
        <>
          <PostItem
            post={postStateValue.selectedPost}
            userIsCreator={user?.uid === postStateValue.selectedPost.creatorId}
            userVoteValue={
              postStateValue?.postVotes?.find(
                (vote) => vote.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            onVote={onVote}
            onDeletePost={onDeletePost}
            onSelectPost={onSelectPost}
          />
          <Comments
            user={user}
            selectedPost={postStateValue.selectedPost}
            communityId={postStateValue.selectedPost.communityId as string}
          />
        </>
      )}

      <>
        {communityData.currentCommunity && (
          <About communityData={communityData.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};

export default PostPage;
