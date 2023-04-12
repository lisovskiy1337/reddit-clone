import React, { useState, useRef, useEffect, useCallback } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Icon,
} from "@chakra-ui/react";
import TabItem from "./TabItem";
import TextForm from "./PostForm/TextForm";
import ImageUpload from "./PostForm/ImageUpload";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/hooks/useSelectFile";

interface IProps {
  user: User;
  communityImgUrl?: string;
}

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export interface ITabItem {
  title: string;
  icon: typeof Icon.arguments;
}

const CreatePostForm: React.FC<IProps> = ({ user, communityImgUrl }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [sliderInfo, setSliderInfo] = useState({ width: 0, left: 0 });
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const moveSlider = useCallback(() => {
    const refCur = divRef.current;
    const container = refCur?.children;
    if (container) {
      setSliderInfo((prevState) => ({
        ...prevState,
        width: container[selectedTab].getBoundingClientRect().width,
        left:
          container[selectedTab].getBoundingClientRect().left -
          refCur.getBoundingClientRect().left,
      }));
    }
  }, [selectedTab]);

  useEffect(() => {
    moveSlider();
    window.addEventListener("resize", moveSlider);
    return () => window.removeEventListener("resize", moveSlider);
  }, [moveSlider]);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTextInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCreatePost = async () => {
    setIsLoading(true);
    const { communityId } = router.query;

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: communityId as string,
        communityImgUrl: communityImgUrl || "",
        creatorId: user.uid,
        creatorDisplayName: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
      });

      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadImgUrl = await getDownloadURL(imageRef);

        await updateDoc(postDocRef, {
          imgUrl: downloadImgUrl,
        });
      }
      setIsLoading(false);
      router.back();
    } catch (error) {
      setError(true);
    }
  };
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex className="parent" position={"relative"}>
        <Flex width="100%" ref={divRef} className="parent-2">
          {formTabs.map((item, index) => (
            <TabItem
              key={index}
              item={item}
              index={index}
              selected={index === selectedTab}
              setSelectedTab={setSelectedTab}
            />
          ))}
        </Flex>
        <Box
          position={"absolute"}
          left={0}
          bottom={0}
          h={1}
          bg={"blue.500"}
          style={{
            transform: `translateX(${sliderInfo.left}px)`,
            width: `${sliderInfo.width}px`,
            transition: "all 250ms ease-in",
          }}
        ></Box>
      </Flex>

      <Flex p={4}>
        {selectedTab === 0 && (
          <TextForm
            onChange={handleOnChange}
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            isLoading={isLoading}
          />
        )}
        {selectedTab === 1 && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error occured while creating post.</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};

export default React.memo(CreatePostForm);
