import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';

export function Header(){
  const { isExpanded, setIsExpanded } = usePlayer();
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  });
  
  return (
    <header className={`${styles.headerContainer} ${isExpanded ? styles.collapse :''}`}>
      <Link href="/">
        <img src="/logo.svg" alt="Podcastr"/>
      </Link>
      <p>O melhor para você ouvir, sempre</p>
      <span>{currentDate}</span>
      <button type="button" className={styles.expandPlayer} onClick={()=> setIsExpanded(true)}>
        <img src="/menu.svg" alt="Expandir Player"/>
      </button>
    </header>
  ); 
}