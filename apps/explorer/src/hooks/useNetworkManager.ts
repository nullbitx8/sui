// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';

import { growthbook } from '~/utils/growthbook';
import { queryClient } from '~/utils/queryClient';

export function useNetworkManager(network: string) {
    const [currentNetwork, setCurrentNetwork] = useState(network);
    const [previousNetwork, setPreviousNetwork] = useState(network);

    if (network !== currentNetwork) {
        setPreviousNetwork(currentNetwork);
        setCurrentNetwork(network);
    }

    useEffect(() => {
        growthbook.setAttributes({
            network,
            environment: import.meta.env.VITE_VERCEL_ENV,
        });
    }, [network]);

    useEffect(() => {
        Sentry.setContext('network', {
            network,
        });
    }, [network]);

    useEffect(() => {
        if (network !== previousNetwork) {
            queryClient.cancelQueries();
            queryClient.clear();
        }
    }, [previousNetwork, network]);
}
