import { Community, communityState } from "@/atoms/communitiesAtom";
import { firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import safeJsonStringify from "safe-json-stringify";
import CommunityNotFound from "./not-found";
import Header from "@/components/Communities/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Communities/CreatePostLink";
import Posts from "@/components/Post/Posts";
import { useSetRecoilState } from "recoil";
import About from "@/components/Communities/About";

interface CommunityPageProps {
  communityData: Community;
}
const CommunityPage = ({ communityData }: CommunityPageProps) => {
  const setCommunityStateValue = useSetRecoilState(communityState);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, []);

  if (!communityData) return <CommunityNotFound />;

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    if (firestore) {
      const communityDocRef = doc(
        firestore,
        "communities",
        context.query.communityId as string
      );
      const communityDoc = await getDoc(communityDocRef);
      return {
        props: {
          communityData:
            communityDoc.exists() &&
            JSON.parse(
              safeJsonStringify({
                id: communityDoc?.id,
                ...communityDoc?.data(),
              })
            ),
        },
      };
    }
  } catch (error) {
    console.log("getServerSideProps error", error);
  }
}

export default CommunityPage;
