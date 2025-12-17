import { z } from 'zod'

import { getProfileQuery } from '../hooks/useProfileQuery'
import { useProfileChangeMutation } from '../mutations/useProfileChangeMutation'
import { useQueryClient } from '@tanstack/react-query'

const userSchema = z.object({
    username: z.string().optional(),
    email: z.email().optional(),
    password: z.string().optional(),
    age: z
        .string()
        .transform((val) => (val === '' ? undefined : parseInt(val, 10)))
        .pipe(z.number().int().positive().optional()),
    photo: z.string().optional(), // TODO: use refine to check if it's a jpg or something else
    description: z.string().optional(),
    sex: z.string().optional(),
})

export function UserSettings() {
    const response = getProfileQuery()
    const profileChangeMutation = useProfileChangeMutation()
    const queryClient = useQueryClient()

    // if (isLoading) return <div>Loading...</div>
    // if (error) return <div>Error: {error.message}</div>

    async function FormAction(form_data: FormData) {
        const formValues = userSchema.safeParse(Object.fromEntries(form_data))

        if (formValues.success) {
            console.log(formValues.data)

            // filter data
            const filteredData = Object.fromEntries(
                Object.entries(formValues.data).filter(
                    ([_, value]) => value !== '' && value !== undefined
                )
            )

            try {
                await profileChangeMutation.mutateAsync(filteredData)

                await queryClient.invalidateQueries({
                    queryKey: ['profileData'],
                })
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(formValues.error)
        }
    }

    return (
        <>
            <header>Account settings</header>
            <br />
            {profileChangeMutation.error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {profileChangeMutation.error?.message}
                </div>
            )}
            <form action={FormAction}>
                <>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={response.data?.data.username}
                    />
                </>
                <br />
                <>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={response.data?.data.email}
                    />
                </>
                <br />
                <>
                    <label htmlFor="password">Password:</label>
                    <input type="text" id="password" name="password" />
                </>
                <br />
                <>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        defaultValue={response.data?.data.age || ''}
                    />
                </>
                <br />
                <>
                    <label htmlFor="sex">Sex:</label>
                    <input
                        type="text"
                        id="sex"
                        name="sex"
                        defaultValue={response.data?.data.sex || ''}
                    />
                </>
                <br />
                <>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={response.data?.data.description || ''}
                    />
                </>
                <br />
                <>
                    <label htmlFor="photo">Photo file:</label>
                    <input
                        type="text"
                        id="photo"
                        name="photo"
                        defaultValue={response.data?.data.photo || ''}
                    />
                </>
                <br />
                {response.data?.data.photo && (
                    <>
                        <img
                            src={response.data?.data.photo}
                            alt="Profile"
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                    </>
                )}
                <br />
                <button disabled={profileChangeMutation.isPending}>
                    {profileChangeMutation.isPending ? 'Updating...' : 'Update'}
                </button>
            </form>
        </>
    )
}
