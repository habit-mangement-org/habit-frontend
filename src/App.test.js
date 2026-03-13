import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./services/userService", () => ({
  __esModule: true,
  getUsers: jest.fn(() => Promise.resolve([])),
  addScore: jest.fn(() => Promise.resolve({})),
  deleteUser: jest.fn(() => Promise.resolve()),
  updateUser: jest.fn(() => Promise.resolve({})),
}));

test('renders the table header "Name"', () => {
  render(<App />);
  expect(
    screen.getByRole("columnheader", {
      name: /name/i,
    })
  ).toBeInTheDocument();
});
