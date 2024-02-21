from playwright import sync_api as pw
import pathlib
import threading


class Copilot:
    def __init__(self, page: pw.Page):
        self.page = page
        self.page.goto("https://www.bing.com/chat")
        self.page.click("button.tone-precise")

    def translate(self, texts: list[str], language: str):
        if self.page.locator("#searchbox").is_disabled():
            if self.page.locator("cib-muid-consent").is_visible():
                self.page.locator("button:has-text('Continue')").click()
            else:
                self.page.locator("button:has-text('New topic')").click()
        responses = self.page.locator("cib-message-group[source='bot']").count()
        self.page.locator("#searchbox").fill(
            f"Act as a professional translator, translate the provided sentences into {language},"
            + " answer with a code block containing the translated sentences line by line,"
            + " the sentences are:\n"
            + "\n".join(texts)
        )
        self.page.locator("#searchbox").press("Enter")
        self.page.locator("cib-message-group[source='bot']").locator(
            f"nth={responses}"
        ).locator("cib-message[finalized]").wait_for(timeout=60000)
        return (
            self.page.locator("cib-message-group[source='bot']")
            .locator(f"nth={responses}")
            .locator("code")
            .text_content(timeout=1000)
            .split("\n")
        )


thread_local = threading.local()


def translate(texts, language):
    return thread_local.copilot.translate(texts, language)


def initialize():
    thread_local.p = pw.sync_playwright().start()
    thread_local.browser_context = thread_local.p.chromium.launch_persistent_context(
        pathlib.Path(__file__).parent / "browser_context",
        channel="msedge",
        headless=False,
        locale="en-us",
    )
    thread_local.page = thread_local.browser_context.new_page()
    thread_local.copilot = Copilot(thread_local.page)
