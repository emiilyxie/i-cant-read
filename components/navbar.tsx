import Link from 'next/link';
import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        <li>
          <Link href="/readable">
            Result
          </Link>
        </li>
        <li>
          <Link href="/about">
            About
          </Link>
        </li>
      </ul>
      <ul className={styles.colorModes}>
        <button className={`${styles.dot} ${styles.whiteMode}`}></button>
        <button className={`${styles.dot} ${styles.paperMode}`}></button>
        <button className={`${styles.dot} ${styles.darkMode}`}></button>
      </ul>
    </nav>
  );
};

export default Navbar;
