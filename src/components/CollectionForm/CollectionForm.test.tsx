// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CollectionForm from './CollectionForm'
import type { Image } from '~/lib/types'

// Deterministic stand-ins for FileReader/Image so the file-upload branch of
// handleFormSubmit (data URL + dimensions) resolves synchronously in tests.
class FakeFileReader {
    result: string | null = null
    onload: (() => void) | null = null
    readAsDataURL() {
        this.result = 'data:image/jpeg;base64,FAKE'
        queueMicrotask(() => this.onload?.())
    }
}

class FakeImage {
    onload: (() => void) | null = null
    width = 1200
    height = 900
    set src(_value: string) {
        queueMicrotask(() => this.onload?.())
    }
}

const allImages: Image[] = [
    {
        image_id: 1,
        url: 'https://example.com/1.jpg',
        width: 100,
        height: 100,
        title: 'First',
        description: null,
        alt_text: null,
        date_taken: null,
        location: null,
        visible: true,
        featured: false,
        digital: true,
        latitude: null,
        longitude: null,
        film: null,
    } as Image,
    {
        image_id: 2,
        url: 'https://example.com/2.jpg',
        width: 100,
        height: 100,
        title: 'Second',
        description: null,
        alt_text: null,
        date_taken: null,
        location: null,
        visible: true,
        featured: false,
        digital: true,
        latitude: null,
        longitude: null,
        film: null,
    } as Image,
]

describe('CollectionForm', () => {
    beforeEach(() => {
        vi.stubGlobal('FileReader', FakeFileReader)
        vi.stubGlobal('Image', FakeImage)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.clearAllMocks()
    })

    it('create flow: submits a new collection with the expected payload', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        render(<CollectionForm mode="create" onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Name:'), 'Coastal Walks')
        await user.type(
            screen.getByLabelText('Description:'),
            'Photos from the coast',
        )

        const file = new File(['binary-image-data'], 'cover.jpg', {
            type: 'image/jpeg',
        })
        await user.upload(screen.getByLabelText('Image File:'), file)

        // jsdom does not implement constraint validation for `required`
        // file inputs (files set programmatically never satisfy
        // valueMissing), so a real button click never fires the submit
        // event here. Submit the form directly instead - this exercises
        // the same onSubmit handler the browser would call once a user
        // has actually chosen a file.
        fireEvent.submit(
            screen.getByRole('button', { name: 'Create' }).closest('form')!,
        )

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Coastal Walks',
                description: 'Photos from the coast',
                images: [],
                image: 'data:image/jpeg;base64,FAKE',
                width: 1200,
                height: 900,
            }),
        )
    })

    it('edit flow: pre-populates fields and toggles image selection on submit', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        const initialData = {
            collection_name: 'Old Collection',
            collection_description: 'Old description',
            cover_url: 'https://example.com/cover.jpg',
            images: [1],
            allImages,
        }

        render(
            <CollectionForm
                mode="edit"
                initialData={initialData}
                onSubmit={onSubmit}
            />,
        )

        expect(screen.getByLabelText('Name:')).toHaveValue('Old Collection')
        expect(screen.getByLabelText('Description:')).toHaveValue(
            'Old description',
        )

        const nameInput = screen.getByLabelText('Name:')
        await user.clear(nameInput)
        await user.type(nameInput, 'New Collection')

        // Select the second image (not yet part of the collection).
        await user.click(screen.getByAltText('Second'))

        await user.click(screen.getByRole('button', { name: 'Update' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'New Collection',
                images: [1, 2],
            }),
        )
        // No new file was uploaded, so no re-derived image data/dimensions.
        expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('image')
    })

    it('blocks submission when the required name field is emptied out', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        // Edit mode so the (jsdom-unreliable) file-required constraint
        // isn't in play - only the name's required attribute matters here.
        render(
            <CollectionForm
                mode="edit"
                initialData={{
                    collection_name: 'Old Collection',
                    cover_url: 'https://example.com/cover.jpg',
                }}
                onSubmit={onSubmit}
            />,
        )

        const nameInput = screen.getByLabelText('Name:')
        await user.clear(nameInput)

        await user.click(screen.getByRole('button', { name: 'Update' }))

        expect(onSubmit).not.toHaveBeenCalled()
        expect(nameInput).toBeInvalid()
    })

    it('shows a visible error message when the submit handler rejects', async () => {
        const user = userEvent.setup()
        const onSubmit = vi
            .fn()
            .mockRejectedValue(new Error('Failed to create collection'))

        render(<CollectionForm mode="create" onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Name:'), 'Coastal Walks')
        const file = new File(['binary-image-data'], 'cover.jpg', {
            type: 'image/jpeg',
        })
        await user.upload(screen.getByLabelText('Image File:'), file)

        fireEvent.submit(
            screen.getByRole('button', { name: 'Create' }).closest('form')!,
        )

        const alert = await screen.findByRole('alert')
        expect(alert).toHaveTextContent('Failed to create collection')
        expect(
            screen.getByRole('button', { name: 'Create' }),
        ).not.toBeDisabled()
    })
})
