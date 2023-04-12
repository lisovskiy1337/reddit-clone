// import { Community } from '@/atoms/communitiesAtom';
import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  creatorId: string;
  numOfMembers: number;
  privacyType: "public" | "restrictied" | "private";
  createdAt?: Timestamp;
  imgUrl?: string;
}

export interface CommuntySnippet {
  communityId: string;
  isModerator?: boolean;
  imgUrl?: string;
}

interface ICommunityState {
  mySnippets: CommuntySnippet[];
  currentCommunity?: Community,
  snippetsFetched: boolean
}
const defaultCommunityState: ICommunityState = {
  mySnippets: [],
  snippetsFetched: false
  
};

export const communityState = atom<ICommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
