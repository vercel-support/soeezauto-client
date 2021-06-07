import React from 'react';
import Image from 'next/image';
import { ButtonBase } from '@material-ui/core';
import styles from 'styles/footer.module.scss';
import Link from './link';

const Footer = () => {
    return (
        <>
            <footer className={styles.root}>
                <section className={styles.section}>
                    <div className={styles.sectionDiv}>
                        <Link className={styles.sectionDivA} href="/marques-voiture">
                            Marques
                        </Link>
                        <Link className={styles.sectionDivA} href="/modeles-voiture">
                            Modèles
                        </Link>
                        <Link className={styles.sectionDivA} href="/segments-automobile">
                            Segments
                        </Link>
                        <Link className={styles.sectionDivA} href="/prix-budget-voiture">
                            Prix et budget
                        </Link>
                        <Link className={styles.sectionDivA} href="/contact">
                            Nous contacter
                        </Link>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={styles.social} />
                    <ButtonBase aria-label="visiter page accueil">
                        <Link href="/" aria-label="visiter page accueil">
                            <Image
                                src="/images/main-logo.png"
                                alt="soeezauto logo"
                                className={styles.branding}
                                width="180"
                                height="60"
                                layout="fixed"
                            />
                        </Link>
                    </ButtonBase>
                </section>
                <section className={styles.section}>
                    <div className={styles.sectionDiv}>
                        <Link
                            className={styles.sectionDivA}
                            href="/promotion-voiture-neuve-au-maroc"
                        >
                            Promotions
                        </Link>
                        <Link className={styles.sectionDivA} href="/soeez-blog">
                            Blog
                        </Link>
                        <Link className={styles.sectionDivA} href="/comparateur-voiture">
                            Comparateur voitures
                        </Link>
                        <Link className={styles.sectionDivA} href="/fiches-techniques">
                            Fiches techniques
                        </Link>
                        <Link className={styles.sectionDivA} href="/legal">
                            Mentions legales
                        </Link>
                    </div>
                </section>
            </footer>
        </>
    );
};

export default Footer;
