import { useState, useRef, useCallback, useEffect } from 'react'

type FeedbackType = 'success' | 'error' | null

interface FormFeedback {
    type: FeedbackType
    message: string | null
}

const AUTO_DISMISS_MS = 4000

export function useFormFeedback() {
    const [feedback, setFeedback] = useState<FormFeedback>({
        type: null,
        message: null,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearFeedback = useCallback(() => {
        setFeedback({ type: null, message: null })
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }, [])

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const handleSubmit = useCallback(
        async (fn: () => Promise<void>) => {
            clearFeedback()
            setIsSubmitting(true)
            try {
                await fn()
                setFeedback({
                    type: 'success',
                    message: 'Saved successfully!',
                })
                timerRef.current = setTimeout(() => {
                    setFeedback({ type: null, message: null })
                }, AUTO_DISMISS_MS)
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Something went wrong. Please try again.'
                setFeedback({ type: 'error', message })
            } finally {
                setIsSubmitting(false)
            }
        },
        [clearFeedback],
    )

    return { feedback, isSubmitting, handleSubmit, clearFeedback }
}
