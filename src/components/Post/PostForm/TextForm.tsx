import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react'
import React from 'react'

interface IProps {
    textInputs: {
        title: string;
        body: string;
      };
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void;
      handleCreatePost: () => void;
      isLoading: boolean
}

const TextForm : React.FC<IProps> = ({textInputs, onChange, handleCreatePost, isLoading}) => {
  return (
        <Stack spacing={3} width="100%">
          <Input
            name="title"
            value={textInputs.title}
            onChange={onChange}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid",
              borderColor: "black",
            }}
            fontSize="10pt"
            borderRadius={4}
            placeholder="Title"
          />
          <Textarea
            name="body"
            value={textInputs.body}
            onChange={onChange}
            fontSize="10pt"
            placeholder="Text (optional)"
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid",
              borderColor: "black",
            }}
            height="100px"
          />
          <Flex justify="flex-end" >
            <Button
              height={"34px"}
              padding={"0px 30px"}
              isDisabled={!textInputs.title}
              isLoading={isLoading}
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </Flex>
        </Stack>
    )
}

export default TextForm