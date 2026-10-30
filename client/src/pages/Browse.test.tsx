import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Browse from "./Browse";
import { makeResource } from "../utils/testUtils";

vi.mock("../components/NavBar", () => ({ default: () => null }));
vi.mock("../components/Footer", () => ({ default: () => null }));

const mockFetchResources = (resources: unknown[]) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => resources,
    }),
  );
};

describe("Browse", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows fetched resources", async () => {
    mockFetchResources([
      makeResource({ _id: "1", title: "DBMS Notes" }),
      makeResource({ _id: "2", title: "OS Question Paper" }),
    ]);

    render(<Browse />);

    expect(await screen.findByText("DBMS Notes")).toBeInTheDocument();
    expect(screen.getByText("OS Question Paper")).toBeInTheDocument();
  });

  it("filters the resources based on the search term", async () => {
    const user = userEvent.setup();
    mockFetchResources([
      makeResource({ _id: "1", title: "DBMS Notes" }),
      makeResource({ _id: "2", title: "OS Question Paper" }),
    ]);

    render(<Browse />);

    expect(await screen.findByText("DBMS Notes")).toBeInTheDocument();
    expect(screen.getByText("OS Question Paper")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search resources:/i), "OS");

    expect(screen.getByText("OS Question Paper")).toBeInTheDocument();
    expect(screen.queryByText("DBMS Notes")).not.toBeInTheDocument();
  });

  it("shows a message when no resources are found", async () => {
    mockFetchResources([]);

    render(<Browse />);

    expect(
      await screen.findByText(/No resources have been uploaded yet/i),
    ).toBeInTheDocument();
  });

  it("fetches the resource with user-selected subject via filter", async () => {
    const user = userEvent.setup();
    mockFetchResources([
      makeResource({ _id: "1", title: "DBMS Fundamentals", subject: "DBMS" }),
      makeResource({ _id: "2", title: "Fluid Dynamics", subject: "Physics" }),
      makeResource({ _id: "3", title: "DBMS PYQ", subject: "DBMS" }),
    ]);

    render(<Browse />);

    expect(await screen.findByText("DBMS Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("Fluid Dynamics")).toBeInTheDocument();
    expect(screen.getByText("DBMS PYQ")).toBeInTheDocument();

    await user.selectOptions(screen.getByDisplayValue("Subject"), "DBMS");

    expect(screen.getByText("DBMS Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("DBMS PYQ")).toBeInTheDocument();
    expect(screen.queryByText("Fluid Dynamics")).not.toBeInTheDocument();
  });

  it("shows a message and a button to clear filters when the filter combination yields no results", async () => {
    const user = userEvent.setup();
    mockFetchResources([
      makeResource({
        _id: "1",
        title: "DBMS Fundamentals",
        subject: "DBMS",
        semester: 5,
      }),
      makeResource({ _id: "2", title: "OS PYQ", subject: "OS", semester: 3 }),
    ]);

    render(<Browse />);

    expect(await screen.findByText("DBMS Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("OS PYQ")).toBeInTheDocument();

    await user.selectOptions(screen.getByDisplayValue("Subject"), "DBMS");
    await user.selectOptions(screen.getByDisplayValue("Semester"), "3");

    expect(
      screen.getByText("No resources match your search or filters."),
    ).toBeInTheDocument();
    expect(screen.getByText("Clear All Filters")).toBeInTheDocument();

    await user.click(screen.getByText("Clear All Filters"));

    expect(screen.getByText("DBMS Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("OS PYQ")).toBeInTheDocument();
  });

  it("shows a message when user's search query yields no results", async () => {
    const user = userEvent.setup();
    mockFetchResources([
      makeResource({ _id: "1", title: "DBMS Fundamentals" }),
    ]);

    render(<Browse />);

    expect(await screen.findByText("DBMS Fundamentals")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search resources:"), "zzz");

    expect(screen.queryByText("DBMS Fundamentals")).not.toBeInTheDocument();
    expect(
      screen.getByText("No resources match your search or filters."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Clear All Filters")).not.toBeInTheDocument();
  });
});
