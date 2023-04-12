import { auth, firestore } from "@/firebase/firebase";
import useDirectory from "@/hooks/useDirectory";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Icon,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

interface IProp {
  open: boolean;
  handleClose: () => void;
}

const CommunityModal: React.FC<IProp> = ({ open, handleClose }) => {
  const [user] = useAuthState(auth);
  const [digitsRemaining, setDigitsRemaining] = useState(21);
  const [communityName, setCommunityName] = useState("");
  const [communityType, setCommunityType] = useState("public");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { onToggleMenu } = useDirectory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setDigitsRemaining(21 - e.target.value.length);
  };

  const handleCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { name },
    } = event;
    if (name === communityType) return;
    setCommunityType(name);
  };

  const createCommunity = async () => {
    if (nameError) setNameError("");
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      return setNameError(
        "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
      );
    }

    setLoading(true);

    try {
      const communityDecRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await getDoc(communityDecRef);
        if (communityDoc.exists()) {
          return setNameError("Sorry, this name is taken. Try another one.");
        }

        transaction.set(communityDecRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numOfMembers: 1,
          privacyType: communityType,
        });

        transaction.set(
          doc(
            firestore,
            `users/${user?.uid}/communityModerator`,
            communityName
          ),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
      handleClose();
      onToggleMenu();
      router.push(`/r/${communityName}`);
      setCommunityName('');
    } catch (error: any) {
      console.log("Transaction error", error);
      setNameError(error.message);
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>Create Community</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight={600} fontSize={15}>
            Name
          </Text>
          <Text fontSize={11} color="gray.500">
            Community names including capitalization cannot be changed
          </Text>
          <Text
            color="gray.400"
            position="relative"
            top="28px"
            left="10px"
            width="20px"
          >
            r/
          </Text>
          <Input
            position="relative"
            name="name"
            value={communityName}
            onChange={handleChange}
            pl="22px"
            type={"text"}
            size="sm"
          />
          <Text
            fontSize="9pt"
            color={digitsRemaining === 0 ? "red" : "gray.500"}
            pt={2}
          >
            {digitsRemaining} Characters remaining
          </Text>
          <Text fontSize="9pt" color="red" pt={1}>
            {nameError}
          </Text>
          <Box mt={4} mb={4}>
            <Text fontWeight={600} fontSize={15}>
              Community Type
            </Text>
            <Stack spacing={2} pt={1}>
              <Checkbox
                colorScheme="blue"
                name="public"
                isChecked={communityType === "public"}
                onChange={handleCommunityTypeChange}
              >
                <Flex alignItems="center">
                  <Icon as={BsFillPersonFill} mr={2} color="gray.500" />
                  <Text fontSize="10pt" mr={1}>
                    Public
                  </Text>
                  <Text fontSize="8pt" color="gray.500" pt={1}>
                    Anyone can view, post, and comment to this community
                  </Text>
                </Flex>
              </Checkbox>
              <Checkbox
                colorScheme="blue"
                name="restricted"
                isChecked={communityType === "restricted"}
                onChange={handleCommunityTypeChange}
              >
                <Flex alignItems="center">
                  <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                  <Text fontSize="10pt" mr={1}>
                    Restricted
                  </Text>
                  <Text fontSize="8pt" color="gray.500" pt={1}>
                    Anyone can view this community, but only approved users can
                    post
                  </Text>
                </Flex>
              </Checkbox>
              <Checkbox
                colorScheme="blue"
                name="private"
                isChecked={communityType === "private"}
                onChange={handleCommunityTypeChange}
              >
                <Flex alignItems="center">
                  <Icon as={HiLockClosed} color="gray.500" mr={2} />
                  <Text fontSize="10pt" mr={1}>
                    Private
                  </Text>
                  <Text fontSize="8pt" color="gray.500" pt={1}>
                    Only approved users can view and submit to this community
                  </Text>
                </Flex>
              </Checkbox>
            </Stack>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={createCommunity} isLoading={loading}>
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommunityModal;
