import { WalletError, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { useCallback, useMemo, useState } from 'react'
import { useWallet } from './useWallet'
import { TransactionStatus } from 'types'

export const useTransactionStatus = () => {
    const { connected, adapter } = useWallet()
    const [error, setError] = useState<null | Error>(null)
    const [loading, setLoading] = useState(false)
    const [transactionStatus, setTransactionStatus] = useState<null | TransactionStatus>(null)

    const requestTransactionStatus = useCallback(
        async (transactionId: string) => {
            try {
                setLoading(true)
                if (!connected) throw new WalletNotConnectedError()

                if (adapter && 'transactionStatus' in adapter) {
                    const transactionStatus = await adapter.transactionStatus(transactionId)

                    setTransactionStatus(transactionStatus as TransactionStatus)

                    return transactionStatus as TransactionStatus
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
        () => ({ requestTransactionStatus, error, transactionStatus, loading }),
        [requestTransactionStatus, error, transactionStatus, loading],
    )
}
