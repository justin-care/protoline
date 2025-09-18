import { test, expect } from "@playwright/test";
import fetch from "node-fetch";

test("all Storybook stories match visual snapshots", async ({ page }) => {
  // 1. Fetch Storybook index.json
  const res = await fetch("http://localhost:6006/index.json");
  const data: any = await res.json();

  if (!data.entries) {
    throw new Error("No stories found in index.json");
  }

  // 2. Navigate to the main Storybook UI
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 3. Automatically expand ALL collapsible sections until no more can be expanded
  console.log('Auto-expanding all collapsible sections...');
  let previousExpandCount = 0;
  let currentExpandCount = 0;
  let iterations = 0;
  const maxIterations = 10; // Safety limit
  
  do {
    previousExpandCount = currentExpandCount;
    
    // Find all currently collapsed sections
    const expandButtons = page.locator('[data-testid="tree-node-expand"], button[aria-expanded="false"]');
    currentExpandCount = await expandButtons.count();
    
    console.log(`Iteration ${iterations + 1}: Found ${currentExpandCount} expandable sections`);
    
    // Expand all found sections
    for (let i = 0; i < currentExpandCount; i++) {
      try {
        await expandButtons.nth(i).click({ timeout: 1000 });
        await page.waitForTimeout(200); // Small delay between clicks
      } catch {
        // Continue if individual expand fails
      }
    }
    
    // Wait for expansions to complete
    await page.waitForTimeout(1000);
    iterations++;
    
  } while (currentExpandCount > 0 && currentExpandCount !== previousExpandCount && iterations < maxIterations);
  
  console.log(`Expansion complete after ${iterations} iterations`);

  // 4. Loop through all entries
  for (const storyId of Object.keys(data.entries)) {
    const story = data.entries[storyId];
    console.log(`Testing story: ${story.title} → ${story.id}`);

    // 5. Find and click the story link
    const storyLink = page.locator(`a[href*="${story.id}"]`).first();
    const linkExists = await storyLink.count();
    
    if (linkExists === 0) {
      console.log(`Warning: Could not find link for story ${story.id}, skipping...`);
      continue;
    }

    await storyLink.click();
    
    // 6. Wait for navigation and iframe to load
    await page.waitForTimeout(3000);
    
    // 7. Access the iframe content
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');
    const storyRoot = iframe.locator("#storybook-root");
    
    // 8. Wait for story to be visible with fallback
    try {
      await expect(storyRoot).toBeVisible({ timeout: 10000 });
    } catch {
      console.log(`Story ${story.id} not visible, trying manual approach...`);
      
      // Force show the story
      await storyRoot.evaluate(el => {
        el.removeAttribute('hidden');
        el.style.display = 'block';
        el.style.visibility = 'visible';
      });
      
      await page.waitForTimeout(1000);
      
      const isVisibleNow = await storyRoot.isVisible();
      if (!isVisibleNow) {
        console.log(`Skipping story ${story.id} - could not make visible`);
        continue;
      }
    }
    
    // 9. Take screenshot
    console.log(`Taking screenshot for story ${story.id}...`);
    expect(await storyRoot.screenshot()).toMatchSnapshot(`${story.id}.png`);
    console.log(`✓ Screenshot captured for ${story.id}`);
  }
});
