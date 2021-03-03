// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupServer } from "msw/node";

const server = setupServer(
    rest.get('/mswtest', (req, res, ctx) => {
        return res(ctx.json({ greeting: "hello there" }))
    })
)

beforeAll(() => server.listen())