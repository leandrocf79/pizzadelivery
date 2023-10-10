import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  return (
    <div className={styles.container}>
      <div className={styles.item}>
      <div className={styles.callButton}>
        <Image src="/img/wa.jpg" alt="" width="100%" height="100%" />
      </div>
        <div className={styles.texts}>
          <div className={styles.text}>Pedir menu WhatsApp!</div>
          <div className={styles.text}>12 9-3456 5678</div>
        </div>
      </div>
      <div className={styles.item}>
        <ul className={styles.list}>
          <Link href="/" passHref>
            <li className={styles.listItem}>Menu</li>
          </Link>
          {/** 
          <li className={styles.listItem}>Products</li>
          <li className={styles.listItem}>Menu</li>
          */}
          <Image src="/img/logo.png" alt="" width="160px" height="69px" />
          {/** 
          <li className={styles.listItem}>Events</li>
          <li className={styles.listItem}>Blog</li>
          <li className={styles.listItem}>Contact</li>
        */}
        </ul>
      </div>
      <Link href="/cart" passHref>
        <div className={styles.item}>
          <div className={styles.cart}>
            <Image src="/img/cart.png" alt="" width="30px" height="30px" />
            <div className={styles.counter}>{quantity}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
