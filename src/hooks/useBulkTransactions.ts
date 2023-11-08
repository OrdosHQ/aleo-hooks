import {
    AleoTransaction,
    WalletError,
    WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base'
import { useCallback, useMemo, useState } from 'react'
import { useWallet } from './useWallet'

export const useBulkTransactions = () => {
    const { connected, adapter } = useWallet()
    const [error, setError] = useState<null | Error>(null)
    const [loading, setLoading] = useState(false)
    const [transactionIds, setTransactionIds] = useState<null | string[]>(null)

    const executeBulkTransactions = useCallback(
        async (aleoTransactions: AleoTransaction[]) => {
            try {
                setLoading(true)
                if (!connected) throw new WalletNotConnectedError()

                if (adapter && 'requestBulkTransactions' in adapter) {
                    const transactionId = await adapter.requestBulkTransactions(aleoTransactions)

                    setTransactionIds(transactionId)

                    return transactionId
                } else {
                    throw new WalletError('Not implemented in your wallet provider')
                }
            } catch (err: any) {
                setError(err)

                return null
            } finally {
                setLoading(false)
            }
        },
        [connected, adapter],
    )

    return useMemo(
        () => ({ executeBulkTransactions, error, transactionIds, loading }),
        [executeBulkTransactions, error, transactionIds, loading],
    )
}
