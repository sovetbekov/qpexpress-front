'use client'
import React, { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const ClientComponent: React.FC = () => {
    useEffect(() => {
        TagManager.initialize({ gtmId: 'GTM-PWTJPPLV' });
    }, []);

    return null;
};

export default ClientComponent;
