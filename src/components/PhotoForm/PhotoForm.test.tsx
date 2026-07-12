// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhotoForm from './PhotoForm'
import { getCameras, getFilms } from '~/lib/server/reference'
import type { Camera, Film } from '~/lib/types'

vi.mock('~/lib/server/reference', () => ({
    getCameras: vi.fn(),
    getFilms: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => mockNavigate,
}))

// The map effect is not part of the publishing critical path covered here;
// stub leaflet so it can't throw in jsdom (no real tiles/DOM measurements).
vi.mock('leaflet', () => ({
    map: vi.fn(() => ({
        setView: vi.fn().mockReturnThis(),
        on: vi.fn(),
        remove: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    popup: vi.fn(() => ({
        setLatLng: vi.fn().mockReturnThis(),
        setContent: vi.fn().mockReturnThis(),
        openOn: vi.fn(),
    })),
}))

const cameras: Camera[] = [{ camera_id: 1, brand: 'Nikon', model: 'F3' }]
const films: Film[] = [{ film_id: 1, brand: 'Kodak', name: 'Portra 400' }]

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
    width = 800
    height = 600
    set src(_value: string) {
        queueMicrotask(() => this.onload?.())
    }
}

describe('PhotoForm', () => {
    beforeEach(() => {
        vi.mocked(getCameras).mockResolvedValue(cameras)
        vi.mocked(getFilms).mockResolvedValue(films)
        vi.stubGlobal('FileReader', FakeFileReader)
        vi.stubGlobal('Image', FakeImage)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.clearAllMocks()
    })

    it('create flow: submits a new photo with the expected payload and navigates home', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        render(<PhotoForm mode="create" onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Title:'), 'Sunset over the bay')
        await user.type(screen.getByLabelText('Description:'), 'A nice sunset')
        await user.type(screen.getByLabelText('Location:'), 'Brighton')

        const file = new File(['binary-image-data'], 'sunset.jpg', {
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
            screen.getByRole('button', { name: 'Upload' }).closest('form')!,
        )

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Sunset over the bay',
                description: 'A nice sunset',
                location: 'Brighton',
                visible: true,
                featured: false,
                digital: true,
                image: 'data:image/jpeg;base64,FAKE',
                width: 800,
                height: 600,
            }),
        )

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' }),
        )
    })

    it('edit flow: pre-populates fields from initialData and submits updates without re-uploading a file', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        const initialData = {
            title: 'Old title',
            description: 'Old description',
            alt_text: 'Old alt',
            date_taken: '2024-01-01',
            location: 'London',
            visible: false,
            featured: true,
            digital: false,
            camera: 1,
            film: 1,
            latitude: 51.5,
            longitude: -0.1,
            url: 'https://example.com/existing.jpg',
        }

        render(
            <PhotoForm
                mode="edit"
                initialData={initialData}
                onSubmit={onSubmit}
            />,
        )

        expect(screen.getByLabelText('Title:')).toHaveValue('Old title')
        expect(screen.getByLabelText('Description:')).toHaveValue(
            'Old description',
        )
        expect(screen.getByLabelText('Location:')).toHaveValue('London')

        const titleInput = screen.getByLabelText('Title:')
        await user.clear(titleInput)
        await user.type(titleInput, 'New title')

        // No file is required in edit mode, so a real click is enough to
        // trigger native submission here.
        await user.click(screen.getByRole('button', { name: 'Update' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'New title',
                url: 'https://example.com/existing.jpg',
            }),
        )
        // No new file was uploaded, so the submit payload should not
        // contain re-derived image data/dimensions.
        expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('image')

        // Edit mode does not redirect away from the form.
        expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('blocks submission when the required title field is emptied out', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        // Edit mode so the (jsdom-unreliable) file-required constraint
        // isn't in play - only the title's required attribute matters here.
        render(
            <PhotoForm
                mode="edit"
                initialData={{
                    title: 'Old title',
                    url: 'https://example.com/existing.jpg',
                }}
                onSubmit={onSubmit}
            />,
        )

        const titleInput = screen.getByLabelText('Title:')
        await user.clear(titleInput)

        await user.click(screen.getByRole('button', { name: 'Update' }))

        expect(onSubmit).not.toHaveBeenCalled()
        expect(titleInput).toBeInvalid()
    })

    it('shows a visible error message when the submit handler rejects', async () => {
        const user = userEvent.setup()
        const onSubmit = vi
            .fn()
            .mockRejectedValue(new Error('Failed to create image'))

        render(<PhotoForm mode="create" onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Title:'), 'Sunset over the bay')
        const file = new File(['binary-image-data'], 'sunset.jpg', {
            type: 'image/jpeg',
        })
        await user.upload(screen.getByLabelText('Image File:'), file)

        fireEvent.submit(
            screen.getByRole('button', { name: 'Upload' }).closest('form')!,
        )

        const alert = await screen.findByRole('alert')
        expect(alert).toHaveTextContent('Failed to create image')

        // The form should be usable again, not stuck disabled.
        expect(
            screen.getByRole('button', { name: 'Upload' }),
        ).not.toBeDisabled()
        // A failed submit must not navigate away from the form.
        expect(mockNavigate).not.toHaveBeenCalled()
    })
})
