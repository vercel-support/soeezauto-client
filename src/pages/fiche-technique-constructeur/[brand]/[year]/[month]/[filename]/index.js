import React from 'react';
import { useRouter } from 'next/router';

const PDFViewer = () => {
    const router = useRouter();
    const { brand, year, month, filename } = router.query;
    return (
        <main>
            <iframe
                title={filename}
                style={{ width: '100%', height: '100vh' }}
                src={`${process.env.NEXT_PUBLIC_API_HOST}/specs/${brand}/${year}-${month}/${filename}`}
            />
        </main>
    );
};

export default PDFViewer;
