import { cascadeProperties, determineProperties, PROPERTIES_TO_CASCADE } from "../../src/utilities/componentProcessing";

const props1 = {
    one: 1,
    two: 2,
    three: 3,
    [PROPERTIES_TO_CASCADE]:["one", "three"]
};

const props2 = {
    one: 1,
    two: 2,
    three: 3
};

test("no properties returned when empty object provided", () => {
    expect(determineProperties()).toEqual({ [PROPERTIES_TO_CASCADE]: [] });
    expect(determineProperties({})).toEqual({ [PROPERTIES_TO_CASCADE]: [] });
})

test("output with cascading properties", () => {
    const output = determineProperties({ props: props1});
    expect(Object.keys(output)).toHaveLength(3);
    expect(output).toEqual(expect.objectContaining({
        one: 1, three: 3, [PROPERTIES_TO_CASCADE]: ["one","three"]
    }));
    expect(output).not.toHaveProperty("two");
})

test("outout without cascading properties", () => {
    const output = determineProperties({ props: props2, names: ["two","three"]});
    expect(Object.keys(output)).toHaveLength(3);
    expect(output).toEqual(expect.objectContaining({
        two: 2, three: 3, [PROPERTIES_TO_CASCADE]: ["two","three"]
    }));
    expect(output).not.toHaveProperty("one");
})

test("adding to property names", () => {
    const output = determineProperties({ props: props1, names: ["two"]});
    expect(Object.keys(output)).toHaveLength(4);
    expect(output).toEqual(expect.objectContaining({
        one: 1, two: 2, three: 3, [PROPERTIES_TO_CASCADE]: ["one","three","two"]
    }));
})