import React from 'react';
import Image from 'next/image';
import { ButtonBase } from '@material-ui/core';
import styles from 'styles/footer.module.scss';
import { LANG } from 'parameters';
import Link from './link';

const trans = {
    fr: {
        menu: 'Menu',
        home: 'Home',
        createAd: 'Publicar anuncio',
        search: 'Buscar anuncios',
        contact: 'Contato',
        legal: 'Legal',
        ourMission: 'Nossa missao',
    },
    en: {
        menu: 'Menu',
        home: 'Home',
        createAd: 'Create ad',
        search: 'Search',
        contact: 'Contact',
        legal: 'Legal',
        ourMission: 'Our mission',
    },
};

const Footer = () => {
    return (
        <>
            <footer className={styles.root}>
                <section className={styles.section}>
                    <div className={styles.sectionDiv}>
                        <Link className={styles.sectionDivA} href="/">
                            {trans[LANG].home}
                        </Link>
                        <Link className={styles.sectionDivA} href="/">
                            {trans[LANG].createAd}
                        </Link>
                        <Link className={styles.sectionDivA} href="/marques-voiture">
                            {trans[LANG].search}
                        </Link>
                        <Link className={styles.sectionDivA} href="/contato">
                            {trans[LANG].contact}
                        </Link>
                        <Link className={styles.sectionDivA} href="/legal">
                            {trans[LANG].legal}
                        </Link>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={styles.social} />
                    <ButtonBase aria-label="go to homepage">
                        <Link href="/" aria-label="go to homepage">
                            <Image
                                src="/images/main-logo.png"
                                alt="soeezauto logo"
                                className={styles.branding}
                                width="180"
                                height="60"
                                loading="eager"
                                priority
                            />
                        </Link>
                    </ButtonBase>
                </section>
                <section className={styles.section}>
                    <p className={styles.sectionP}>
                        Nam sole orto magnitudine angusti gurgitis sed profundi a transitu
                        arcebantur et dum piscatorios.
                    </p>
                    <p className={styles.sectionP}>
                        Quaerunt lenunculos vel innare temere contextis cratibus parant,
                        effusae legiones, quae hiemabant tunc apud.
                    </p>
                    <p className={styles.sectionP}>
                        Siden, isdem impetu occurrere veloci. et signis prope ripam
                        locatis ad manus comminus conserendas denseta scutorum conpage
                        semet scientissime.
                    </p>
                </section>
            </footer>
        </>
    );
};

export default Footer;
