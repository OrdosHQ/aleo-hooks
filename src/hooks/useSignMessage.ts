import { WalletError, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { useCallback, useMemo, useState } from 'react'
import { useWallet } from './useWallet'

export const useSignMessage = () => {
    const { connected, adapter } = useWallet()
    const [error, setError] = useState<null | Error>(null)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<null | Uint8Array>(null)

    const signMessage = useCallback(
        async (message: Uint8Array) => {
            try {
                setLoading(true)
                if (!connected) throw new WalletNotConnectedError()

                if (adapter && 'signMessage' in adapter) {
                    const data = await adapter.signMessage(message)

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
        },
        [connected, adapter],
    )

    return useMemo(
        () => ({ signMessage, error, data, loading }),
        [signMessage, error, data, loading],
    )
}
