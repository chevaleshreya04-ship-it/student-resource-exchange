import { render, screen } from "@testing-library/react";
import FilterChips from "./FilterChips";
import userEvent from "@testing-library/user-event";

describe("FilterChips", () => {
  it("renders nothing when there are no filters", () => {
    const { container } = render(
      <FilterChips filters={{}} removeFilter={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a chip for an active filter", () => {
    render(<FilterChips filters={{ semester: "5", subject: "DBMS" }} removeFilter={vi.fn()} />);
    expect(screen.getByText(/semester/i)).toBeInTheDocument();
    expect(screen.getByText(/dbms/i)).toBeInTheDocument()
  });

  it(`clicking a chip's ✕ button calls removeFilter function with the right key`, async () => {
    const removeFilter = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterChips filters={{ semester: "5" }} removeFilter={removeFilter} />,
    );

    await user.click(screen.getByRole("button"));

    expect(removeFilter).toHaveBeenCalledWith("semester");
    expect(removeFilter).toHaveBeenCalledOnce();
  });
});
