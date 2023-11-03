import {
    AleoTransaction,
    WalletError,
    WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base'
import { useCallback, useMemo, useState } from 'react'
import { useWallet } from './useWallet'

export const useRequestTransaction = () => {
    const { connected, adapter } = useWallet()
    const [error, setError] = useState<null | Error>(null)
    const [loading, setLoading] = useState(false)
    const [transactionId, setTransactionId] = useState<null | string>(null)

    const requestTransaction = useCallback(async (aleoTransaction: AleoTransaction) => {
        try {
            setLoading(true)
            if (!connected) throw new WalletNotConnectedError()

            if (adapter && 'requestTransaction' in adapter) {
                const transactionId = await adapter.requestTransaction(aleoTransaction)

                setTransactionId(transactionId)

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
    }, [])

    return useMemo(
        () => ({ requestTransaction, error, transactionId, loading }),
        [requestTransaction, error, transactionId, loading],
    )
}
