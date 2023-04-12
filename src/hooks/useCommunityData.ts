import { authModalState } from "@/atoms/authModalAtom";
import {
  Community,
  communityState,
  CommuntySnippet,
} from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const setAuthModalState = useSetRecoilState(authModalState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMyCommunities = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communityModerator`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommuntySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };
  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMyCommunities();
  }, [user]);

  useEffect(() => {
    if (communityStateValue.currentCommunity) return;
    const { communityId } = router.query;
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);
  const joinCommunity = async (communityData: Community) => {
    if (!user) {
      setAuthModalState({ isOpen: true, view: "login" });
      return;
    }
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommuntySnippet = {
        communityId: communityData.id,
        imgUrl: communityData.imgUrl || "",
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communityModerator`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numOfMembers: increment(1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communityModerator`, communityId)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numOfMembers: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }));
      console.log(communityStateValue);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };
  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
    error,
  };
};

export default useCommunityData;
