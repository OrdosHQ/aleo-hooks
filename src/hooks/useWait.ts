import { useCallback, useMemo, useRef, useState } from 'react'
import { TransactionStatus } from '../types'
import { useTransactionStatus } from './useTransactionStatus'

interface UseWaitAguments {
    poolingInterval?: number
}

export const useWait = (
    { poolingInterval = 1_000 }: UseWaitAguments = { poolingInterval: 1_000 },
) => {
    const { requestTransactionStatus } = useTransactionStatus()
    const [status, setStatus] = useState<TransactionStatus | null>(null)
    const [error, setError] = useState<null | Error>(null)
    const intervalIdRef = useRef<null | number>(null)

    const stopPooling = useCallback(() => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current)
        }
    }, [intervalIdRef])

    const wait = useCallback(
        async (
            transactionId: string,
            onTransactionStatusChange?: (
                txStatus: TransactionStatus | null,
                stopPooling: () => void,
            ) => void,
        ) => {
            setError(null)

            return await new Promise((resolve, reject) => {
                try {
                    if (intervalIdRef.current) {
                        clearInterval(intervalIdRef.current)
                    }

                    if (requestTransactionStatus) {
                        intervalIdRef.current = setInterval(async () => {
                            const status = await requestTransactionStatus(transactionId)

                            setStatus(status)

                            if (onTransactionStatusChange) {
                                onTransactionStatusChange(status, stopPooling)
                            }

                            if (
                                (status === TransactionStatus.Failed ||
                                    status === TransactionStatus.Finalized) &&
                                intervalIdRef.current
                            ) {
                                clearInterval(intervalIdRef.current)

                                if (status === TransactionStatus.Failed) {
                                    reject(status)
                                }

                                if (status === TransactionStatus.Finalized) {
                                    resolve(status)
                                }
                            }
                        }, poolingInterval)
                    }
                } catch (error) {
                    setError(error as any)
                    reject(error)
                }
            })
        },
        [poolingInterval, requestTransactionStatus],
    )

    return useMemo(() => ({ status, error, wait }), [status, error, wait])
}
