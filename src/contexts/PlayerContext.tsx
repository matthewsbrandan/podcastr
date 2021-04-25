import { createContext, useState, ReactNode, useContext } from 'react';

interface Episode{
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}
interface PlayerContextData {
  isExpanded: boolean;
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: ()=> void;
}
export const PlayerContext = createContext({} as PlayerContextData);

interface PlayerContextProviderProps {
  children: ReactNode;
}
export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [isExpanded,setIsExpanded] = useState(false);
  const [episodeList,setEpisodeList] = useState([]);
  const [currentEpisodeIndex,setCurrentEpisodeIndex] = useState(0);
  const [isPlaying,setIsPlaying] = useState(false);
  const [isLooping,setIsLooping] = useState(false);
  const [isShuffling,setIsShuffling] = useState(false);
  
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }
  function playNext(){
    if(isShuffling){
      const nextRadomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRadomEpisodeIndex);
    }
    else if(hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }
  function playPrevious(){
    if(hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }
  
  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }
  
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }
  function toggleLoop(){
    setIsLooping(!isLooping);
  }
  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }
  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{
      isExpanded,
      episodeList: episodeList,
      currentEpisodeIndex: currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      hasNext,
      hasPrevious,
      setIsExpanded,
      play,
      playList,
      playNext,
      playPrevious,
      setPlayingState,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      clearPlayerState,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}