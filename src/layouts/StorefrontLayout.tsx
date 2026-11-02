import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type Props = {
    children: ReactNode;
    afterMain?: ReactNode;
    rootClassName: string;
    mainClassName?: string;
};

export default function StorefrontLayout({
                                             children,
                                             afterMain,
                                             rootClassName,
                                             mainClassName = 'flex-1',
                                         }: Props) {
    return (
        <div className={rootClassName}>
            <Header />
            <main id="main-content" className={mainClassName}>
                {children}
            </main>
            <Footer />
            {afterMain}
        </div>
    );
}
