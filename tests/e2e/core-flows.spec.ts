import { expect, test } from "@playwright/test";

test.describe("Ballot Brief core flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("supports unauthenticated exploration from home to member and bill details", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Start with the candidates on your ballot",
      }),
    ).toBeVisible();
    await expect(page.getByText("Demo mode")).toBeVisible();

    await page.getByRole("link", { name: "Browse all candidates" }).click();
    await expect(
      page.getByRole("heading", { name: "Congressional candidates" }),
    ).toBeVisible();
    await expect(page.getByText("Nancy Pelosi")).toBeVisible();

    await page.getByPlaceholder("Search by name or state...").fill("Pelosi");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/members\?q=Pelosi/);
    await expect(page.getByText("Nancy Pelosi")).toBeVisible();

    await page.getByRole("link", { name: /Nancy Pelosi/ }).click();
    await expect(
      page.getByRole("heading", { name: "Nancy Pelosi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Roll-call votes" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Sponsored legislation",
        exact: true,
      }),
    ).toBeVisible();

    await page.getByRole("link", { name: "H.R. 3890" }).first().click();
    await expect(
      page.getByRole("heading", {
        name: "Veterans Mental Health Access Improvement Act",
      }),
    ).toBeVisible();
    await expect(page.getByText("Latest action")).toBeVisible();
  });

  test("saves locality details and personalizes the dashboard", async ({
    page,
  }) => {
    await page.goto("/profile");

    await page.getByLabel("Display name").fill("Alex");
    await page.getByRole("combobox", { name: "State" }).selectOption("CA");
    await page.getByLabel("U.S. House district").fill("11");
    await page.getByLabel("ZIP code").fill("94102");
    await page.getByRole("button", { name: "Health care" }).click();
    await page.getByRole("button", { name: "Climate" }).click();
    await page.getByRole("button", { name: "Save profile" }).click();

    await expect(page.getByText("Saved.")).toBeVisible();

    await page.getByRole("button", { name: "View my races" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Alex's races" })).toBeVisible();
    await expect(
      page.getByText("Showing federal candidates for California, U.S. House District 11."),
    ).toBeVisible();
    await expect(page.getByText("Nancy Pelosi")).toBeVisible();
    await expect(page.getByText("Health care")).toBeVisible();
    await expect(page.getByText("Climate")).toBeVisible();
  });

  test("state filtering includes senators and house members", async ({ page }) => {
    await page.goto("/members");

    await page.getByRole("combobox", { name: "State" }).selectOption("VA");

    await expect(page.getByText("Mark R. Warner")).toBeVisible();
    await expect(page.getByText("Tim Kaine")).toBeVisible();
    await expect(page.getByText("Virginia District 8")).toBeVisible();
  });

  test("compares candidates and links to their full records", async ({ page }) => {
    await page.goto("/compare?ids=P000197,M001157");

    await expect(
      page.getByRole("heading", { name: "Compare candidates" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nancy Pelosi" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Michael T. McCaul" }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: "View full record" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/members\/P000197/);
    await expect(
      page.getByRole("heading", { name: "Nancy Pelosi" }),
    ).toBeVisible();
  });

  test("documents the local-race integration path", async ({ page }) => {
    await page.goto("/local-races");

    await expect(
      page.getByRole("heading", { name: "State and local election support" }),
    ).toBeVisible();
    await expect(page.getByText("Offices to support")).toBeVisible();
    await expect(page.getByText("Ballot measures and amendments")).toBeVisible();
    await expect(page.getByText("Data integration path")).toBeVisible();
  });
});
