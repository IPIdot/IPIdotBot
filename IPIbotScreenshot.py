import asyncio
from pathlib import Path
from pyppeteer import launch


async def capture_screenshot(url: str, path: Path, viewport_width: int, viewport_height: int) -> None:
    browser = await launch()
    page = await browser.newPage()
    await page.setViewport({'width': viewport_width, 'height': viewport_height})
    await page.goto(url)
    await page.screenshot({'path': path})
    await browser.close()


def resize_screenshot(original_path: Path, resized_path: Path, width: int, height: int) -> None:
    im = Image.open(original_path)
    im.thumbnail((width, height))
    im.save(resized_path)

async def screenshot(url, viewport_width=1200, viewport_height=800, width=700, height=466, filename="edt.png", resized_filename="reEdt.png"):
    print("Capturing screenshot...")
    original_path = Path(filename)
    resized_path = Path(resized_filename)
    await capture_screenshot(url, original_path, viewport_width, viewport_height)
    print("Done")

