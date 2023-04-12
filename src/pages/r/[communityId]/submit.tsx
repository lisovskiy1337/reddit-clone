import About from "@/components/Communities/About";
import PageContent from "@/components/Layout/PageContent";
import CreatePostForm from "@/components/Post/CreatePostForm";
import { auth } from "@/firebase/firebase";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const SumbitPage = () => {
  const [user] = useAuthState(auth);
  const communityData = useCommunityData().communityStateValue;

  return (
    <PageContent>
      <>
        <Box p="14px 0" borderBottom="1px solid" borderColor="white">
          <Text>Create a post </Text>
        </Box>
        {user && <CreatePostForm user={user} communityImgUrl={communityData.currentCommunity?.imgUrl}/>}
      </>
      <>
        {communityData.currentCommunity && (
          <About communityData={communityData.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};

export default SumbitPage;
