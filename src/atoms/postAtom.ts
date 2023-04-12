import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
  id: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numOfComments: number;
  voteStatus: number;
  imgUrl?: string;
  communityImgUrl?: string;
  createdAt: Timestamp;
};

export type PostVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
}

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[]
}

const defaultState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: []
};

export const postAtom = atom<PostState>({
  key: "postState",
  default: defaultState,
});
