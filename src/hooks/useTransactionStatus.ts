import { WalletError, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { useCallback, useMemo, useState } from 'react'
import { useWallet } from './useWallet'

export const useTransactionStatus = () => {
    const { connected, adapter } = useWallet()
    const [error, setError] = useState<null | Error>(null)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<null | string>(null)

    const requestTransactionStatus = useCallback(async (transactionId: string) => {
        try {
            setLoading(true)
            if (!connected) throw new WalletNotConnectedError()

            if (adapter && 'transactionStatus' in adapter) {
                const data = await adapter.transactionStatus(transactionId)

                setData(data)

                return data
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
        () => ({ requestTransactionStatus, error, data, loading }),
        [requestTransactionStatus, error, data, loading],
    )
}
