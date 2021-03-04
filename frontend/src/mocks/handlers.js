import { rest } from 'msw'

// Sample handlers pulled from react-testing-library tutorial

export const handlers = [
    rest.get('/greeting', (req, res, ctx) => {
        return res(ctx.json({ greeting: 'hello there' }))
    })
]