import { useMemo } from 'react'
import { useWallet } from './useWallet'

export const useAccount = () => {
    const { publicKey, connected } = useWallet()

    return useMemo(() => ({ publicKey, connected }), [publicKey])
}
