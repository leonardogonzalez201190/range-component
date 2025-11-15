import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { EditableRangeLabel } from "..";

describe("EditableRangeLabel component", () => {
  it("renders initial value with unit", () => {
    render(
      <EditableRangeLabel
        value={42.1234}
        unit="$"
        kind="min"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("editable-value")).toBeInTheDocument();
    expect(screen.getByLabelText("editable-value")).toHaveTextContent("42.12$");
  });

  it("enters edit mode when clicked and not readOnly", async () => {
    const user = userEvent.setup();
    render(
      <EditableRangeLabel
        value={50}
        kind="max"
        onChange={() => {}}
      />
    );

    const label = screen.getByLabelText("editable-value");
    await user.click(label);

    const input = screen.getByRole("spinbutton");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(50);
  });

  it("does not enter edit mode when readOnly", async () => {
    const user = userEvent.setup();
    render(
      <EditableRangeLabel
        value={30}
        kind="min"
        readOnly
        onChange={() => {}}
      />
    );

    const label = screen.getByLabelText("editable-value");
    await user.click(label);

    expect(screen.queryByRole("spinbutton")).toBeNull();
  });

  it("validates minLimit and shows error", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <EditableRangeLabel
        value={10}
        kind="min"
        minLimit={15}
        onChange={handleChange}
      />
    );

    const label = screen.getByLabelText("editable-value");
    await user.click(label);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "5");
    await user.keyboard("{Enter}");

    expect(
      screen.getByTitle("The minimum value cannot be less than 15$")
    ).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("calls onChange with valid value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <EditableRangeLabel
        value={20}
        kind="max"
        maxLimit={50}
        onChange={handleChange}
      />
    );

    const label = screen.getByLabelText("editable-value");
    await user.click(label);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "45");
    await user.keyboard("{Enter}");

    expect(handleChange).toHaveBeenCalledWith(45);
  });
});
