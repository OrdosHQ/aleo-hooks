import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from './useWallet'
import { WalletError, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'

interface IUseRecrodsArguments {
    program?: string | 'credits.aleo'
    enabled?: boolean
}

export const useRecords = ({ program = 'credits.aleo', enabled = true }: IUseRecrodsArguments) => {
    const [records, setRecords] = useState<null | any[]>(null)
    const [error, setError] = useState<null | WalletError>(null)
    const [loading, setLoading] = useState(false)
    const { connected, adapter } = useWallet()

    const requestRecords = useCallback(
        async (filter?: <T>(record: T, index: number, array: Array<T>) => boolean) => {
            setLoading(true)

            try {
                if (adapter && 'requestRecords' in adapter) {
                    if (!connected) throw new WalletNotConnectedError()

                    const records = await adapter.requestRecords(program)

                    if (filter) {
                        const filteredRecords = records.filter(filter)

                        setRecords(filteredRecords)

                        return filteredRecords
                    }

                    setRecords(records)

                    return records
                } else {
                    throw new WalletError('Not implemented')
                }
            } catch (err: any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        },
        [program, adapter],
    )

    useEffect(() => {
        if (enabled) {
            requestRecords()
        }
    }, [enabled])

    return useMemo(
        () => ({ records, error, loading, requestRecords }),
        [records, error, loading, requestRecords],
    )
}
