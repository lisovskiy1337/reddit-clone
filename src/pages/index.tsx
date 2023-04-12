import Head from "next/head";
import Image from "next/image";
import { Stack, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useState, useEffect } from "react";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import usePostData from "@/hooks/usePostData";

import { Post, PostVote } from "@/atoms/postAtom";
import PageContent from "@/components/Layout/PageContent";
import Loader from "@/components/Post/Loader";
import PostItem from "@/components/Post/PostItem";
import CreatePostLink from "@/components/Communities/CreatePostLink";
import useCommunityData from "@/hooks/useCommunityData";
import Recommendations from "@/components/Communities/Recommendations";
import Premium from "@/components/Communities/Premium";
import PersonalHome from "@/components/Communities/PersonalHome";
export default function Home() {
  const [user, userLoading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePostData();
  const { communityStateValue } = useCommunityData();

  const userHomeFeed = async () => {
    setIsLoading(true);
    try {
      const feedPosts: Post[] = [];

      // User has joined communities
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        // Getting 2 posts from 3 communities that user has joined
        let postPromises: Array<Promise<QuerySnapshot<DocumentData>>> = [];
        [0, 1, 2].forEach((index) => {
          if (!myCommunityIds[index]) return;

          postPromises.push(
            getDocs(
              query(
                collection(firestore, "posts"),
                where("communityId", "==", myCommunityIds[index]),
                limit(3)
              )
            )
          );
        });
        const queryResults = await Promise.all(postPromises);
        /**
         * queryResults is an array of length 3, each with 0-2 posts from
         * 3 communities that the user has joined
         */
        queryResults.forEach((result) => {
          const posts = result.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          feedPosts.push(...posts);
        });
      }

      // User has not joined any communities yet
      else {
        console.log("USER HAS NO COMMUNITIES - GETTING GENERAL POSTS");

        const postQuery = query(
          collection(firestore, "posts"),
          orderBy("voteStatus", "desc"),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        feedPosts.push(...posts);
      }

      setPostStateValue((prev) => ({
        ...prev,
        posts: feedPosts,
      }));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  const noUserHomeFeed = async () => {
    setIsLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(20)
      );
      const postsDocs = await getDocs(postsQuery);
      const posts = postsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  const getPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVotesDocs = await getDocs(postVotesQuery);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user && !userLoading) noUserHomeFeed();
  }, [user, userLoading]);

  useEffect(() => {
    if (communityStateValue.snippetsFetched) userHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (user && postStateValue.posts) getPostVotes();
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {isLoading ? (
          <Loader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find((v) => v.postId === post.id)
                    ?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
}
